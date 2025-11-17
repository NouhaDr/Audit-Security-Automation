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
  selector: 'app-client-report',
  standalone: true,
  imports: [ToastModule, AccordionModule, SharedModule, DataViewModule,TableModule,DropdownModule
    ],
  templateUrl: './client-report.component.html',
  styleUrl: './client-report.component.scss'
})
export class ClientReportComponent implements OnInit{

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
  
    feedbackText: string = '';
    feedbackDialogVisible : boolean = false;

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
          switchMap(u => this._audits.findByClient(u.id))
        ).subscribe(
          (res : any) => {
              this.loading = false;
              this.audits = res.data; 
              this.filteredAudits = res.data;
          }
        )
        
    }
  
    goToGererSections(id: string){
        this.router.navigate(['/main/client/client-report-sections', id]);
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

  }