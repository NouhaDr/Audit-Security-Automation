import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../../shared.module';
import { debounceTime, map, switchMap, take, tap, of } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { EquipementService } from 'src/app/services/equipements.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-equipement-dialog',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './add-equipement-dialog.component.html',
  styleUrl: './add-equipement-dialog.component.scss'
})
export class AddEquipementDialogComponent implements OnInit, OnChanges {
  @Output() callback: EventEmitter<any> = new EventEmitter();
  @Input() addEquipementDialogVisible = false;
  @Input() selectedEquipement: any | null = null;
  @Output() dismiss = new EventEmitter();
  @Input() mode = '';

  title = "Add New Equipement";
  @Input() auditId: string = '';  // 🔥 ID de l'audit récupéré correctement
  imagesUrl = environment.userImagesUrl;
  submitted = false;

  categories: any[] = [];
  data_categories: any[] = [];
  sub_categories: any[] = [];
  suggestedEquipements: any[] = [];
  id = '';

  createEquipementForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _message: MessageService,
    private _audit: AuditService,
    private _equipement: EquipementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 🔍 Récupération de l'ID de l'audit depuis l'URL
    this.route.parent?.paramMap.subscribe(params => {
    
      if (!this.auditId) {
        console.error('⚠️ Aucun ID trouvé dans l\'URL. Vérifie que l\'URL est correcte.');
        return;
      }
    });

    // ✅ Initialisation du formulaire
    this.createEquipementForm = this.fb.group({
      category: ['', [Validators.required]],
      subcategory: ['', Validators.required],
      ref: ['', Validators.required],
      manufacturer: ['', Validators.required],
      details: ['', Validators.required],
    });

    // 🎯 Mise à jour du formulaire si un équipement est sélectionné
    if (this.selectedEquipement) {
      this.mode = 'update';
      this.id = this.selectedEquipement._id;
      this.createEquipementForm.patchValue(this.selectedEquipement);
    }

    // Chargement des catégories
    this.fetchCategories();

    // Détection des changements dans le formulaire
    this.createEquipementForm.valueChanges.pipe(
      debounceTime(500),
      map(value => {
        if (value.ref && value.ref._id) {
          const formValue = {
            ref: value.ref.ref,
            manufacturer: value.ref.manufacturer,
            category: value.ref.category,
            subcategory: value.ref.subcategory,
            details: value.ref.details
          };
          this.createEquipementForm.patchValue(formValue);
          return formValue;
        }
        return value;
      }),
      tap((value: any) => {
        this.sub_categories = this.data_categories
          .find(e => e.category === value.category)?.subs.map(e => e.label) || [];
      }),
      switchMap(value => this._equipement.searchEquipement({ manufacturer: value.manufacturer, ref: value.ref }))
    ).subscribe(
      (res: any) => {
        this.suggestedEquipements = this.groupEquipementsByCategory(res.data);
      }
    );
  }

  fetchCategories() {
    this.data_categories = [
      {
        category: 'Network and Security',
        subs: [{ label: 'Network Equipment' }, { label: 'Security Equipment' }]
      },
      {
        category: 'Servers',
        subs: [{ label: 'Monitoring Server' }, { label: 'Web Server' }]
      },
      {
        category: 'Mechanical & Fabrication Tools',
        subs: [{ label: '3D Printers' }, { label: 'Soldering Equipment' }]
      },
      {
        category: 'Microcontrollers & Embedded Systems',
        subs: [{ label: 'Microcontrollers' }, { label: 'Single-board computers' }]
      },
      {
        category: 'Robotics Hardware',
        subs: [{ label: 'Motors' }, { label: 'Actuators' },{ label: 'Sensors' },{ label: 'Chassis & Frames' }]
      },
      {
        category: 'Power & Batteries',
        subs: [{ label: 'Power Supplies' }, { label: 'Battery Chargers' }]
      },
      {
        category: 'Directory Services',
        subs: [{ label: 'Active Directory' }, { label: 'OpenLDAP' }]
      },
      {
        category: 'Operating System',
        subs: [{ label: 'Windows' }, { label: 'Linux' }]
      },
      {
        category: 'Cloud Management Systems',
        subs: [{ label: 'AWS' }, { label: 'Azure' }]
      }
    ];
    this.categories = this.data_categories.map(e => e.category);
  }
  

  handleSubmit() {
    if (!this.createEquipementForm.valid) {
      this._message.add({ severity: 'error', summary: 'Please fill in all fields.' });
      return;
    }
  
    if (!this.auditId) {
      console.error("❌ Erreur : Audit ID manquant !");
      this._message.add({ severity: 'error', summary: 'Erreur', detail: 'Audit ID not found. Please check the URL.' });
      return;
    }
  
    if (this.mode === 'add') {
      console.log("🟢 Ajout d'un nouvel équipement...");
      this._audit.addEquipementToAudit(this.auditId, this.createEquipementForm.value).subscribe({
        next: (res: any) => {
          console.log("✅ Équipement ajouté :", res.data);
          this.callback.emit({ data: res.data, action: 'add' });
          this.addEquipementDialogVisible = false;
          this._message.add({ severity: 'success', summary: res.message });
        },
        error: (error) => {
          console.error("❌ Erreur lors de l'ajout :", error);
          this._message.add({ severity: 'error', summary: 'Erreur', detail: 'Unable to add the equipment.' });
        }
      });
    } else {
      if (!this.selectedEquipement || !this.selectedEquipement._id) {
        console.error("❌ Erreur : ID d'équipement manquant !");
        this._message.add({ severity: 'error', summary: 'Erreur', detail: 'Equipment ID not found. Unable to update.' });
        return;
      }
  
      const equipementId = this.selectedEquipement._id;
      console.log(`🟡 Mise à jour de l'équipement... auditId: ${this.auditId}, equipementId: ${equipementId}`);
  
      this._audit.updateEquipementFromAudit(this.auditId, equipementId, this.createEquipementForm.value).subscribe({
        next: (res: any) => {
          console.log("✅ Équipement mis à jour :", res.data);
          this.callback.emit({ data: res.data, action: 'update' });
          this.addEquipementDialogVisible = false;
          this._message.add({ severity: 'success', summary: res.message });
        },
        error: (error) => {
          console.error("❌ Erreur lors de la mise à jour :", error);
          this._message.add({ severity: 'error', summary: 'Erreur', detail: 'Unable to update the equipment' });
        }
      });
    }
  }
  
  

  onDismiss() {
    this.createEquipementForm.reset();
    this.dismiss.emit(false);
  }

  ngOnChanges(changes: any) {
    if (changes.mode) {
      this.mode = changes.mode.currentValue;
    }
  }

  groupEquipementsByCategory(equipements: any[]) {
    let grouped: any = {};
    equipements.forEach(element => {
      const category = element.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(element);
    });

    return Object.keys(grouped).map(key => ({
      category: key,
      icon: this.setCategoryIcon(key),
      items: grouped[key]
    }));
  }

  setCategoryIcon(key: string) {
    switch (key) {
      case 'Network and Security': return 'pi pi-sitemap';
      case 'Servers': return 'pi pi-server';
      case 'Directory Services': return 'pi pi-lock';
      case 'Operating System': return 'pi pi-microsoft';
      case 'Cloud Management Systems': return 'pi pi-cloud';
      default: return 'pi-angle-right';
    }
  }
  
}
