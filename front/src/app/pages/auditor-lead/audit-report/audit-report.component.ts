import { Component,OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Customer } from 'src/app/demo/api/customer';
import { AuditService } from 'src/app/services/audit.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { ToastModule } from 'primeng/toast';
import { ElementRef } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';  // ✅ Ajout du module p-table
import { DropdownModule } from 'primeng/dropdown'; 

@Component({
  selector: 'app-audit-report',
  standalone: true,
  imports: [ToastModule, AccordionModule, SharedModule, DataViewModule,TableModule,DropdownModule],
  templateUrl: './audit-report.component.html',
  styleUrls: ['./audit-report.component.scss']
})

export class AuditReportComponent implements OnInit{

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
      public router : Router
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

  goToGererSections(id: string){
      this.router.navigate(['/main/auditLeader/report-sections', id]);
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
