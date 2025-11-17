import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { Subscription, switchMap } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuditService } from 'src/app/services/audit.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,
  ],
  templateUrl: './audit-lead-home.component.html',
  styleUrl: './audit-lead-home.component.scss'
})
export class AuditLeadHomeComponent implements OnInit, OnDestroy {

    items!: MenuItem[];
    products!: Product[];
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;
    dahsboardItems = null;
    filteredAudits: any[] = [];
    audits: any[] = [];
    pendingAudits: any[] = [];
    finishedAudits: any[] = [];
    inprogressAudits:any[] = [];
    loading: boolean = true;
    auditPieData: any;
    auditPieOptions: any;

    auditsWithFeedback: any[] = [];

    constructor( 
      public layoutService: LayoutService,
      private _audits: AuditService,
      private _auth: AuthService,
    ) {}
    ngOnInit() {
        this.getAudits();
        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
        
    }
    
    getAudits() {
        this.loading = true;
        this.subscription = this._auth.authenticatedUser$.pipe(
            switchMap(u => this._audits.findByAuditLeader(u.id))
        ).subscribe(
            (res: any) => {
                this.loading = false;
                this.audits = res.data; 
                this.pendingAudits = res.data.filter((audit: any) => audit.status === "PENDING");
                this.inprogressAudits = res.data.filter((audit: any) => audit.status === "IN PROGRESS");
                this.finishedAudits = res.data.filter((audit: any) => audit.status === "FINISHED");
    
                const auditLabels = ['PENDING', 'IN PROGRESS', 'FINISHED'];
                const data = [this.pendingAudits.length, this.inprogressAudits.length, this.finishedAudits.length];
                this.initChart(auditLabels, data);

                 // 👇 Ici tu filtres une fois que audits est bien rempli
                this.auditsWithFeedback = this.audits.filter(audit => audit.feedback && audit.feedback.trim() !== '');
                console.log(this.auditsWithFeedback);

            }
        );
    }
    
    fetchNumbers() {
        this._audits.getDashboardItems().subscribe(
            (res: any) => {
                this.dahsboardItems = res.data;
                const auditLabels = ['PENDING', 'IN PROGRESS', 'FINISHED'];
                const data = [res.data.audits.pending, res.data.audits.inProgress, res.data.audits.finished];
                this.initChart(auditLabels, data);
            }
        );
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
                        '#006400' 
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
