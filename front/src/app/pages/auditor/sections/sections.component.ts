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
import { FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuditService } from 'src/app/services/audit.service';
import { switchMap, map, take, of ,tap ,forkJoin} from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';
import { AddEquipementDialogComponent } from 'src/app/shared/dialogs/add-equipement-dialog/add-equipement-dialog.component';
import { CustomConfirmDialogComponent } from 'src/app/shared/dialogs/custom-confirm-dialog/custom-confirm-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { ChipsModule } from 'primeng/chips';
import { FileUploadDialogComponent } from 'src/app/shared/dialogs/file-upload-dialog/file-upload-dialog.component';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-sections',
  standalone: true,
  imports :[ StepsModule, ToastModule, ListboxModule, CardModule, InputTextModule, 
    ButtonModule, DividerModule, CommonModule, ReactiveFormsModule,
    AddEquipementDialogComponent,CustomConfirmDialogComponent,ChipsModule,
    FileUploadDialogComponent,TableModule,FormsModule
  ],
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})
export class SectionsComponent implements OnInit {
  sections: any[] = [];
  stepItems: any[] = [];
  selectedSection: any = null;
  activeIndex: number = 0;
  auditId: string = ''; 
  audit : any = null;
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


  filteredFiles : any[] = [];
  files : any[] = [];
  loading = false;
  fileID: string;

  addFileDialogVisible = false;

  constructor(
    private _sectionService: SectionService,
    private _audit: AuditService,
    private _questionnaire: QuestionService,
    private _message: MessageService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _router: Router,
    private _confirmation :ConfirmationService,
    private _userService :UserService
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
            
            // ✅ Filtrer uniquement les sections "not confirmed", "rejected" et "fixed"
            this.sections = data.filter(section => 
                ["not confirmed", "rejected", "fixed"].includes(section.status)
            );
            console.log(this.sections);

            // ✅ Vérifier s'il reste des sections après filtrage
            if (this.sections.length === 0) {
                this.stepItems = [];
                this.selectedSection = null;
                this._message.add({
                    severity: 'info',
                    summary: 'Info',
                    detail: "No sections available after filtering."
                });
                return;
            }

            // ✅ Construire le stepper avec les sections valides
            this.stepItems = this.sections.map(section => ({ label: section.nom }));

            // ✅ Sélectionner la première section **si possible**
            this.activeIndex = 0;
            this.selectedSection = this.sections.length > 0 ? this.sections[this.activeIndex] : null;

            this.fetchFiles(); 
        },
        (error) => {
            console.error("❌ Erreur lors de la récupération des sections :", error);
            this._message.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Failed to retrieve audit sections."
            });
        }
    );
}



  confirmSection(): void {
    if (!this.selectedSection || !this.selectedSection._id) {
      this._message.add({
        severity: 'error',
        summary: 'Error',
        detail: "No section selected or missing section ID."
      });
      return;
    }
  
    const sectionData = { status: "confirmed" }; // ✅ Mise à jour du statut de la section

    this._audit.confirmSection(this.auditId, this.selectedSection._id, sectionData).subscribe({
      next: () => {
        this._message.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Section confirmed successfully'
        });

        // 🔄 ✅ Rafraîchir les sections après confirmation
        this.refreshSections();
      },
      error: () => {
        this._message.add({
          severity: 'error',
          summary: 'Error',
          detail: "Failed to confirm section"
        });
      }
    });
}


  saveSectionData(): void {
    if (!this.selectedSection || !this.selectedSection._id) {
      this._message.add({
        severity: 'error',
        summary: 'Erreur',
        detail: "No section selected or missing section ID."
      });
      return;
    }
  
    const sectionData = {
      champs: this.form.value
    };
  
  
    this._audit.saveSectionData(this.auditId,this.selectedSection._id,sectionData).subscribe({
      next: () => {
        this._message.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Confirmation saved successfully'
        });
      },
      error: () => {
        this._message.add({
          severity: 'error',
          summary: 'Erreur',
          detail: "Failed to save confirmation"
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
                    detail:"No sections available."
                });
                return;
            }

            // ✅ Filtrer uniquement les sections ayant le statut "not confirmed", "rejected" ou "fixed"
            this.sections = data.filter(section =>
                ["not confirmed", "rejected", "fixed"].includes(section.status)
            );

            // ✅ Vérification des sections exclues (Debugging)
            console.log("❌ Sections exclues (confirmed/validated) :", 
                data.filter(section => ["confirmed", "validated"].includes(section.status))
            );

            // ✅ Construire le stepper avec les sections conservées
            this.stepItems = this.sections.map(section => ({ label: section.nom }));

            // ✅ Sélectionner la première section disponible
            this.selectedSection = this.sections.length > 0 ? this.sections[0] : null;
            this.activeIndex = this.selectedSection ? 0 : null;

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
                detail:"Unable to retrieve the updated sections."
            });
        }
    );
}

isRejected(sectionName: string): boolean {
  return this.sections.some(sec => sec.nom === sectionName && sec.status === "rejected");
}

initializeUserInputs() {
  if (!this.selectedSection || !this.selectedSection.champs) {
      return;
  }

  if (this.selectedSection.nom === "Questionnaire") {
      this.fetchQuestions();
  }

  if (this.selectedSection.nom === "Infrastructure") {
      this.fetchAuditEquipements();
  }
  
  if (this.selectedSection.nom === "Files") {
    this.fetchFiles();
  }
  const controls: { [key: string]: FormControl } = {};

  Object.keys(this.selectedSection.champs).forEach((key) => {
      controls[key] = new FormControl({
          value: this.selectedSection.champs[key] || "",
          disabled: key === "remark" // 🔹 Désactive le champ "remark"
      });
  });

  this.form = new FormGroup(controls);
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


  handleSubmit() {
    console.log('Form Submitted:', this.organisationForm.value);
  }


  //Equipementtt

  showAddDialog() {
    this.addEquipementDialogVisible = true;
    this.dialogMode = 'add';
  }

  addNewEquipementCallback(event: any) {
    this.addEquipementDialogVisible = false;
    const equipementData = event.data;

    if (event.action === "add") {
        this._audit.addEquipementToAudit(this.auditId, equipementData).subscribe({
            next: (res: any) => {
                this.rawEquipements = [...this.rawEquipements, res.data];
                this.groupEquipementsByCategory();
            },
            error: (err) => console.error("❌ Erreur lors de l'ajout de l'équipement :", err)
        });

    } else if (event.action === "update") {
        if (!equipementData._id) return;

        this._audit.updateEquipementFromAudit(this.auditId, equipementData._id, equipementData).subscribe({
            next: (res: any) => {
                console.log("✅ Équipement mis à jour :", res.data);

                const index = this.rawEquipements.findIndex(e => e._id === equipementData._id);
                if (index !== -1) this.rawEquipements[index] = res.data;
                this.groupEquipementsByCategory();
            },
            error: (err) => console.error("❌ Erreur lors de la mise à jour de l'équipement :", err)
        });
    }
 }


  fetchAuditEquipements() {
  if (!this.auditId) return;

  this._audit.findAuditEquipements(this.auditId).pipe(
    take(1),
    tap((res: any) => {
      this.rawEquipements = res.data;
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

  handleEquipementEdit(item: any) {
    if (!this.auditId) {
      this._message.add({ severity: 'error', summary: "Erreur", detail: "Audit ID introuvable." });
      return;
    }
  
    this.selectedEquipement = { ...item, auditId: this.auditId };
    this.dialogMode = 'update';
    this.addEquipementDialogVisible = true;
  }

  handleEquipementRemove(item: any) {
    this.equipementToDelete = item; // Stocke temporairement l'équipement
    this._confirmation.confirm({
      key: 'deleteEquipement',
      message: `Are you sure you want to delete the equipment "${item.nom}" ?`,
      accept: () => this.handleConfirmDelete(),
      reject: () => this.handleCancelDelete()
    });
  }

  handleEquipementShow(item: any) {
    if (this.selectedEquipement === item) {
        this.selectedEquipement = null; // Cache les infos si on clique à nouveau
    } else {
        this.selectedEquipement = item; // Affiche les infos
    }
  }

  handleConfirmDelete() {
    if (!this.equipementToDelete) return;

    this._audit.removeEquipementFromAudit(this.auditId, this.equipementToDelete._id).subscribe({
      next: () => {
        this.rawEquipements = this.rawEquipements.filter(e => e._id !== this.equipementToDelete._id);
        this._message.add({ severity: 'success', summary: 'Succès', detail: 'Equipment deleted successfully.' });
        this.equipementToDelete = null;
      },
      error: () => {
        this._message.add({ severity: 'error', summary: 'Erreur', detail: 'Failed to delete the equipment.' });
      }
    });
  }

  handleCancelDelete() {
    this.equipementToDelete = null;
    this._message.add({ severity: 'info', summary: 'Annulé', detail: 'Deletion canceled.' });
  }


  //Questionnaireee

  fetchQuestions() {
    console.log("📌 Récupération des questions pour l'audit:", this.auditId);

    this._audit.findAuditQuestionnaire(this.auditId).pipe(
      take(1),
      switchMap((res: any) => {
        if (res.data.length !== 0) {
          console.log("✅ Questions existantes récupérées:", res.data);
          return of(res.data);
        }

        console.log("📌 Pas de questions existantes, chargement de toutes les questions...");
        return this._questionnaire.findAll().pipe(
          map((res: any) => res.data.map(e => ({ question: e, response: null })))
        );
      })
    ).subscribe(
      res => {
        this.questions = res;
        console.log("✅ Questions affichées dans le questionnaire:", this.questions);
      },
      error => {
        console.error("❌ Erreur lors de la récupération des questions:", error);
      }
    );
  }

  submitQuestions() {
    if (!this.auditId) {
      this._message.add({ severity: 'error', summary: "Error", detail: "Audit ID not found. Please check the URL." });
      return;
    }
  
    if (!this.selectedSection || this.selectedSection.nom !== "Questionnaire") {
      this._message.add({ severity: 'error', summary: "Error", detail: "You can only submit answers for the questionnaire." });
      return;
    }
  
    // 🔁 Formater chaque question sous forme { label, value, type }
    const formattedChamps = this.questions.map((q) => ({
      label: q.question._id, // ✅ sauve l'ID ici
      value: q.response === 'true' || q.response === true,
      type: "boolean"
    }));
    
  
    // 1️⃣ Envoie les réponses en brut si besoin
    this._audit.submitQuestions(this.auditId, this.questions).pipe(
      take(1),
      switchMap(() => {
        // 2️⃣ Mettre à jour la section "Questionnaire" avec { label, value, type }
        return this._sectionService.updateSection(this.selectedSection._id, {
          champs: formattedChamps
        }).pipe(take(1));
      })
    ).subscribe({
      next: () => {
        this._message.add({
          severity: 'success',
          summary: "Success",
          detail: "Answers saved successfully"
        });
      },
      error: (error) => {
        console.error("❌ Erreur lors de la mise à jour du questionnaire :", error);
        this._message.add({
          severity: 'error',
          summary: "Submission failed",
          detail: error.message || "An unexpected error occurred"
        });
      }
    });
  }
  

  handleQuestionCheck(q: any, answer: boolean) {
    const index = this.questions.findIndex(e => e.question._id === q.question._id);
    if (index === -1) return;

    this.questions[index].response = `${answer}`;
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

  handleFileDelete(fileID: string) {
    if (!fileID) {
      console.warn("⚠️ File ID is missing.");
      return;
    }
    this.fileID=fileID;
  
    // Log when confirmation is triggered
    console.log("Confirmation dialog triggered for file ID:", fileID);
  
    // Show the confirmation dialog
    this._confirmation.confirm({
      key: 'deleteFile', // Unique key for identifying the dialog
      message: `Are you sure you want to delete the file with ID "${fileID}"?`,
      accept: () => this.handleConfirmDeleteFile(fileID),
      reject: () => this.handleCancelDeleteFile()
    });
  }
  
  handleConfirmDeleteFile(fileID: string) {
    console.log("handleConfirmDeleteFile called for file ID:", fileID);
  
    if (!fileID) {
      console.warn("⚠️ File ID is missing in confirm handler.");
      return;
    }
  
    // Log before making the API call
    console.log("Attempting to delete file with ID:", fileID);
  
    // Proceed with the file deletion after confirmation
    this._audit.deleteFile(this.auditId, fileID).pipe(
      take(1),
      tap({
        next: () => {
          console.log("File deleted successfully:", fileID);
  
          this.files = this.files.filter(file => file._id !== fileID);
          this.filteredFiles = [...this.files];
          this._message.add({ severity: "success", summary: "File successfully deleted" });
        },
        error: () => {
          console.error("❌ Error deleting the file for ID:", fileID);
          this._message.add({ severity: "error", summary: "Error", detail: "Unable to delete the file." });
        }
      })
    ).subscribe();
  }
  
  handleCancelDeleteFile() {
    console.log("File deletion cancelled by the user.");
    this._message.add({ severity: 'info', summary: 'Cancelled', detail: 'Deletion cancelled.' });
  }
  
  

  removeFileFromFilesSection(fileID: string) {
    const filesSection = this.sections.find(sec => sec.nom === "Files");
    if (!filesSection) return;

    filesSection.champs.files = filesSection.champs.files.filter(id => id !== fileID);

    this._audit.updateSectionFromAudit(this.auditId, filesSection._id, {
      nom: filesSection.nom,
      champs: filesSection.champs,
      remark:this.selectedSection.remark
    }).subscribe(() => {
      console.log(`✅ Fichier supprimé de la section 'Files' (ID: ${fileID})`);
    });
  }



  handleFileAddCallback(e: any) {
    if (!e) {
      console.warn("⚠️ Données du fichier ajoutées invalides.");
      return;
    }
  
    this.files = [...this.files, e];
    this.filteredFiles = [...this.files];
  
    // 📌 Appel de la fonction corrigée
    this.addFileToFiles(e);
  
    this.addFileDialogVisible = false;
  }
  

  downloadFile(fileName: string) {
    if (!fileName) {
        console.warn("⚠️ Nom du fichier manquant.");
        return;
    }

    console.log(`📥 Téléchargement du fichier : ${fileName}`);
    this._audit.downloadFile(fileName);
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

  showFileUploadDialog() {
    if (!this.auditId) {
        console.error("❌ Erreur : Audit ID manquant !");
        this._message.add({ severity: "error", summary: "Erreur", detail: "Audit ID introuvable." });
        return;
    }
    
    console.log("📂 Ouverture du dialogue d'ajout de fichier.");
    this.addFileDialogVisible = true;
  }

  addFileToFiles(file: any) {
    const filesSection = this.sections.find(sec => sec.nom === "Files");
    if (!filesSection) {
      console.warn("⚠️ La section 'Files' n'existe pas.");
      return;
    }
  
    // Vérifier si la propriété champs existe et l'initialiser si nécessaire
    if (!filesSection.champs) {
      filesSection.champs = { files: [] };
    }
  
    // Vérifier si la liste de fichiers existe et l'initialiser
    if (!Array.isArray(filesSection.champs.files)) {
      filesSection.champs.files = [];
    }
  
    const fileId = file._id;
    if (filesSection.champs.files.includes(fileId)) {
      console.warn("⚠️ Le fichier est déjà référencé dans la section 'Files'.");
      return;
    }
  
    // Ajouter le fichier
    filesSection.champs.files.push(fileId);
  
    // Mise à jour de la section "Files" dans la base de données
    this._audit.updateSectionFromAudit(this.auditId, filesSection._id, {
      nom: filesSection.nom,
      champs: filesSection.champs,
      remark:this.selectedSection.remark
    }).subscribe(() => {
      this._audit.findSectionsByAuditId(this.auditId).subscribe(updatedSections => {
        this.sections = updatedSections;
      });
    });
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

  trackByKey(index: number, item: any): any {
    return item.key; 
  }

  updateSectionFields(): void {
    if (!this.selectedSection || !this.selectedSection._id) {
      this._message.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Aucune section sélectionnée ou ID de section manquant'
      });
      return;
    }
  
    const sectionData = {
      nom: this.selectedSection.nom,
      champs: this.selectedSection.champs, // ✅ Envoie directement les champs modifiés
      remark: this.selectedSection.remark
    };
  
    this._audit.updateSectionFromAudit(this.auditId, this.selectedSection._id, sectionData).subscribe({
      next: () => {
        this._message.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Section mise à jour avec succès'
        });
      },
      error: (err) => {
        console.error("❌ Erreur lors de la mise à jour :", err);
        this._message.add({
          severity: 'error',
          summary: 'Erreur',
          detail: "Échec de la mise à jour"
        });
      }
    });
  }
  


  
  
}