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
  selector: 'app-scan-history',
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
  templateUrl: './scan-history.component.html',
  styleUrl: './scan-history.component.scss'
})
export class ScanHistoryComponent {

   audits: any[] = [];
    selectedAudit: any | null = null;
    loading: boolean = true;
    imagesUrl = environment.userImagesUrl;
  
    scanning: boolean = false;
  
    scans: any[] = [];
  
    dialogVisible = false;
    selectedVulns: any[] = [];
    selectedScanId: string | null = null
  
    tooltipVisible: boolean = false;

  
    constructor(
      private auditService: AuditService,
      private authService: AuthService,
      private scanService : ScanService,
      private messageService: MessageService
    ) {}
  
    ngOnInit(): void {
      this.getAuditsForAuditor();
    
      // 🔁 Rafraîchir les scans toutes les 5 secondes si un audit est sélectionné
      setInterval(() => {
        if (this.selectedAudit) {
          this.loadScansForAudit(this.selectedAudit._id);
        }
      }, 3000);
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
  
    loadScansForAudit(auditId: string) {
      this.scanService.getByAudit(auditId).subscribe({
        next: (res: any) => {
          this.scans = res.data;
        },
        error: (err) => {
          console.error('❌ Failed to load scans:', err);
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
