import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuditService } from 'src/app/services/audit.service';
import { switchMap ,map,of,catchError} from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SectionService } from 'src/app/services/section.service';
import { MessageService } from 'primeng/api';
import { ScanService } from 'src/app/services/scan.service';

@Component({
  selector: 'app-auditor-home',
  standalone: true,
  imports: [ CommonModule,
    FormsModule,
    ChartModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule
  ],
  templateUrl: './auditor-home.component.html',
  styleUrl: './auditor-home.component.scss'
})
export class AuditorHomeComponent implements OnInit {

  items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    dahsboardItems = null;

    auditPieData: any;
    auditPieOptions : any;

    audits: any[] = [];
    pendingAudits: any[] = [];
    finishedAudits: any[] = [];
    inprogressAudits : any[] = [];
    loading: boolean = true;

    sections: any[] = [];


    scanStatusData: any;
    scanStatusOptions: any;

    constructor( 
      public layoutService: LayoutService,
      private _audit : AuditService,
      private _auth : AuthService,
      private _sectionService: SectionService,
      private _message: MessageService,
      private _scanService: ScanService
    ) {}

    ngOnInit() {
      
        this.getAudits();

        const auditLabels = ['PENDING', 'IN PROGRESS', 'FINISHED'];
        const data = [this.pendingAudits.length, this.inprogressAudits.length, this.finishedAudits.length];
        this.fetchNumbers();

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }


    rejectedSections(auditId: string) {
      return this._sectionService.findSectionsByAuditId(auditId).pipe(
          map((data: any[]) => {
              if (!data || data.length === 0) {
                  return 0; // Aucune section rejetée
              }
              return data.filter(section => section.status === "rejected").length;
          }),
          catchError(error => {
              console.error(`Erreur lors de la récupération des sections pour audit ${auditId}`, error);
              return of(0); // Retourne 0 en cas d'erreur
          })
      );
  }
  

    updateChart() {
      const auditLabels = ['PENDING', 'IN PROGRESS', 'FINISHED'];
      const data = [this.pendingAudits.length, this.inprogressAudits.length, this.finishedAudits.length];
  
      this.initChart(auditLabels, data);
    }

    fetchNumbers() {
      this._audit.getDashboardItems().subscribe(
        (res: any) => {
          this.dahsboardItems = res.data;
          this.updateChart();
        }
      );
    }


    
    getAudits() {
        this.loading = true;
      
        this._auth.authenticatedUser$.pipe(
          switchMap(u => this._audit.findByAuditor(u.id))
        ).subscribe(
          (res: any) => {
            this.loading = false;
            this.audits = res.data.map(audit => ({
              ...audit,
              rejectedSectionsCount: 0 // Initialisation
            }));
      
            // Filtrage audits
            this.pendingAudits = res.data.filter((audit: any) => audit.status === "PENDING");
            this.finishedAudits = res.data.filter((audit: any) => audit.status === "FINISHED");
            this.inprogressAudits = res.data.filter((audit: any) => audit.status === "IN PROGRESS");
      
            // Charger le nombre de sections rejetées pour chaque audit
            this.audits.forEach(audit => {
              this.rejectedSections(audit._id).subscribe(count => {
                audit.rejectedSectionsCount = count;
              });
            });
      
            // ➡ Charger les scans pour tous les audits
            this.loadAllScans(this.audits.map(audit => audit._id));
          }
        );
      }
      
      initScanStatusChart(scans: any[]) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
      
        const scanStatusCounts = {
          requested: 0,
          queued: 0,
          running: 0,
          in_progress: 0,
          done: 0,
          failed: 0
        };
      
        scans.forEach(scan => {
          if (scan.status && scanStatusCounts.hasOwnProperty(scan.status)) {
            scanStatusCounts[scan.status]++;
          }
        });
      
        this.scanStatusData = {
          labels: ['Requested', 'Queued', 'Running', 'In Progress', 'Done', 'Failed'],
          datasets: [{
            data: [
              scanStatusCounts.requested,
              scanStatusCounts.queued,
              scanStatusCounts.running,
              scanStatusCounts.in_progress,
              scanStatusCounts.done,
              scanStatusCounts.failed
            ],
            backgroundColor: [
              '#f9844a', // requested
              '#f9c74f', // queued
              '#90be6d', // running
              '#43aa8b', // in_progress
              '#577590', // done
              '#f94144'  // failed
            ],
            hoverBackgroundColor: [
              '#f8961e',
              '#f9844a',
              '#43aa8b',
              '#4d908e',
              '#277da1',
              '#d00000'
            ]
          }]
        };
      
        this.scanStatusOptions = {
          cutout: '60%',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                color: textColor
              }
            }
          }
        };
      }
      
  
      loadAllScans(auditIds: string[]) {
        const allScans: any[] = [];
      
        auditIds.forEach(auditId => {
          this._scanService.getByAudit(auditId).subscribe(
            (res: any) => {
              if (res.data && Array.isArray(res.data)) {
                allScans.push(...res.data);
      
                // Après avoir accumulé les scans, construire la chart
                this.initScanStatusChart(allScans);
              }
            },
            error => {
              console.error(`Erreur lors de la récupération des scans pour l'audit ${auditId}`, error);
            }
          );
        });
      }
      
    initChart(labels : any, data : any) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        this.auditPieData = {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: [
                        '#c1121f',
                        '#669bbc', 
                        '#6a994e' 
                    ],
                    hoverBackgroundColor: [
                        '#a50e19',
                        '#5a8ea3',
                        '#31572c'
                        
                    ]
                }]
        };
        this.auditPieOptions = {
            cutout: '60%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };

    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
