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
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent implements OnInit{

    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    dahsboardItems = null;

    auditPieData: any;
    auditPieOptions : any;


    constructor( 
      public layoutService: LayoutService,
      private _audit : AuditService
    ) {}

    ngOnInit() {
        this.fetchNumbers();

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }


    fetchNumbers(){
        this._audit.getDashboardItems().subscribe(
            (res : any) => {
                this.dahsboardItems = res.data;
                const auditLabels = ['PENDING', 'IN PROGRESS', 'FINISHED'];
                console.log(res.data.audits)
                const data = [res.data.audits.pending, res.data.audits.inProgress, res.data.audits.finished];
                this.initChart(auditLabels, data);
            }
        )
    }

    initChart(labels: any, data: any) {
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
                }
            ]
        };
        this.auditPieOptions = {
            cutout: '60%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: '#003049' // texte titre foncé
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
