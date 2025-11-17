import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuditService } from 'src/app/services/audit.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-edit-section-dialog',
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
  templateUrl: './edit-section-dialog.component.html',
  styleUrls: ['./edit-section-dialog.component.scss']
})
export class EditSectionDialogComponent implements OnChanges {
  @Input() displayDialog: boolean = false;
  @Output() displayDialogChange = new EventEmitter<boolean>();
  @Input() section: any;
  @Input() selectedAuditId: string = '';
  @Output() sectionUpdated = new EventEmitter<void>();

  sectionForm!: FormGroup;
  labelValue: string = '';
  selectedType: string = '';
  dynamicChamps: { label: string, type: string, value: any }[] = [];

  fieldTypes = [
    { label: 'Text', value: 'text' },
    { label: 'Textarea', value: 'textarea' },
    { label: 'Email', value: 'email' },
    { label: 'Number', value: 'number' },
    { label: 'Date', value: 'date' }
  ];

  constructor(
    private fb: FormBuilder,
    private auditService: AuditService,
    private messageService: MessageService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['section'] && this.section) {
      this.initializeForm();
    }
  }

  initializeForm() {
    this.dynamicChamps = this.section.champs ? [...this.section.champs] : [];

    this.sectionForm = this.fb.group({
      nom: new FormControl(this.section?.nom || '')
    });
  }

  addChamp(label: string, type: string) {
    if (!label || !type) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Label and type are required.' });
      return;
    }
    this.dynamicChamps.push({ label, type, value: '' });
    this.labelValue = '';
    this.selectedType = '';
  }

  removeChamp(index: number) {
    this.dynamicChamps.splice(index, 1);
  }

  submitForm() {
    if (!this.sectionForm.get('nom')?.value || this.dynamicChamps.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Name and at least one field are required.' });
      return;
    }

    const sectionData = {
      nom: this.sectionForm.get('nom')?.value,
      champs: this.dynamicChamps
    };

    this.updateSectionFromAudit(this.selectedAuditId, this.section._id, sectionData);
  }

  updateSectionFromAudit(auditId: string, sectionId: string, sectionData: { nom: string, champs: any }) {
    this.auditService.updateSectionFromAudit(auditId, sectionId, sectionData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Section updated !' });
        this.sectionUpdated.emit();
        this.displayDialog = false;
        this.sectionForm.reset();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update section.' });
      }
    });
  }
  closeDialog() {
    this.displayDialogChange.emit(false);
    this.displayDialog = false;
    this.sectionForm.reset();
  }
}
