import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { EquipementService } from 'src/app/services/equipements.service';
import { AddEquipementDialogComponent } from 'src/app/shared/dialogs/add-equipement-dialog/add-equipement-dialog.component';
import { CustomConfirmDialogComponent } from 'src/app/shared/dialogs/custom-confirm-dialog/custom-confirm-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-equipements',
  standalone: true,
  imports: [
    SharedModule,
    CustomConfirmDialogComponent,
    AddEquipementDialogComponent,ButtonModule
    
  ],
  templateUrl: './equipements.component.html',
  styleUrl: './equipements.component.scss'
})
export class EquipementsComponent implements OnInit{

  constructor(
    private _equipements : EquipementService,
    private _message : MessageService,
    private _stepper : AuditStepperService
  ){}
  
  rawEquipements = [];
  filteredEquipements = [];
  loading = false;

  updateEquipement : any | null = null;

  deleteEquipementLoading = null;

  getEquipements(){
    this.loading = true;
    this._equipements.findAll().subscribe(
      {
        next : (res : any)=> {
          this.loading = false;
          this.rawEquipements = res.data;
          this.filteredEquipements = this.rawEquipements;
        },
        error : (error : any)=>{
          this.loading = false;
        }
      }
    );
  }
  ngOnInit(): void {
    this.getEquipements();
  }

  handleSearch(e : any){
    this.filteredEquipements = this.rawEquipements.filter(u => u.ref.toLowerCase().includes(e.target.value.toLowerCase()) || u.category.toLowerCase().includes(e.target.value.toLowerCase()))
}

  handleEquipementDelete(){
    if(!this.deleteEquipementLoading) return;
    this._equipements.deleteEquipements(this.deleteEquipementLoading._id).subscribe(
      {
        next : (res : any) => {
          this.rawEquipements = this.rawEquipements.filter(e => e._id != res.data._id);
          this.filteredEquipements = [...this.rawEquipements];
          this.deleteEquipementLoading = null;
          this._message.add({ severity : 'success', summary : "Equipement deleted successfully"})
        },
        error : (err : any) => {
          this.deleteEquipementLoading = null;
          this._message.add({ severity : 'danger', summary :"Error on deleting equipements "})
        },
        
      }
    )
  }

  handleEditSelect(eq : any){
    this._stepper.setSelectedEquiepemnt(eq);
    this.updateEquipement=eq
  }

  handleEditDismiss(){
    this.updateEquipement=null;
    this._stepper.setSelectedEquiepemnt(null);
  }

  updateEquipementCallback(edited : any){
    const index = this.rawEquipements.findIndex(e => e._id === edited.data._id);
    this.rawEquipements[index] = edited.data;
    this.filteredEquipements = this.rawEquipements;
  }
}
