import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { catchError, of, tap } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-add-audit',
  standalone: true,
  imports: [
    SharedModule,
    MultiSelectModule ,DropdownModule, ButtonModule ,TooltipModule,InputTextModule
  ],
  templateUrl: './add-audit.component.html',
  styleUrl: './add-audit.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class AddAuditComponent  implements OnInit {
   
  submitted = false;
  auditors: any[] = [];
  auditleaders : any[] = [];
  clients: any[] = [];
  imagesUrl = environment.userImagesUrl;

  createAuditForm : FormGroup;

  filteredAuditors: any[] = [];
  filteredAuditleaders: any[] = [];

  selectedAuditors: any[] = [];
  selectedAuditleaders: any[] = [];

  selectedAuditor = [];
  selectedAuditleader = [];

  constructor(
    private _user : UserService, 
    private _formBuilder : FormBuilder,
    private _toast : ToastService,
    private _audit : AuditService,
    private _message : MessageService
) { }

  fetchAuditors(){
    this._user.findAllAuditors().subscribe(
        (res : any) => {
            this.filteredAuditors = res.data
        }
    )
  }
  fetchClients(){
    this._user.findAllClients().subscribe(
        (res : any) => {
            this.clients = res.data
        }
    )
  }

  fetchAuditLeaders() {
    this._user.findAllAuditleaders().subscribe(
        (res: any) => {
            this.auditleaders = res.data;
            this.filteredAuditleaders = res.data; 
        }
    );
}

  ngOnInit() {
    this.fetchAuditors();
    this.fetchClients();
    this.fetchAuditLeaders();
    this.createAuditForm = this._formBuilder.group({
      auditors: [this.selectedAuditor.map(e => e._id), [Validators.required, Validators.minLength(1)]],
      auditleaders: [this.selectedAuditleader.map(e => e._id), [Validators.required, Validators.minLength(1)]], // ✅ Ajouté ici
      client: ['', Validators.required],
      organisationName: ['', Validators.required],
      contactNumber: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      website: ['', Validators.required],
      employeesNumber: ['', Validators.required],
      employeesInPerimeter: ['', Validators.required],
      contactName: ['', Validators.required],
      contactEmail: ['', Validators.required],
  });
  
  }
  filterAuditors(event: any) {
      const filtered: any[] = [];
      const query = event.query;
      for (let i = 0; i < this.auditors.length; i++) {
          const auditor = this.auditors[i];
          if (auditor.firstName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(auditor);
          }
      }
      this.filteredAuditors = filtered;
  }
  // code mtaa auditleader
  filterAuditleaders(event: any) {
    const query = event.query.toLowerCase();
    this.filteredAuditleaders = this.auditleaders.filter(auditleader =>
        auditleader.firstName.toLowerCase().includes(query)
    );
}

  handleSubmit(){
    if(!this.createAuditForm.valid){
      this._toast.setError("Missing or Invalid fields, please try again !");
      this.submitted = false;
      return;
    }
    this.submitted = true;
    this._audit.createAudit(this.createAuditForm.value).pipe(
      tap((r: any) => {
        this.submitted = false;
        this._message.add({ severity : 'success', summary : r.message });
      }),
      catchError(err => {
        this.submitted = false;
        return of(err)
      })
    ).subscribe();
  }
}
