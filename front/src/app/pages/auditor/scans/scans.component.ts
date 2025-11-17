import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { AuditService } from 'src/app/services/audit.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { ScanService } from 'src/app/services/scan.service';
import { MessageService } from 'primeng/api';

// ✅ PrimeNG modules
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';

import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ShowVulnerabilitiesDialogComponent } from 'src/app/shared/dialogs/show-vulnerabilities-dialog/show-vulnerabilities-dialog.component';

@Component({
  selector: 'app-scans',
  standalone: true,
  imports: [
  CommonModule,
    FormsModule,
    DropdownModule,
    AvatarModule,
    AvatarGroupModule,
    ButtonModule,
    TooltipModule,
    ProgressSpinnerModule,
    ShowVulnerabilitiesDialogComponent
  ],
  templateUrl: './scans.component.html',
  styleUrls: ['./scans.component.scss']
})
export class ScansComponent implements OnInit {

  audits: any[] = [];
  selectedAudit: any | null = null;
  loading: boolean = true;
  imagesUrl = environment.userImagesUrl;

  scanning: boolean = false;

  scans: any[] = [];

  dialogVisible = false;
  selectedVulns: any[] = [];
  selectedScanId: string | null = null;

  scanForm = {
    ip: '',
    typeScanId: ''  // Change 'typeScan' to 'typeScanId' to match the backend's expectations
  };
  

  scanTypes = [];

  constructor(
    private auditService: AuditService,
    private authService: AuthService,
    private router: Router,
    private scanService : ScanService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAuditsForAuditor();
    this.getScanConfigs(); // Charger les types de scan à l'initialisation du composant

    // 🔁 Rafraîchir les scans toutes les 5 secondes si un audit est sélectionné
    setInterval(() => {
      if (this.selectedAudit) {
        this.loadScansForAudit(this.selectedAudit._id);
      }
    }, 3000);
  }
  

  getScanConfigs() {
    this.scanService.getScanConfigs().subscribe({
      next: (res: any) => {
        if (res && res.configs) {
          // Mappage correct des configurations
          this.scanTypes = res.configs.map((config: any) => ({
            label: config.name,
            value: config.id // ✅
          }));          
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'No Configs Found',
            detail: 'No scan configurations available from the API.'
          });
        }
      },
      error: (err) => {
        console.error('❌ Error fetching scan configs:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'API Error',
          detail: 'An error occurred while fetching scan configurations.'
        });
      }
    });
}

  
  

  getAuditsForAuditor() {
    this.loading = true;
    this.authService.authenticatedUser$.pipe(
      switchMap(user => this.auditService.findByAuditor(user.id))
    ).subscribe((res: any) => {
      this.audits = res.data;
      this.loading = false;
    });
  }

  onAuditSelected() {
    if (this.selectedAudit) {
      this.loadScansForAudit(this.selectedAudit._id);
    }
  }

  /*loadScansForAudit(auditId: string) {
    this.scanService.getByAudit(auditId).subscribe({
      next: (res: any) => {
        this.scans = res.data;
      },
      error: (err) => {
        console.error('❌ Failed to load scans:', err);
      }
    });
  }*/

    loadScansForAudit(auditId: string) {
      this.scanService.getByAudit(auditId).subscribe({
        next: (res: any) => {
          const allScans = res.data || [];
    
          // Statuts des scans considérés comme "en cours"
          const runningStatuses = ['requested', 'queued', 'running', 'in_progress'];
    
          // Filtrer uniquement les scans en cours
          const runningScans = allScans.filter((scan: any) =>
            runningStatuses.includes(scan.status)
          );
    
          // Mettre à jour la liste des scans affichés
          this.scans = runningScans;
        },
        error: (err) => {
          console.error('❌ Failed to load scans:', err);
          this.scans = [];
        }
      });
    }
    
    
  

    onScanLaunch() {
      if (!this.selectedAudit) return;
    
      // Assurez-vous que 'typeScanId' est bien défini dans le formulaire
      console.log("Selected Type Scan ID:", this.scanForm.typeScanId);
    
      const payload = {
        auditId: this.selectedAudit._id,
        ip: this.scanForm.ip,
        typeScan: this.scanForm.typeScanId// Utilisez 'typeScanId' au lieu de 'typeScan'
      };
    
      localStorage.setItem('scanInProgress', 'true');
      this.scanning = true;
    
      console.log("📤 Launching scan with payload:", payload);
    
      this.scanService.launchScan(payload).subscribe({
        next: (res: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Scan Started',
            detail: 'The scan was launched and the file was transferred successfully.'
          });
    
          this.scanning = false;
          this.loadScansForAudit(this.selectedAudit!._id); // Rafraîchit la liste des scans
        },
        error: (err) => {
          console.error('❌ Error launching scan:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Launch Failed',
            detail: 'An error occurred while starting the scan.'
          });
    
          this.scanning = false;
        }
      });
    }
    
    
    

  
  showVulnerabilities(scan: any) {
    this.scanService.getVulnerabilitiesByScan(scan._id).subscribe({
      next: (res: any) => {
        this.selectedVulns = res.vulnerabilities;
        this.selectedScanId = scan._id;
        this.dialogVisible = true;
      },
      error: (err) => {
        console.error('❌ Error loading vulnerabilities:', err);
        alert('Error loading vulnerabilities.');
      }
    });
  }

  onDialogHide() {
    this.selectedScanId = null;
    this.dialogVisible = false;
  }

}