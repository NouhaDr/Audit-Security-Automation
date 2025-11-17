import { Component, ElementRef, ViewChild , ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import { Customer } from 'src/app/demo/api/customer';
import { AuditService } from 'src/app/services/audit.service';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { AuthService } from 'src/app/services/auth.service';
import { AuditInfosDialogComponent } from 'src/app/shared/dialogs/audit-infos-dialog/audit-infos-dialog.component';
import { EditAuditDialogComponent } from 'src/app/shared/dialogs/edit-audit-dialog/edit-audit-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { CardModule } from 'primeng/card';
import { AddSectionDialogComponent } from 'src/app/shared/dialogs/add-section-dialog/add-section-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';  // Importation du DialogService

@Component({
  selector: 'app-add-section',
  standalone: true,
  imports: [
    SharedModule,
    CardModule,
    AddSectionDialogComponent,

  ],
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss'],
  providers: [DialogService]
})
export class AddSectionComponent {
  imagesUrl = environment.userImagesUrl;
  customers1: Customer[] = [];
  audits: any[] = [];
  filteredAudits: any[] = [];
  auditors: any[] = [];
  dialogVisible = false;
  selectedAudit: any | null = null; 
  selectedAuditForProgressChange: any | null = null;
  selectedAuditForDataView: any | null = null;

  selectedUser: any | null = null;
  editDialogVisible = false;
  progressDialogVisible = false;
  
  rowGroupMetadata: any;
  loading: boolean = true;

  displayDialog: boolean = false;

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private _audits: AuditService,
    private _auth: AuthService,
    public router: Router,
    private _stepper: AuditStepperService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef 
  ) { }

  ngOnInit() {
    this.getAudits();
  }

  getAudits() {
    this.loading = true;
    
    this._auth.authenticatedUser$.pipe(
      switchMap(u => this._audits.findByAuditor(u.id))
    ).subscribe(
      (res: any) => {
          this.loading = false;
          this.audits = res.data; 
          this.filteredAudits = res.data; 
          console.log("audits",this.filteredAudits);
      }
    );
  }

  openAddSectionDialog(audit: any) {
    this.displayDialog = false;  // Fermer explicitement
    this.cdr.detectChanges();    // Forcer la mise à jour de l'affichage
    this.selectedAudit = audit._id; 
    this.displayDialog = true;   // Ouvrir à nouveau le dialogue
  }

  // Gérer la mise à jour d'un audit
  handleAuditUpdate(event: any) {
    const index = this.audits.findIndex(u => u._id === event._id);
    if (index !== -1) {
      this.audits[index] = event;
    }
  }

  goToGererSections(id: string){
    this.router.navigate(['/main/auditor/gerer-sections', id]);
  }


  // Fonction pour sélectionner un audit et changer son progrès
  selectAuditToChnageProgress(audit: any) {
    this.progressDialogVisible = true;
    this.selectedAuditForProgressChange = audit;
  }

  // Annuler la fenêtre modale de progrès
  dismissProgressDialog(audit: any) {
    this.progressDialogVisible = false;
    this.selectedAuditForProgressChange = null;
    const index = this.audits.findIndex(e => e._id === audit._id);
    if (index != -1) {
      this.audits[index].progress = audit.progress;
    }
  }

  // Fonction pour organiser les équipements par catégorie
  groupEquipementsByCategory(equipements: any[]) {
    let grouped = [];
    for (let i = 0; i < equipements.length; i++) {
      const element = equipements[i];
      const category = element.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(element);
    }

    return Object.keys(grouped).map(key => ({
      category: key,
      icon: this.setCatgeoryIcon(key),
      items: grouped[key]
    }));
  }

  // Fonction pour définir l'icône de chaque catégorie
  setCatgeoryIcon(key: string) {
    switch (key) {
      case 'Réseau et sécurité':
        return 'pi pi-sitemap';
      case 'Serveurs':
        return 'pi pi-server';
      case 'Service d\'annuaires (IAM Identity and Access Management Solutions)':
        return 'pi pi-lock';
      case 'Système d\'exploitation':
        return 'pi pi-microsoft';
      case 'Systèmes de gestion de cloud':
        return 'pi pi-cloud';
      case 'Middleware':
        return 'pi pi-code';
      case 'Firmware':
        return 'pi pi-code';
      case 'Équipements industriels':
        return 'pi pi-cog';
      default:
        return 'pi-angle-right';
    }
  }

  getSeverity(status: string): string {
    switch (status) {
        case 'PENDING':
            return 'warning';
        case 'FINISHED':
            return 'success';
        case 'IN PROGRESS':
            return 'info';
        default:
            return 'secondary';
    }
}

  
}
