import { Component, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { map } from 'rxjs';
import { Customer } from 'src/app/demo/api/customer';
import { AuditService } from 'src/app/services/audit.service';
import { UserService } from 'src/app/services/user.service';
import { AuditInfosDialogComponent } from 'src/app/shared/dialogs/audit-infos-dialog/audit-infos-dialog.component';
import { CustomConfirmDialogComponent } from 'src/app/shared/dialogs/custom-confirm-dialog/custom-confirm-dialog.component';
import { EditAuditDialogComponent } from 'src/app/shared/dialogs/edit-audit-dialog/edit-audit-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-all-audits',
  standalone: true,
  imports: [
    SharedModule,
    CustomConfirmDialogComponent,
    AuditInfosDialogComponent,
    EditAuditDialogComponent,
    PaginatorModule
  ],
  templateUrl: './all-audits.component.html',
  styleUrl: './all-audits.component.scss'
})
export class AllAuditsComponent {

    imagesUrl = environment.userImagesUrl;
    customers1: Customer[] = [];
    audits: any[] = [];
    filteredAudits: any[] = [];
    auditors: any[] = [];
    auditDeleteLoading  : string | null = null;
    dialogVisible = false;
    selectedAudit : any | null = null;

    selectedUser : any | null = null;
    editDialogVisible = false;
    
    rowGroupMetadata: any;
    loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private _audits : AuditService,
        private _user : UserService,
        private _message : MessageService
    ) { }

    ngOnInit() {
        this.getAudits();
        this.loadAllAuditors();
    }

    getAudits(){
        this.loading = true;
        this._audits.findAllAudits()
        .pipe(
            map((res : any) => res.data.map(e => ({...e, equipements: this.groupEquipementsByCategory(e.equipements)})))
        )
        .subscribe(
            (res : any) => {
                this.loading = false;
                this.audits = res; 
                this.filteredAudits = res; 
            }
        )
    }

    loadAllAuditors(){
        this._user.findAllAuditors().subscribe(
            (res : any) => {
                this.auditors = res.data
            }
        )
    }

    showDetails(audit : any){
        this.selectedAudit = audit;
    }

    selectAuditToDlete(id : string){
        this.auditDeleteLoading = id;
    }
    handleAuditDelete(){
        this._audits.deleteAudit(this.auditDeleteLoading).subscribe(
            {
                next : (res : any)=> {
                    this.audits = this.audits.filter(a => a._id != res.data._id)
                    this.filteredAudits = this.audits;
                    this.clearLoading();
                    this._message.add({ severity : 'success', summary : res.message })
                },
                error : (err)=> this.clearLoading()
            }
        )
    }

    clearLoading(){
        this.auditDeleteLoading = null;
    }

    handleSearch(e : any){
        this.filteredAudits = this.audits.filter(u => u.organisationName.toLowerCase().includes(e.target.value.toLowerCase()))
    }

    handleAuditEdit(audit : any){
      this.selectedAudit=audit;
      this.editDialogVisible=true;
    }

    handleEditDismiss(){
      this.selectedAudit = null;
      this.editDialogVisible = false;
    }

    handleAuditUpdate(event : any){
        const index = this.audits.findIndex(u => u._id === event._id);
        this.audits[index] = event;
        this.editDialogVisible = !this.editDialogVisible;
        this.selectedUser = null;
    }

    groupEquipementsByCategory(equipements : any[]){
        let grouped = [];
        for (let i = 0; i < equipements.length; i++) {
          const element = equipements[i];
          const category = element.category;
          if(!grouped[category]){
            grouped[category] = [];
          }
          grouped[category].push(element);
        }
    
        return Object.keys(grouped).map(key => ({
          category: key,
          icon : this.setCatgeoryIcon(key),
          items: grouped[key]
        }));
      }
    
      setCatgeoryIcon(key : string){
        switch (key) {
          case 'Réseau et sécurité':
            return 'pi pi-sitemap'
          case 'Serveurs':
            return 'pi pi-server'
          case 'Service d\'annuaires (IAM Identity and Access Management Solutions)':
            return 'pi pi-lock'
          case 'Système d\'exploitation':
            return 'pi pi-microsoft'
          case 'Systèmes de gestion de cloud':
            return 'pi pi-cloud'
          case 'Middleware':
            return 'pi pi-code'
          case 'Firmware':
            return 'pi pi-code'
          case 'Équipements industriels':
            return 'pi pi-cog'
          default:
            return 'pi-angle-right'
        }
      }
}
