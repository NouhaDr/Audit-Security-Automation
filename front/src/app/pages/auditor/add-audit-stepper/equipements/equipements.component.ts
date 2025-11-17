import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { map, of, switchMap, take, tap } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { AddEquipementDialogComponent } from 'src/app/shared/dialogs/add-equipement-dialog/add-equipement-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-equipements',
  standalone: true,
  imports: [
    SharedModule,
    AddEquipementDialogComponent
  ],
  templateUrl: './equipements.component.html',
  styleUrl: './equipements.component.scss'
})
export class EquipementComponent implements OnInit{

  addEquipementDialogVisible = false;

  selectedEquipement = null;
  groupedEquipements = [];
  rawEquipements = [];
  dialoagMode = '';

  constructor(
    public _router : Router,
    private _auditStepper : AuditStepperService,
    private fb : FormBuilder,
    public route : ActivatedRoute,
    public _audit : AuditService,
    public _message : MessageService,

  ){}


  oranginisationForm : FormGroup;

  equipementForm$ = this._auditStepper.equipementForm$;

  ngOnInit(): void {
    this.fetchAuditEquipements();
    this.oranginisationForm = this.fb.group({
      organisationName : ['default org name']
    })
  }

  handleSubmit(){
    this._auditStepper.setForm('oragnisation', this.oranginisationForm.value);
  }

  showAddDialog(){
    this.addEquipementDialogVisible = true;
    this.dialoagMode = 'add';
  }

  addNewEquipementCallback(event : any){
    this.addEquipementDialogVisible = false;
    if(event.action == "add"){
      this.rawEquipements = [...this.rawEquipements, event.data];
    }else{
      const index = this.rawEquipements.findIndex(e => e._id === event.data._id);
      this.rawEquipements[index] = event.data;
      if(this.selectedEquipement && this.selectedEquipement._id == event.data._id) this.selectedEquipement = event.data
    }
    this.groupEquipementsByCategory()
  }

  fetchAuditEquipements(){
    this._auditStepper.selectedAuditID$.pipe(
      take(1),
      switchMap(id => {
        if(!id){
          return of(null)
        }
        return this._audit.findAuditEquipements(id).pipe(
          tap((res : any) => {
            this.rawEquipements = res.data;
            this.groupEquipementsByCategory()
          }),
        )
      })
    ).subscribe();
  }


  groupEquipementsByCategory(){
    this.groupedEquipements = [];
    for (let i = 0; i < this.rawEquipements.length; i++) {
      const element = this.rawEquipements[i];
      const category = element.category;
      if(!this.groupedEquipements[category]){
        this.groupedEquipements[category] = [];
      }
      this.groupedEquipements[category].push(element);
    }  
  }

  getKeys(obj: any): string[] {
    const keys = Object.keys(obj);
    return keys;
  }

  handleEquipementShow(item : any){
    this.selectedEquipement = item
  }

  handleEquipementEdit(item : any){
    this.dialoagMode = 'update';
    this._auditStepper.setSelectedEquiepemnt(item);
    this.addEquipementDialogVisible = true;
  }
  
  handleEquipementRemove(item : any){
    const res = confirm('Dou you want to delete this equipement ?');
    if(!res) return;
    this._auditStepper.selectedAuditID$.pipe(
      take(1),
      switchMap(id=> {
        if(!id){
          return of()
        }
        return this._audit.removeEquipementFromAudit(id, item._id).pipe(
          tap((res : any) => {
            if(this.selectedEquipement && item._id === this.selectedEquipement._id) {
              this.selectedEquipement = null;
            }
            this.rawEquipements = this.rawEquipements.filter(e => e._id != res.data._id);
            this.groupEquipementsByCategory();
            this._message.add({ severity : 'success', summary : res.message })
          })
        )
      })
    ).subscribe();
  }

  goNext(){
    this._auditStepper.selectedAuditID$.pipe(
      take(1),
      switchMap((id : string | null) => {
        if(id){
          return this._router.navigateByUrl(`/main/auditor/add-audit-stepper/${id}/questionnaire`);
        } 
        return of(null)
      })
    ).subscribe()
  }

  goBack(){
    this._auditStepper.selectedAuditID$.pipe(
      take(1),
      switchMap((id : string | null) => {
        if(id){
          return this._router.navigateByUrl(`/main/auditor/add-audit-stepper/${id}/contact`);
        } 
        return of(null)
      })
    ).subscribe()
  }
}




