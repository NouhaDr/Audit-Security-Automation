import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuditService } from 'src/app/services/audit.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-edit-audit-dialog',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './edit-audit-dialog.component.html',
  styleUrl: './edit-audit-dialog.component.scss'
})
export class EditAuditDialogComponent implements OnInit, OnChanges {
  
  @Input() selectedAudit: any | null = null;
  @Output() callback: any = new EventEmitter();
  @Input() editDialogVisible = false;
  @Output() dismiss = new EventEmitter();

  imagesUrl = environment.userImagesUrl;
  submitted = false;

  filteredAuditors: any[] = [];
  filteredAuditleaders: any[] = [];

  selectedAuditors: any[] = [];
  selectedAuditleaders: any[] = [];

  auditors: any[] = [];
  auditleaders: any[] = [];
  clients: any[] = [];

  createAuditForm: FormGroup; 

  constructor(
    private _audit: AuditService,
    private _users: UserService,
    private fb: FormBuilder,
    private _message: MessageService
  ) {}

  ngOnInit(): void {
    this.fetchAuditors();
    this.fetchAuditLeaders();
    this.fetchClients();

    this.createAuditForm = this.fb.group({
      auditors: ['', [Validators.required, Validators.minLength(1)]],
      auditleaders: ['', [Validators.required, Validators.minLength(1)]], // ✅ Ajouté ici
      client: ['', Validators.required],
      organisationName: [this.selectedAudit?.organisationName, Validators.required],
      contactNumber: [this.selectedAudit?.contactNumber, Validators.required],
      phoneNumber: [this.selectedAudit?.phoneNumber, Validators.required],
      website: [this.selectedAudit?.website, Validators.required],
      employeesNumber: [this.selectedAudit?.employeesNumber, Validators.required],
      employeesInPerimeter: [this.selectedAudit?.employeesInPerimeter, Validators.required],
      contactName: [this.selectedAudit?.contactName, Validators.required],
      contactEmail: [this.selectedAudit?.contactEmail, Validators.required],
    });
  }

  fetchAuditors() {
    this._users.findAllAuditors().subscribe(
      (res: any) => {
        this.auditors = res.data;
        this.filteredAuditors = res.data; // ✅ Initialisation correcte
      }
    );
  }

  fetchAuditLeaders() {
    this._users.findAllAuditleaders().subscribe(
      (res: any) => {
        this.auditleaders = res.data;
        this.filteredAuditleaders = res.data; // ✅ Initialisation correcte
      }
    );
  }

  fetchClients() {
    this._users.findAllClients().subscribe(
      (res: any) => {
        this.clients = res.data;
      }
    );
  }

  ngOnChanges(changes: any) {
    if (changes.selectedAudit && this.selectedAudit) {
      this.createAuditForm.patchValue({
        ...this.selectedAudit,
        client: this.selectedAudit?.client._id,
        auditors: this.selectedAudit?.auditors.map(e => e._id),
        auditleaders: this.selectedAudit?.auditleaders?.map(e => e._id), // ✅ Ajouté ici
      });
    }
  }

  filterAuditors(event: any) {
    const query = event.query.toLowerCase();
    this.filteredAuditors = this.auditors.filter(auditor =>
      auditor.firstName.toLowerCase().includes(query)
    );
  }

  filterAuditleaders(event: any) {
    const query = event.query.toLowerCase();
    this.filteredAuditleaders = this.auditleaders.filter(auditleader =>
      auditleader.firstName.toLowerCase().includes(query)
    );
  }

  handleUpdate() {
    if (!this.createAuditForm.valid) {
      this._message.add({ severity: 'error', summary: 'Please fill all fields' });
      return;
    }

    this.submitted = true;
    this._audit.updateAudit(this.selectedAudit._id, this.createAuditForm.value).subscribe({
      next: (res: any) => {
        this._message.add({ severity: 'success', summary: res.message });
        this.submitted = false;
        this.callback.emit(res.data);
      },
      error: (err: any) => {
        this.submitted = false;
        this._message.add({ severity: 'error', summary: err.message });
      },
    });
  }

  onDismiss() {
    this.dismiss.emit(false);
    this.createAuditForm.reset();
  }
}
