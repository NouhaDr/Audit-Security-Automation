import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, of, switchMap, take, tap } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SharedModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit{
  auditors: any[] = [];
  clients: any[] = [];
  imagesUrl = environment.userImagesUrl;

  createAuditForm : FormGroup;

  filteredAuditors: any[] = [];

  selectedAuditors: any[] = [];
  selectedClient : any| null = null; 

  constructor(
    private _formBuilder : FormBuilder,
    private _router : Router,
    private _auditStepper : AuditStepperService,
    private _audit : AuditService,
) { }

  ngOnInit() {
    this.initForm();
    this._auditStepper.selectedAuditID$.pipe(
      take(1),
      switchMap(id => {
        if(!id) return of()
          return this._audit.findAuditContactInfosById(id)
      })
    ).pipe(
      map((res : any) => res.data)
    )
    .subscribe(
      (res : any) => {
        this.createAuditForm.patchValue({
          ...res,
          auditors : res.auditors.map(e =>`${e.firstName} ${e.lastName}`),
          client : res.client.firstName
        });
      }
    )
  }

  initForm(){
    this.createAuditForm =  this._formBuilder.group({
      auditors : ['', [ Validators.required, Validators.minLength(1) ]],
      client : ['', Validators.required],
      organisationName : ['', Validators.required],
      contactNumber : ['', Validators.required],
      phoneNumber : ['', Validators.required],
      website : ['', Validators.required],
      employeesNumber : ['', Validators.required],
      employeesInPerimeter : ['', Validators.required],
      contactName : ['', Validators.required],
      contactEmail : ['', Validators.required],
  });
  this.createAuditForm.disable();
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

  goNext(){
    this._auditStepper.setForm('contact', {
      ...this.createAuditForm.value, 
      auditors : this.selectedAuditors, 
      client : this.selectedClient 
    });

    this._auditStepper.selectedAuditID$.pipe(
      take(1),
      switchMap((id : string | null) => {
        if(id){
          return this._router.navigateByUrl(`/main/auditor/add-audit-stepper/${id}/infrastructure`);
        } 
        return of(null)
      })
    ).subscribe()
  }
}
