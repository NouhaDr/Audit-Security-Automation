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
import { FormBuilder, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuditService } from 'src/app/services/audit.service';
import { take, tap, forkJoin } from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';
import { UserService } from 'src/app/services/user.service';
import { ChipsModule } from 'primeng/chips';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { fromEvent } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScanService } from 'src/app/services/scan.service';
const yesIcon = 'data:image/png;base64,...'; // Remplace ... par le vrai contenu base64 de l'icône ✅
const noIcon = 'data:image/png;base64,...';  // Remplace ... par le vrai contenu base64 de l'icône ❌


@Component({
  selector: 'app-report-sections',
  standalone: true,
    imports :[ StepsModule, ToastModule, ListboxModule, CardModule, InputTextModule, 
      ButtonModule, DividerModule, CommonModule, ReactiveFormsModule,ChipsModule,
      TableModule,FormsModule,AccordionModule,CheckboxModule,DragDropModule
    ],
  templateUrl: './report-sections.component.html',
  styleUrl: './report-sections.component.scss'
})
export class ReportSectionsComponent implements OnInit{
  sections: any[] = [];
  stepItems = [];
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

  audit: any = {};  // Déclarez audit comme un objet
  filteredFiles : any[] = [];
  files : any[] = [];
  loading = false;

  addFileDialogVisible = false;

  finalReport: any[] = [];

    constructor(
      private _sectionService: SectionService,
      private _audit: AuditService,
      private _questionnaire: QuestionService,
      private _message: MessageService,
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private _router: Router,
      private _confirmation :ConfirmationService,
      private _userService :UserService,
      private _scan: ScanService,
    ) {}

    ngOnInit(): void {
      this.auditId = this.route.snapshot.paramMap.get('id')!;
      
      this._audit.findById(this.auditId).pipe(take(1)).subscribe({
        next: (res: any) => {
          this.audit = res.data;
          this.fetchAuditEquipements();
        },
        error: (err) => {
          console.error("❌ Erreur lors de la récupération de l'audit :", err);
          this._message.add({ severity: 'error', summary: 'Erreur', detail: "Impossible de récupérer l'audit." });
        }
      });
  
      if (this.auditId) {
        this._sectionService.findSectionsByAuditId(this.auditId).subscribe(
          (data: any[]) => {
            this.sections = (data || []).filter(section => section.status === "validated" || section.status === "fixed");
  
            console.log("sections", this.sections);
            if (this.sections.length > 0) {
              this.stepItems = this.sections.map(section => ({ label: section.nom }));
  
              const questionnaireSection = this.sections.find(section => section.nom === "Questionnaire");
              if (questionnaireSection) {
                this.fetchQuestions(questionnaireSection);
              }
  
              const filesSection = this.sections.find(section => section.nom === "Files");
              if (filesSection) {
                this.fetchFiles();
              }
  
              this.initializeFormControls();
            }
          },
          (error) => {
            this._message.add({ severity: 'error', summary: 'Erreur', detail: "Impossible de récupérer les sections validées." });
          }
        );
      }
    }
  
    // Fonction pour gérer le Drag & Drop
    drop(event: CdkDragDrop<any[]>) {
      moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
      console.log("Nouvel ordre des sections :", this.sections);
    }
  
  trackByKey(index: number, item: any): any {
    return item?.key ?? index;
  }
  
  trackByIndex(index: number, item: any): number {
    return index;
  }

  initializeFormControls() {
    this.form = this.fb.group({});
  
    this.sections.forEach(section => {
        if (section.champs) {
            Object.keys(section.champs).forEach(key => {
                this.form.addControl(key, new FormControl(
                    { value: section.champs[key] || '', disabled: true },  // 🔴 Désactivation correcte
                    Validators.required
                ));
            });
        }
    });
  
    console.log("📌 Formulaire généré avec champs désactivés :", this.form.value);
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


  handleEquipementShow(item: any) {
    if (this.selectedEquipement === item) {
        this.selectedEquipement = null; // Cache les infos si on clique à nouveau
    } else {
        this.selectedEquipement = item; // Affiche les infos
    }
  }

  

  fetchQuestions(section: any) {
    if (!section || !Array.isArray(section.champs)) {
      console.warn("⚠️ La section 'Questionnaire' est introuvable ou ses champs ne sont pas au bon format !");
      this.questions = [];
      return;
    }
  
    console.log("📌 Récupération des questions pour la section:", section);
  
    // Récupérer les IDs depuis les labels si ce sont les questions enregistrées comme _id
    const questionIds = section.champs.map(champ => champ.label); // label = ID de la question
  
    const questionRequests = questionIds.map(id => this._questionnaire.getQuestionById(id));
  
    forkJoin(questionRequests).subscribe(
      (questionsData: any[]) => {
        this.questions = questionsData.map((questionRes, index) => ({
          question: questionRes.data,  // ✅ donnée retournée par getQuestionById
          response: section.champs[index]?.value ?? null // ✅ réponse booléenne liée à la question
        }));
  
        console.log("✅ Questions affichées dans le questionnaire:", this.questions);
      },
      (error) => {
        console.error("❌ Erreur lors de la récupération des questions:", error);
        this.questions = [];
      }
    );
  }
  


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

  
  toggleSection(section: any, event: any) {
    if (event.originalEvent) {
      event.originalEvent.stopPropagation(); 
    }
  
    section.selected = event.checked;
  
    if (section.selected) {
      this.finalReport.push(section);
    } else {
      this.finalReport = this.finalReport.filter(sec => sec.nom !== section.nom);
    }
  
    console.log("Final Report:", this.finalReport);
  }
  
exportToPDF() {
  const pdf = new jsPDF('p', 'mm', 'a4');

  // 🎨 1. COVER PAGE
  pdf.setFont("times", "bold");
  pdf.setFontSize(36);
  pdf.setTextColor(0, 51, 153);
  pdf.text('Security Audit', 105, 60, { align: 'center' });
  pdf.text('Report', 105, 75, { align: 'center' });

  // Decorative separator
  pdf.setDrawColor(0, 51, 153);
  pdf.setLineWidth(1);
  pdf.line(50, 85, 160, 85);

  // Audit Leader
  pdf.setFont("times", "normal");
  pdf.setFontSize(16);
  pdf.setTextColor(80, 80, 80);
  pdf.text('Conducted by:', 105, 100, { align: 'center' });

  const auditLeader = this.audit?.auditleaders
    ? `${this.audit.auditleaders.firstName} ${this.audit.auditleaders.lastName}`
    : 'Not Specified';

  pdf.setFont("times", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text(auditLeader, 105, 110, { align: 'center' });

  // Auditors
  const auditorsList = this.audit?.auditors?.map(auditor =>
    `${auditor.firstName} ${auditor.lastName}`
  ).join(', ') || 'No auditors specified';

  pdf.setFont("times", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(80, 80, 80);
  pdf.text('Auditors:', 105, 125, { align: 'center' });

  const auditors = auditorsList.split(', ');
  let yOffset = 135;
  auditors.forEach((auditor, index) => {
    pdf.text(auditor, 105, yOffset + (index * 7), { align: 'center' });
  });

  // Report Date
  const currentDate = new Date().toLocaleDateString();
  pdf.setFont("times", "italic");
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Report Date: ${currentDate}`, 105, 250, { align: 'center' });

  // Bottom line
  pdf.setDrawColor(0, 51, 153);
  pdf.setLineWidth(0.5);
  pdf.line(50, 270, 160, 270);

  pdf.addPage(); // New page after cover

  // 🛠 2. REPORT SECTIONS
  yOffset = 30;
  this.finalReport.forEach((section, index) => {
    if (index > 0) {
      pdf.addPage();
      yOffset = 30;
    }

    const sanitizedSectionTitle = this.sanitizeTitle(section.nom);

    // Section title
    pdf.setFont("times", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(0, 51, 153);
    pdf.text(sanitizedSectionTitle.toUpperCase(), 15, yOffset);

    yOffset += 5;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(10, yOffset, 200, yOffset);
    yOffset += 10;

    pdf.setFont("times", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);

    // Section content
    if (section.nom === 'Contact') {
      this.addContactSection(pdf, yOffset);
    } else if (section.nom === 'Infrastructure' && this.rawEquipements?.length > 0) {
      this.addInfrastructureSection(pdf, yOffset);
    } else if (section.nom === 'Questionnaire') {
      this.addQuestionnaireSection(pdf, yOffset);
    } else if (section.nom === 'Files') {
      this.addFilesSection(pdf, yOffset);
    } else if (section.champs) {
      this.addFormFields(pdf, section.champs, yOffset);
    }

    yOffset += 10;
  });

  // ✅ Final Section
  this.addScanResultsSection(pdf, yOffset)
    .then(() => {
      pdf.save('Security_Audit_Report.pdf');
    })
    .catch(err => {
      console.error('Error generating PDF:', err);
    });
}


 // 🛠 Fonction pour nettoyer les titres
  sanitizeTitle(title) {
      return title
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\x20-\x7EÀ-ÿ']/g, '')
          .trim();
  }
  // 🛠 Nettoyage des textes
sanitizeText(text: string): string {
  return text
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7EÀ-ÿ']/g, '')
    .trim() || 'N/A';
}

  
  
// 🛠 Fonction pour ajouter la section Contact sous forme de tableau
addContactSection(pdf, yOffset) {
  const contactInfo = [
    ["Organisation", this.audit?.organisationName || 'N/A'],
    ["Contact Number", this.audit?.contactNumber || 'N/A'],
    ["Client", `${(this.audit?.client?.firstName || '')} ${(this.audit?.client?.lastName || '')}`.trim() || 'N/A'],
    ["Phone Number", this.audit?.phoneNumber || 'N/A'],
    ["Audit Leader", `${(this.audit?.auditleaders?.firstName || '')} ${(this.audit?.auditleaders?.lastName || '')}`.trim() || 'N/A'],
    ["Email", this.audit?.contactEmail || 'N/A'],
    ["Auditors", (this.audit?.auditors || [])
      .map(auditor => `${auditor.firstName} ${auditor.lastName}`)
      .join(', ') || 'N/A'],
    ["Website", this.audit?.website || 'N/A'],
    ["Employees Number", String(this.audit?.employeesNumber) || 'N/A'],
    ["Employees in Perimeter", String(this.audit?.employeesInPerimeter) || 'N/A']
  ];

  autoTable(pdf, {
    startY: yOffset,
    body: contactInfo,
    theme: 'grid',
    styles: {
      font: "times",
      fontStyle: "bold", // Gras
      fontSize: 10,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [0, 51, 153],
      textColor: 255
    },
    alternateRowStyles: { fillColor: [240, 240, 255] },
    columnStyles: {
      0: { cellWidth: 60 },  // Label
      1: { cellWidth: 120 }  // Valeur
    }
  });

  return (pdf as any).lastAutoTable.finalY + 10;
}


  onDragStart(event: MouseEvent) {
    event.stopPropagation();  // ✅ Empêche l'ouverture lors du drag
  }
  
  toggleAccordion(accordion: any, event: MouseEvent) {
    event.stopPropagation(); // ✅ Évite que d'autres événements interfèrent
    accordion.toggle(event);
  }

addQuestionnaireSection(pdf, yOffset) {
  if (this.questions.length > 0) {
    const questionsData = this.questions.map(q => [
      this.sanitizeText(q.question?.question || "Non spécifiée"),
      this.sanitizeText(q.question?.category || "N/A"),
      q.response === true ? 'Oui' : 'Non'
    ]);

    autoTable(pdf, {
      startY: yOffset,
      head: [['Question', 'Catégory', 'Response']],
      body: questionsData,
      theme: 'grid',
      styles: { 
        fontSize: 11, // ✅ Légèrement plus grand pour renforcer la visibilité
        cellPadding: 3, 
        font: " Times", 
        fontStyle: "bold" // ✅ Style gras pour tout le contenu
      },
      headStyles: { 
        fillColor: [0, 51, 153], 
        textColor: 255, 
        halign: 'center', 
        font: ' Times', 
        fontStyle: 'bold' 
      },
      bodyStyles: { 
        valign: 'middle', 
        halign: 'center', 
        font: ' Times', 
        fontStyle: 'bold' // ✅ Texte des réponses en gras
      },
      alternateRowStyles: { fillColor: [240, 240, 255] },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30, halign: 'center' }
      }
    });

    return (pdf as any).lastAutoTable.finalY + 10;
  } else {
    pdf.setFont( "Times", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(255, 0, 0);
    pdf.text("⚠️ Aucune question disponible.", 12, yOffset);
    return yOffset + 8;
  }
}
addInfrastructureSection(pdf, yOffset) {
  const equipementData = this.rawEquipements.map(equip => [
    equip.category || "N/A",
    equip.ref || "N/A",
    equip.manufacturer || "N/A",
    equip.details || "Aucun détail"
  ]);

  autoTable(pdf, {
    startY: yOffset,
    head: [['Category', 'Reference', 'Fabricant', 'Details']],
    body: equipementData,
    theme: 'grid',
    styles: {
      font: "times",          // ✅ Police Times
      fontStyle: "bold",      // ✅ Gras
      fontSize: 10,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [0, 51, 153],
      textColor: 255,
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 255]
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 40 },
      2: { cellWidth: 50 },
      3: { cellWidth: 60 }
    }
  });

  return (pdf as any).lastAutoTable.finalY + 10;
}

 addFilesSection(pdf, yOffset) {
  if (this.files && this.files.length > 0) {
    this.files.forEach((file, index) => {
      // ➡️ Nouvelle page seulement à partir du deuxième annexe
      if (index > 0) {
        pdf.addPage();
        yOffset = 30;
      }

      // ✅ Titre de l’annexe (centré et plus grand)
      const annexTitle = `Annex ${index + 1}`;
      pdf.setFont("times", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(0, 51, 153);
      pdf.text(annexTitle, 105, yOffset, { align: 'center' });
      yOffset += 15;

      const fileUrl = `http://localhost:3004/static/files/${file.title}`;
      const fileExtension = file.title.split('.').pop().toLowerCase();

      if (['png', 'jpg', 'jpeg'].includes(fileExtension)) {
        // 📷 Afficher l'image en grand format centré
        pdf.addImage(fileUrl, 'PNG', 15, yOffset, 180, 120);
      } else {
        // 📄 Lien pour les fichiers non-images (centré et en bleu)
        pdf.setFont("times", "normal");
        pdf.setFontSize(12);
        pdf.setTextColor(0, 102, 204);
        pdf.textWithLink(file.title, 105, yOffset, {
          align: 'center',
          url: fileUrl
        });
      }
    });
  }
}



 
 addFormFields(pdf: any, champs: any[], yOffset: number) {
  if (!Array.isArray(champs)) return;

  const pageHeight = pdf.internal.pageSize.height;
  const marginLeft = 12;
  const contentStartX = marginLeft;
  const maxContentWidth = 190 - marginLeft * 2;
  const lineHeight = 7;

  champs.forEach(champ => {
    const label = champ.label || 'Unknown';
    const value = champ.value !== undefined && champ.value !== null ? String(champ.value) : 'N/A';

    // 🔁 Saut de page si besoin
    if (yOffset + lineHeight * 2 > pageHeight - 20) {
      pdf.addPage();
      yOffset = 30;
    }

    // 🎨 Affichage du Label (en gras)
    pdf.setFont("times", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(50, 50, 50);
    pdf.text(`${label}:`, marginLeft, yOffset); // ✅ Utilisation correcte des backticks pour l'interpolation

    yOffset += lineHeight;

    // 📄 Affichage du contenu (en bleu foncé)
    pdf.setFont("times", "normal");
    pdf.setTextColor(0, 51, 153);

    const textLines = pdf.splitTextToSize(value, maxContentWidth);
    textLines.forEach(line => {
      if (yOffset + lineHeight > pageHeight - 20) {
        pdf.addPage();
        yOffset = 30;
      }
      pdf.text(line, contentStartX, yOffset);
      yOffset += lineHeight;
    });

    yOffset += 8; // Espace entre les champs
  });
}

  
  generateContentFromFields(champs: any): string {
    if (!Array.isArray(champs)) return '';
  
    return champs
      .map(champ => {
        const label = champ.label || 'Unknown';
        const value = champ.value !== undefined && champ.value !== null ? champ.value : 'N/A';
        return `${label}: ${value}`;
      })
      .join('\n');
  }
  
 addScanResultsSection(pdf, yOffset): Promise<void> {
  return new Promise((resolve, reject) => {
    this._scan.getByAudit(this.auditId).pipe(take(1)).subscribe({
      next: (res: any) => {
        const scans = res.data;
        if (!scans.length) return resolve();

        const vulnRequests = scans.map(scan =>
          this._scan.getVulnerabilitiesByScan(scan._id).pipe(take(1))
        );

        forkJoin(vulnRequests).subscribe({
          next: (vulnResponses: any[]) => {
            pdf.addPage();
            yOffset = 30;

            pdf.setFont("times", "bold");
            pdf.setFontSize(18);
            pdf.setTextColor(0, 51, 153);
            pdf.text("Scan Results", 12, yOffset);
            yOffset += 10;

            scans.forEach((scan, index) => {
              const vulns = vulnResponses[index].vulnerabilities;

              pdf.setFont("times", "bold");
              pdf.setFontSize(14);
              pdf.setTextColor(0, 0, 0);
              pdf.text(`Scan #${index + 1}: ${scan.ip}`, 12, yOffset);
              yOffset += 6;

              pdf.setFont("times", "normal");
              pdf.setFontSize(11);
              pdf.text(`Type: ${scan.typeScan}`, 12, yOffset); yOffset += 5;
              pdf.text(`Status: ${scan.status}`, 12, yOffset); yOffset += 5;
              pdf.text(`Start: ${new Date(scan.dateDebut).toLocaleString()}`, 12, yOffset); yOffset += 5;
              pdf.text(`End: ${scan.dateFin ? new Date(scan.dateFin).toLocaleString() : 'N/A'}`, 12, yOffset); yOffset += 8;

              if (!vulns.length) {
                pdf.setTextColor(150, 0, 0);
                pdf.text('No vulnerabilities found.', 12, yOffset);
                yOffset += 10;
              } else {
                const vulnData = vulns.map(v => [
                  v.cve || 'N/A',
                  v.cvss || 'N/A',
                  v.description || 'No description'
                ]);

                autoTable(pdf, {
                  startY: yOffset,
                  head: [['CVE', 'CVSS', 'Description']],
                  body: vulnData,
                  theme: 'grid',
                  styles: { fontSize: 9, cellPadding: 2 },
                  headStyles: { fillColor: [0, 51, 153], textColor: 255 },
                  alternateRowStyles: { fillColor: [240, 240, 255] }
                });

                yOffset = (pdf as any).lastAutoTable.finalY + 10;
              }
            });

            resolve();
          },
          error: (err) => {
            console.error('Failed to load vulnerabilities:', err);
            reject(err);
          }
        });
      },
      error: (err) => {
        console.error('Error loading scans:', err);
        reject(err);
      }
    });
  });
}



}