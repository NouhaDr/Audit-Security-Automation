import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { SectionService } from 'src/app/services/section.service';
import { CommonModule } from '@angular/common';
import { EditSectionDialogComponent } from 'src/app/shared/dialogs/edit-section-dialog/edit-section-dialog.component';
import { ToastModule } from 'primeng/toast';
import { CustomConfirmDialogComponent } from 'src/app/shared/dialogs/custom-confirm-dialog/custom-confirm-dialog.component';
import { AuditService } from 'src/app/services/audit.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-gerer-sections',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    AccordionModule,
    EditSectionDialogComponent,
    CustomConfirmDialogComponent,
    ToastModule,
    TableModule
  ],
  templateUrl: './gerer-sections.component.html',
  styleUrls: ['./gerer-sections.component.scss']
})
export class GererSectionsComponent implements OnInit {
  @ViewChild('confirmationDialog') confirmationDialog!: CustomConfirmDialogComponent;
  auditId: string = '';
  sections: any[] = [];
  selectedSection: any = null;
  selectedSectionId: string | null = null;
  displayEditDialog: boolean = false;
  form!: FormGroup;
  items: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _sectionService: SectionService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private _auditService: AuditService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.auditId = params.get('id') || '';
      if (this.auditId) {
        this.loadSections();
      } else {
        console.error("ID de l'audit manquant !");
      }
    });

    this.form = this.fb.group({});
  }

  loadSections() {
    this._sectionService.findSectionsByAuditId(this.auditId).subscribe({
      next: (data: any[]) => {
        this.sections = data.filter(section => section.status === "not confirmed");

        this.items = this.sections.map(section => ({
          label: section.nom,
          icon: 'pi pi-folder',
          id: section._id
        }));

        if (this.selectedSection) {
          const updated = this.sections.find(s => s._id === this.selectedSection._id);
          this.selectedSection = updated ? { ...updated } : null;
          this.initializeUserInputs();
        }
      },
      error: (err) => {
        console.error('Erreur chargement sections:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: "failed t retreve sections"
        });
      }
    });
  }

  initializeUserInputs() {
    if (this.selectedSection) {
      const controls: { [key: string]: FormControl } = {};
      Object.keys(this.selectedSection.champs || {}).forEach((key) => {
        controls[key] = new FormControl(this.selectedSection.champs[key] || "");
      });
      this.form = this.fb.group(controls);
    } else {
      this.form = this.fb.group({});
    }
  }

  // ✅ Correction ici
  editSection(section: any) {
    this.selectedSection = { ...section };
    this.initializeUserInputs();

    this.displayEditDialog = false;
    setTimeout(() => {
      this.displayEditDialog = true;
    }, 0);
  }

  openConfirmationDialog(sectionId: string) {
    this.selectedSectionId = sectionId;
    if (this.confirmationDialog) {
      this.confirmationDialog.show();
    }
  }

  handleSectionDelete() {
    if (!this.auditId || !this.selectedSectionId) return;

    this._auditService.deleteSectionFromAudit(this.auditId, this.selectedSectionId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Section deleted.' });
        this.loadSections();
      },
      error: (err) => {
        console.error("Erreur suppression:", err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Failed to delete section." });
      }
    });
  }

  clearLoading() {
    this.selectedSectionId = null;
  }
}
