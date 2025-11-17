import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SectionService } from 'src/app/services/section.service';
import { CommonModule } from '@angular/common';
import { ListboxModule } from 'primeng/listbox'; 
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps'; 
import { DividerModule } from 'primeng/divider';
import { FormBuilder, FormGroup, FormControl,Validators ,FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuditService } from 'src/app/services/audit.service';
import { switchMap, map, take, of ,tap ,forkJoin} from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';
import { UserService } from 'src/app/services/user.service';
import { ChipsModule } from 'primeng/chips';
import { TableModule } from 'primeng/table';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-sections',
  standalone: true,
  imports :[ StepsModule, ToastModule, ListboxModule, CardModule, InputTextModule, 
    ButtonModule, DividerModule, CommonModule, ReactiveFormsModule,
    ChipsModule,TableModule,FormsModule
  ],
  templateUrl: './sections-lead.component.html',
  styleUrls: ['./sections-lead.component.scss']
})
export class SectionsLeadComponent implements OnInit {
  sections: any[] = [];
  stepItems: any[] = [];
  selectedSection: any = null;
  activeIndex: number = 0;
  auditId: string = ''; 
  form!: FormGroup;
  questions: any[] = []; 
  rawEquipements: any[] = []; 
  groupedEquipements: any = {}; 
  addEquipementDialogVisible = false;
  selectedEquipement: any = null;
  dialogMode = '';
  organisationForm : FormGroup;
  equipementToDelete: any | null = null;
  createAuditForm!: FormGroup;
  audit : any = null;

  filteredFiles : any[] = [];
  files : any[] = [];
  loading = false;

  addFileDialogVisible = false;

  remark: string = ""; 

  constructor(
    private _sectionService: SectionService,
    private _audit: AuditService,
    private _questionnaire: QuestionService,
    private _message: MessageService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _router: Router,
    private _confirmation :ConfirmationService,
    private _userService :UserService,    private cdRef: ChangeDetectorRef // ✅ Injecte ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.auditId = this.route.snapshot.paramMap.get('id')!;

    if (!this.auditId) {
        this._message.add({ severity: 'error', summary: 'Erreur', detail: "Aucun ID d'audit trouvé." });
        return;
    }

    // ✅ Récupérer les détails de l'audit
    this._audit.findById(this.auditId).pipe(take(1)).subscribe({
        next: (res: any) => {
            this.audit = res.data;
            // Appel à initializeContactForm seulement après la récupération de l'audit
            if (this.audit) {
              this.initializeContactForm(); // Initialiser le formulaire après la récupération des données
          } else {
              this._message.add({ severity: 'error', summary: 'Erreur', detail: "Audit data is not available." });
          }
        },
        error: (err) => {
            console.error("❌ Erreur lors de la récupération de l'audit :", err);
            this._message.add({ severity: 'error', summary: 'Erreur', detail: "Impossible de récupérer l'audit." });
        }
    });

    // ✅ Récupérer et filtrer les sections de l'audit
    this._sectionService.findSectionsByAuditId(this.auditId).subscribe(
        (data: any[]) => {
            if (!data || data.length === 0) {
                this.sections = [];
                this.stepItems = [];
                this.selectedSection = null;
                this._message.add({
                    severity: 'info',
                    summary: 'Info',
                    detail: "No sections available."
                });
                return;
            }

            // ✅ Filtrer uniquement les sections "confirmed" et "fixed"
            this.sections = data.filter(section => 
                ["confirmed", "fixed"].includes(section.status)
            );

            // ✅ Vérifier s'il reste des sections après filtrage
            if (this.sections.length === 0) {
                this.stepItems = [];
                this.selectedSection = null;
                this._message.add({
                    severity: 'info',
                    summary: 'Info',
                    detail: "No confirmed or corrected sections available."
                });
                return;
            }

            // ✅ Construire le stepper avec les sections valides
            this.stepItems = this.sections.map(section => ({ label: section?.nom }));

            // ✅ Sélectionner la première section (si disponible)
            this.activeIndex = 0;
            this.selectedSection = this.sections.length > 0 ? this.sections[this.activeIndex] : null;


            if (this.sections.some(section => section?.nom === 'Infrastructure')) {
              this.fetchAuditEquipements();
            }

            if (this.sections.some(section => section?.nom === 'Questionnaire')) {
              this.fetchQuestions();
            }

            this.fetchFiles();
            

        },
        (error) => {
            console.error("❌ Erreur lors de la récupération des sections :", error);
            this._message.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Failed to retreive audit sections"
            });
        }
    );
}

  sendRemark() { 
    if (!this.selectedSection || !this.auditId) return;

    // Création de l'objet de mise à jour avec "remark"
    const updatedData = {
      nom: this.selectedSection.nom,
      champs: this.selectedSection.champs,
      remark: this.remark || "" // ✅ Assurer que "remark" est bien envoyé
    };

    console.log("📌 Mise à jour de la section avec :", updatedData); // ✅ Debugging

    // ✅ Appel du service avec l'auditId et l'ID de la section
    this._audit.updateSectionFromAudit(this.auditId, this.selectedSection._id, updatedData).subscribe({
      next: (res) => {
        console.log("✅ Section mise à jour :", res);
        this._message.add({
          severity: "success",
          detail: "Remark submitted successfully."
        });

        // ✅ Mise à jour locale pour refléter le changement sans recharger toute la page
        this.selectedSection.remark = this.remark;
      },
      error: (err) => {
        console.error("❌ Erreur lors de la mise à jour :", err);
        this._message.add({
          severity: "error",
          summary: "Erreur",
          detail: "Failed to update section."
        });
      }
    });
  }



  validateSection(sectionId: string): void {
    if (!sectionId) {
      this._message.add({
        severity: 'error',
        summary: 'Error',
        detail: "Missing section ID."
      });
      return;
    }

    const sectionData = { status: "validated" };

    this._audit.validateSection(this.auditId, this.selectedSection._id, sectionData).subscribe({
      next: () => {
        this._message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Section validated successfully'
        });

        this.refreshSections();
      },
      error: () => {
        this._message.add({
          severity: 'error',
          summary: 'Error',
          detail: "Failed to validate section"
        });
      }
    });
  }

  rejectSection(sectionId: string): void {
    if (!sectionId) {
      this._message.add({
        severity: 'error',
        summary: 'Error',
        detail: "Missing section ID."
      });
      return;
    }

    const sectionData = { status: "rejected" };

    this._audit.rejectSection(this.auditId, this.selectedSection._id, sectionData).subscribe({
      next: () => {
        this._message.add({
          severity: 'warn',
          summary: 'Rejected',
          detail: 'Section rejected successfully'
        });

        this.refreshSections();
      },
      error: () => {
        this._message.add({
          severity: 'error',
          summary: 'Error',
          detail: "Failed to reject section"
        });
      }
    });
  }

  refreshSections() {
    this._sectionService.findSectionsByAuditId(this.auditId).subscribe(
        (data: any[]) => {
            if (!data || data.length === 0) {
                this.sections = [];
                this.stepItems = [];
                this.selectedSection = null;
                this._message.add({
                    severity: 'info',
                    summary: 'Info',
                    detail: "No sections available."
                });

                // ✅ Forcer la détection des changements
                this.cdRef.detectChanges();
                return;
            }

            // ✅ Filtrer uniquement les sections ayant le statut "confirmed" ou "fixed"
            this.sections = data.filter(section =>
                ["confirmed", "fixed"].includes(section.status)
            );

            // ✅ Vérification des sections exclues (Debugging)
            console.log("❌ Sections exclues (confirmed/validated) :", 
                data.filter(section => ["not confirmed", "validated", "rejected"].includes(section.status))
            );

            // ✅ Construire le stepper avec les sections conservées
            this.stepItems = this.sections.map(section => ({ label: section.nom }));

            // ✅ Sélectionner la première section disponible
            this.selectedSection = this.sections.length > 0 ? this.sections[0] : null;
            this.activeIndex = this.selectedSection ? 0 : null;

            // ✅ Forcer la détection des changements après mise à jour
            this.cdRef.detectChanges();

            // ✅ Message d'information si aucune section valide n'est disponible
            if (!this.selectedSection) {
                this._message.add({
                    severity: 'info',
                    summary: 'Info',
                    detail: "No sections available after filtering."
                });
            }
        },
        (error) => {
            this._message.add({
                severity: 'error',
                summary: 'Error',
                detail: "Unable to retrieve the updated sections."
            });

            // ✅ Forcer la détection des changements en cas d'erreur
            this.cdRef.detectChanges();
        }
    );
  }


  
  initializeUserInputs() {
    if (!this.selectedSection) return;

    console.log("📌 Section sélectionnée :", this.selectedSection); // ✅ Debugging

    const controls: { [key: string]: FormControl } = {};

    // Désactiver tous les champs sauf "remark"
    if (this.selectedSection.champs) {
      Object.keys(this.selectedSection.champs).forEach((key) => {
        controls[key] = new FormControl(
          { value: this.selectedSection.champs[key] || "", disabled: true } // ❌ Désactivé
        );
      });
    }

    // ✅ Activer uniquement "remark"
    controls["remark"] = new FormControl(this.selectedSection.remark || "");

    this.form = new FormGroup(controls);

    console.log("📌 Formulaire initialisé avec :", this.form.value); // ✅ Debugging
  }


  //Contactttt
  initializeContactForm() { 
    if (!this.audit) {
        console.error('Audit data is not available.');
        return; // Si `this.audit` est null ou undefined, on arrête l'exécution de la méthode
    }

    this.createAuditForm = this.fb.group({
        client: [{ 
            value: `${this.audit.client?.firstName || ''} ${this.audit.client?.lastName || ''}`.trim(), 
            disabled: true 
        }], 
        
        auditors: [{ 
            value: this.audit?.auditors?.map(auditor => `${auditor?.firstName} ${auditor?.lastName}`) || [], 
            disabled: true 
        }], 
        
        organisationName: [{ value: this.audit?.organisationName || '', disabled: true }, Validators.required],
        contactNumber: [{ value: this.audit?.contactNumber || '', disabled: true }, Validators.required],
        phoneNumber: [{ value: this.audit?.phoneNumber || '', disabled: true }, Validators.required],
        website: [{ value: this.audit?.website || '', disabled: true }],
        employeesNumber: [{ value: this.audit?.employeesNumber || '', disabled: true }, Validators.required],
        employeesInPerimeter: [{ value: this.audit?.employeesInPerimeter || '', disabled: true }],
        contactName: [{ value: this.audit?.contactName || '', disabled: true }, Validators.required],
        contactEmail: [{ value: this.audit?.contactEmail || '', disabled: true }, Validators.required]
    });
  }


  initForm() {
    this.organisationForm = this.fb.group({
      organisationName: ['default org name']
    });
  }



  //Equipementtt

  fetchAuditEquipements() {
  if (!this.auditId) return;

  this._audit.findAuditEquipements(this.auditId).pipe(
    take(1),
    tap((res: any) => {
      this.rawEquipements = res.data;
      console.log("eqip", this.rawEquipements);
      this.groupEquipementsByCategory();
    }),
  ).subscribe();
  }

  groupEquipementsByCategory() {
    this.groupedEquipements = {}; 
  
    this.rawEquipements.forEach(equipement => {
      const category = equipement.category || 'Uncategorized';
  
      if (!this.groupedEquipements[category]) {
        this.groupedEquipements[category] = [];
      }
      this.groupedEquipements[category].push(equipement);
    });
  
    console.log("✅ Équipements groupés par catégorie :", this.groupedEquipements);
  }
  
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }


  handleEquipementShow(item: any) {
    if (this.selectedEquipement === item) {
        this.selectedEquipement = null; // Cache les infos si on clique à nouveau
    } else {
        this.selectedEquipement = item; // Affiche les infos
    }
  }

  //Questionnaireee

  fetchQuestions() {
    console.log("📌 Récupération des questions pour l'audit:", this.auditId);

    this._audit.findAuditQuestionnaire(this.auditId).pipe(
      take(1),
      switchMap((res: any) => {
        if (res.data.length !== 0) {
          return of(res.data);
        }

        return this._questionnaire.findAll().pipe(
          map((res: any) => res.data.map(e => ({ question: e, response: null })))
        );
      })
    ).subscribe(
      res => {
        this.questions = res;
      },
      error => {
        console.error("❌ Erreur lors de la récupération des questions:", error);
      }
    );
  }

  trackByKey(index: number, item: any): any {
    return item.key; 
  }

  // 📂 Gestion des fichiers

  fetchFiles() {
    if (!this.auditId) {
        console.warn("⚠️ Audit ID manquant, impossible de récupérer les fichiers.");
        return;
    }

    this.loading = true;
    this._audit.findById(this.auditId).pipe(
        take(1),
        tap({
            next: (res: any) => {
                this.loading = false;
                this.files = res.data?.files || []; // Vérifie si 'files' existe
                this.filteredFiles = [...this.files]; 
                console.log("✅ Fichiers récupérés :", this.files);
            },
            error: () => {
                this.loading = false;
                console.error("❌ Erreur de récupération des fichiers.");
                this._message.add({ severity: "error", summary: "Erreur", detail: "Impossible de récupérer les fichiers." });
            }
        })
    ).subscribe();
  }


  handleSearch(searchTerm: string) {
    if (!this.files || this.files.length === 0) {
        console.warn("⚠️ Aucune liste de fichiers disponible.");
        return;
    }

    const query = searchTerm.toLowerCase();
    this.filteredFiles = this.files.filter(f => f.title.toLowerCase().includes(query));
    console.log("🔍 Résultats de recherche :", this.filteredFiles);
  }

  openFile(filename: string) {
    if (filename && filename.trim() !== "") {
      const fileUrl = `http://localhost:3004/static/files/${filename}`;
      window.open(fileUrl, '_blank'); // ✅ Ouvre le fichier dans un nouvel onglet
    } else {
      console.warn("⚠️ Nom du fichier manquant !");
      this._message.add({ severity: "warn", summary: "Attention", detail: "Le fichier est introuvable." });
    }
  }


  //Gestions des boutonnnsss

  onStepChange(event: any): void {
    this.activeIndex = Math.max(0, Math.min(event.index, this.sections.length - 1)); 
    const unconfirmedSections = this.sections.filter(section => section.status === "not confirmed");
    this.selectedSection = unconfirmedSections[this.activeIndex];
    this.initializeUserInputs();
  }

  nextStep(): void {
    if (this.activeIndex < this.sections.length - 1) {
      this.activeIndex++;
      this.selectedSection = this.sections[this.activeIndex];
      this.initializeUserInputs();
    }
  }

  previousStep(): void {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      this.selectedSection = this.sections[this.activeIndex];
      this.initializeUserInputs();
    }
  }
  
}