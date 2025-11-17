import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { ScanService } from 'src/app/services/scan.service';
import { AuditService } from 'src/app/services/audit.service';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms'; // ⬅️ important, car tu utilises [(ngModel)]
import { ButtonModule } from 'primeng/button';
import { FeedbackDialogComponent } from 'src/app/shared/dialogs/feedback-dialog/feedback-dialog.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-client-home',
  standalone: true,
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.scss'],
  imports: [
    CommonModule,ChartModule,PanelModule,
    FormsModule,ButtonModule,FeedbackDialogComponent,ToastModule
  ],
  providers: [MessageService]
})
export class ClientHomeComponent implements OnInit {

  audits: any[] = [];
  riskMatrixData: any;
  riskMatrixOptions: any;
  feedback: string = ''; 
  auditId: string = ''; 


  pendingAudits: any[] = [];
  finishedAudits: any[] = [];
  inprogressAudits : any[] = [];
  loading: boolean = true;

  feedbackText: string = '';
  feedbackDialogVisible : boolean = false;
  selectedAudit : any | null = null;


  @ViewChild('filter') filter!: ElementRef;


  constructor(
    private _audits: AuditService,
    private _auth: AuthService,
    private scanService: ScanService,
    private messageService: MessageService 
  ) {}

  ngOnInit(): void {
    this._auth.authenticatedUser$.pipe(
      switchMap(user => this._audits.findByClient(user.id))
    ).subscribe({
      next: (res: any) => {
        this.audits = res.data;
        
        if (this.audits.length > 0) {
          const allAuditIds = this.audits.map(a => a._id);
          this.loadRiskMatrixForClient(allAuditIds); // 🚀
        }
      }
    });
  }
  
  

  loadRiskMatrixForClient(auditIds: string[]) {
    const scanRequests = auditIds.map(id => this.scanService.getByAudit(id).toPromise());
  
    Promise.all(scanRequests).then((scanResults: any[]) => {
      const allScans = scanResults.flatMap(r => r.data || []);
  
      const vulnRequests = allScans.map(scan => 
        this.scanService.getVulnerabilitiesByScan(scan._id).toPromise()
          .then((res: any) => res.vulnerabilities || [])
      );
  
      Promise.all(vulnRequests).then((vulnArrays: any[][]) => {
        const allVulns = vulnArrays.flat();
        this.renderBubbleMatrix(allVulns); // Maintenant tu as TOUTES les vulnérabilités du client
      });
  
    }).catch(err => {
      console.error('Error loading client risk matrix:', err);
    });
  }
  

  getAudits() {
    this.loading = true;

    this._auth.authenticatedUser$.pipe(
        switchMap(u => this._audits.findByClient(u.id))
    ).subscribe(
        (res: any) => {
            this.loading = false;
            this.audits = res.data.map(audit => ({
                ...audit,
                rejectedSectionsCount: 0 // Initialisation du compteur
            }));

            // Filtrage des audits selon leur statut
            this.pendingAudits = res.data.filter((audit: any) => audit.status === "PENDING");
            this.finishedAudits = res.data.filter((audit: any) => audit.status === "FINISHED");
            this.inprogressAudits = res.data.filter((audit: any) => audit.status === "IN PROGRESS");

        }
    );
}

  
submitFeedback(feedback: string) {
  if (this.selectedAudit) {
    const updatedAudit = {
      ...this.selectedAudit,
      feedback: feedback
    };

    this._audits.updateAudit(this.selectedAudit._id, updatedAudit).subscribe({
      next: (res) => {
        console.log('Feedback mis à jour', res);
        this.feedbackDialogVisible = false;

        // ✅ Afficher un toast succès
        this.messageService.add({
          severity: 'success',
          summary: 'Feedback Sent',
          detail: 'Your feedback has been successfully submitted!',
          life: 3000
        });
      },
      error: (err) => {
        console.error('Erreur mise à jour feedback', err);

        // ❌ Afficher un toast d'erreur
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while submitting your feedback.',
          life: 3000
        });
      }
    });
  }
}


  // Ouvrir le dialog pour un audit
  openFeedbackDialog(audit: any) {
    this.selectedAudit = audit;
    this.feedbackText = audit.feedback || '';
    this.feedbackDialogVisible = true;
  }
  

  renderBubbleMatrix(vulns: any[]) {
    // 1. Grouper les vulnérabilités par gravité
    const severityCounts = new Map<number, { count: number, samples: any[] }>();
  
    for (const vuln of vulns) {
      const score = parseFloat(vuln.cvss || "0");
      const gravity = this.mapCVSS(score);
  
      if (!severityCounts.has(gravity)) {
        severityCounts.set(gravity, { count: 0, samples: [] });
      }
  
      const group = severityCounts.get(gravity)!;
      group.count += 1;
      group.samples.push(vuln); // garder un exemple pour le label
    }
  
    // 2. Construire les points du graphique
    const riskPoints = Array.from(severityCounts.entries()).map(([gravity, { count, samples }]) => {
      const example = samples[0];
      return {
        x: gravity,
        y: count,
        r: 10 + count * 2,
        label: `${count} vulnerabilities (${example.cve || 'no CVE'})`
      };
    });
  
    this.riskMatrixData = {
      datasets: [{
        label: 'Vulnerabilities',
        data: riskPoints,
        backgroundColor: riskPoints.map(p => this.mapMatrixScoreColor(p.x)),
        borderColor: 'rgba(0,0,0,0.1)'
      }]
    };
  
    this.initRiskMatrixOptions(); // Rendu
  }
  
  
  mapCVSS(score: number): number {
    if (score >= 9) return 4;       // Critique
    if (score >= 7) return 3;       // Grave
    if (score >= 4) return 2;       // Important
    return 1;                       // Limité
  }
  
  estimateLikelihood(score: number, index: number): number {
    // Simule un niveau de vraisemblance (1=minime à 4=maximale)
    return ((index % 4) + 1);
  }
  
  
  mapMatrixScoreColor(score: number): string {
    switch (score) {
      case 1: return 'rgba(1, 95, 1, 0.7)';   // Vert
      case 2: return 'rgba(252, 239, 54, 0.7)';   // Jaune clair
      case 3: return 'rgba(255, 196, 68, 0.7)';     // Orange
      case 4: return 'rgba(255,102,0,0.7)';     // Orange foncé
      case 5: return 'rgba(192,0,0,0.7)';       // Rouge
      default: return 'rgba(200,200,200,0.5)';  // Gris fallback
    }
  }
  

  initRiskMatrixOptions() {
    this.riskMatrixOptions = {
      aspectRatio: 1,
      layout: { padding: 20 },
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const x = ctx.raw.x;
              const y = ctx.raw.y;
              const label = ctx.raw.label || '';
              return [
                `${label}`,
                `Severity: ${['Low', 'Medium', 'High', 'Critical'][x - 1]}`,
                `Likelihood: ${['Unlikely', 'Possible', 'Likely', 'Very Likely'][y - 1]}`
              ];
            }
            
          }
        },
        legend: { display: false }
      },
      scales: {
        x: {
          min: 0.5,
          max: 4.5,
          ticks: {
            stepSize: 1,
            callback: (v: number) => ['Low', 'Medium', 'High', 'Critical'][v - 1],
            color: '#000'
          },
          title: {
            display: true,
            text: 'Occurrences',
            color: '#000'
          }          
        },
        y: {
          min: 0.5,
          max: 4.5,
          ticks: {
            stepSize: 1,
            callback: (v: number) => ['Unlikely', 'Possible', 'Likely', 'Very Likely'][v - 1],
            color: '#000'
          },
          title: {
            display: true,
            text: 'Likelihood',
            color: '#000'
          }
        }
      }
    };
  }

 

}
