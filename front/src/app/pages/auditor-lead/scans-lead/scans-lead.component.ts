import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { AuditService } from 'src/app/services/audit.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { ScanService } from 'src/app/services/scan.service';

// ✅ PrimeNG modules
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ShowVulnerabilitiesDialogComponent } from 'src/app/shared/dialogs/show-vulnerabilities-dialog/show-vulnerabilities-dialog.component';

@Component({
  selector: 'app-scans-lead',
  standalone: true,
  imports: [ CommonModule,
    FormsModule,
    DropdownModule,
    AvatarModule,
    AvatarGroupModule,
    ButtonModule,
    TooltipModule,
    ProgressSpinnerModule,
    DividerModule,
    ShowVulnerabilitiesDialogComponent],

  templateUrl: './scans-lead.component.html',
  styleUrl: './scans-lead.component.scss'
})
export class ScansLeadComponent implements OnInit{

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
    typeScan: ''
  };
  
  scanTypes = [
    { label: 'Full and Fast', value: 'Full and Fast' },
    { label: 'Full and Very Deep', value: 'Full and Very Deep' },
    { label: 'Host Discovery', value: 'Host Discovery' },
    { label: 'System Discovery', value: 'System Discovery' },
    { label: 'Full and Fast Ultimate', value: 'Full and Fast Ultimate' },
  ];
  

  constructor(
    private auditService: AuditService,
    private authService: AuthService,
    private router: Router,
    private scanService : ScanService
  ) {}

  ngOnInit(): void {
    this.getAuditsForAuditor();
  
  }
  

  getAuditsForAuditor() {
    this.loading = true;
    this.authService.authenticatedUser$.pipe(
      switchMap(user => this.auditService.findByAuditLeader(user.id))
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
  
  


  loadScansForAudit(auditId: string) {
    this.scanService.getByAudit(auditId).subscribe({
      next: (res: any) => {
        this.scans = res.data;
      },
      error: (err) => {
        console.error('❌ Erreur chargement des scans :', err);
      }
    });
  }

  
  onScanLaunch() {

    if (!this.selectedAudit) return;
  
    const payload = {
      auditId: this.selectedAudit._id,
      ip: this.scanForm.ip,
      typeScan: this.scanForm.typeScan
    };
  
    localStorage.setItem('scanInProgress', 'true');
  
    this.scanService.launchScan(payload).subscribe({
      next: (res: any) => {
        console.log('✅ Réponse Scan :', res);
        alert('Scan lancé avec succès ✅');
        this.scanning = false; // ✅ attente OFF

      },
      error: (err) => {
        console.error('❌ Erreur lors du scan :', err);
        alert('Erreur lors du lancement du scan ❌');
        this.scanning = false; // ❌ attente OFF
      }
    });
  }
  
  
  showVulnerabilities(scan: any) {
    this.scanService.getVulnerabilitiesByScan(scan._id).subscribe({
      next: (res: any) => {
        this.selectedVulns = res.vulnerabilities;
        this.selectedScanId = scan._id; // 👈 marquer le scan comme actif
        this.dialogVisible = true;
      },
      error: (err) => {
        console.error('❌ Erreur récupération vulnérabilités :', err);
        alert('Erreur lors du chargement des vulnérabilités.');
      }
    });
  }

  onDialogHide() {
    this.selectedScanId = null;
    this.dialogVisible = false;
  }
  
  
  

}
