import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Customer } from 'src/app/demo/api/customer';
import { AuditService } from 'src/app/services/audit.service';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { AuthService } from 'src/app/services/auth.service';
import { AuditInfosDialogComponent } from 'src/app/shared/dialogs/audit-infos-dialog/audit-infos-dialog.component';
import { ChangeAuditProgressDialogComponent } from 'src/app/shared/dialogs/change-audit-progress-dialog/change-audit-progress-dialog.component';
import { CustomConfirmDialogComponent } from 'src/app/shared/dialogs/custom-confirm-dialog/custom-confirm-dialog.component';
import { EditAuditDialogComponent } from 'src/app/shared/dialogs/edit-audit-dialog/edit-audit-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-audits-lead',
  standalone: true,
  imports: [
    SharedModule,
    CustomConfirmDialogComponent,
    AuditInfosDialogComponent,
    EditAuditDialogComponent,
    ChangeAuditProgressDialogComponent
  ],
  templateUrl: './my-audits-lead.component.html',
  styleUrl: './my-audits-lead.component.scss'
})
export class MyAuditsLeadComponent {

    imagesUrl = environment.userImagesUrl;
    customers1: Customer[] = [];
    audits: any[] = [];
    filteredAudits: any[] = [];
    auditors: any[] = [];
    dialogVisible = false;
    selectedAudit : any | null = null;
    selectedAuditForProgressChange : any | null = null;
    selectedAuditForDataView : any | null = null;

    selectedUser : any | null = null;
    editDialogVisible = false;
    progressDialogVisible = false;
    
    rowGroupMetadata: any;
    loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private _audits : AuditService,
        private _auth : AuthService,
        public router : Router,
        private _stepper : AuditStepperService
    ) { }

    ngOnInit() {
        this.getAudits();
    }

    getAudits(){
        this.loading = true;
        
        this._auth.authenticatedUser$.pipe(
          switchMap(u => this._audits.findByAuditLeader(u.id))
        ).subscribe(
          (res : any) => {
              this.loading = false;
              this.audits = res.data; 
              this.filteredAudits = res.data; 
          }
      )
    }

    showDetails(audit : any){
        this.selectedAudit = audit;
        this.dialogVisible = true;
    }
    
    handleSearch(e : any){
        this.filteredAudits = this.audits.filter(u => u.organisationName.toLowerCase().includes(e.target.value.toLowerCase()));
    }

    handleAuditUpdate(event : any){
        const index = this.audits.findIndex(u => u._id === event._id);
        this.audits[index] = event;
        this.editDialogVisible = !this.editDialogVisible;
        this.selectedUser = null;
    }
    goToSections(id: string){
        this.router.navigate(['/main/auditLeader/sections-lead', id]); // Redirection vers le composant SectionsComponent
      }
  
    goToStepper(id : string){
        this._stepper.clearForm();
        this.router.navigate(['/main/audit-leader/overview', id]);
    }

    selectAuditToChangeProgress(audit : any){
        this.progressDialogVisible = true;
        this.selectedAuditForProgressChange = audit;
    }

    dismissProgressDialog(audit : any){
        this.progressDialogVisible = false;
        this.selectedAuditForProgressChange = null;
        const index = this.audits.findIndex(e => e._id === audit._id);
        if(index != -1){
            this.audits[index].progress = audit.progress;
        }
    }

    selectAuditForDataShow(audit : any){
        this.selectedAuditForDataView = {...audit, equipements: this.groupEquipementsByCategory(audit.equipements)};
    }

    groupEquipementsByCategory(equipements : any[]){
        let grouped: { [key: string]: any[] } = {};
        for (let equipement of equipements) {
            const category = equipement.category;
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(equipement);
        }
    
        return Object.keys(grouped).map(key => ({
            category: key,
            icon: this.setCategoryIcon(key),
            items: grouped[key]
        }));
    }
    
    setCategoryIcon(key : string){
        switch (key) {
            case 'Réseau et sécurité': return 'pi pi-sitemap';
            case 'Serveurs': return 'pi pi-server';
            case 'Service d\'annuaires (IAM Identity and Access Management Solutions)': return 'pi pi-lock';
            case 'Système d\'exploitation': return 'pi pi-microsoft';
            case 'Systèmes de gestion de cloud': return 'pi pi-cloud';
            case 'Middleware': return 'pi pi-code';
            case 'Firmware': return 'pi pi-code';
            case 'Équipements industriels': return 'pi pi-cog';
            default: return 'pi-angle-right';
        }
    }
   
  
}
