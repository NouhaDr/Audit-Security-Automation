import { Component, EventEmitter, Input, Output, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';

import { AuditService } from 'src/app/services/audit.service';
import { SectionService } from 'src/app/services/section.service';

@Component({
  selector: 'app-add-section-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    DividerModule,
    ToastModule,
    DropdownModule
  ],
  templateUrl: './add-section-dialog.component.html',
  styleUrls: ['./add-section-dialog.component.scss'],
  providers: [MessageService, AuditService]
})
export class AddSectionDialogComponent implements OnChanges {
  @Input() displayDialog: boolean = false;
  @Input() selectedAuditId: string = '';
  @Output() dialogClosed: EventEmitter<boolean> = new EventEmitter();

  sectionForm: FormGroup;
  submitted = false;

  labelValue: string = '';
  selectedType: string = '';

  fieldTypes = [
    { label: 'Text', value: 'text' },
    { label: 'Textarea', value: 'textarea' },
    { label: 'Email', value: 'email' },
    { label: 'Number', value: 'number' },
    { label: 'Date', value: 'date' }
  ];

  dynamicChamps: { label: string, type: string, value: any }[] = [];

  constructor(
    private fb: FormBuilder,
    private auditService: AuditService,
    private sectionService: SectionService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {
    this.sectionForm = this.fb.group({
      nom: ['', Validators.required],
      champs: this.fb.group({}) // Placeholder if needed for other validations
    });
  }

  addChamp(label: string, type: string) {
    if (!label || !type) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Both label and type are required.' });
      return;
    }

    this.dynamicChamps.push({ label, type, value: '' });
    this.labelValue = '';
    this.selectedType = '';
    this.cdr.detectChanges(); // Forcer le rafraîchissement de l’interface
  }

  removeChamp(index: number) {
    this.dynamicChamps.splice(index, 1);
    this.cdr.detectChanges(); // Pour s'assurer que l'UI est à jour immédiatement
  }

  submitForm() {
    if (!this.sectionForm.get('nom')?.value || this.dynamicChamps.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Section name and at least one field are required.' });
      return;
    }

    const sectionData = {
      nom: this.sectionForm.get('nom')?.value,
      champs: this.dynamicChamps
    };

    this.addSectionToAudit(this.selectedAuditId, sectionData);
  }

  addSectionToAudit(auditId: string, sectionData: { nom: string, champs: any }) {
    this.auditService.addSectionToAudit(auditId, sectionData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Section Added!' });
        this.refreshSections(auditId);
        this.dialogClosed.emit(true);
        this.displayDialog = false;
        this.sectionForm.reset();
        this.dynamicChamps = [];
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add the section.' });
      }
    });
  }

  refreshSections(auditId: string) {
    this.auditService.findById(auditId).subscribe({
      next: (audit: any) => {
        console.log("Updated audit with sections: ", audit);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to refresh sections.' });
      }
    });
  }

  onDismiss() {
    this.dialogClosed.emit(false);
    this.displayDialog = false;
    this.sectionForm.reset();
    this.dynamicChamps = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedAuditId'] && this.selectedAuditId) {
      this.sectionForm.reset();
      this.dynamicChamps = [];
    }
  }
}
