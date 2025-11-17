import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { debounceTime, map, switchMap, take, tap } from 'rxjs';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { AuditService } from 'src/app/services/audit.service';
import { EquipementService } from 'src/app/services/equipements.service';
import { environment } from 'src/environments/environment';
import { SharedModule } from 'primeng/api';
import { ButtonModule  } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-equipement-admin',
  standalone: true,
  imports: [ SharedModule ,ReactiveFormsModule,ButtonModule,InputTextModule,
    AutoCompleteModule,DropdownModule,CommonModule],
templateUrl: './add-equipement-admin.component.html',
  styleUrl: './add-equipement-admin.component.scss'
})
export class AddEquipementAdminComponent implements OnChanges {
  @Output() callback: EventEmitter<any> = new EventEmitter();
  @Input() selectedEquipement: any | null = null;
  @Input() mode: string = 'add'; 

  title = "Add New Equipement";
  imagesUrl = environment.userImagesUrl;
  submitted = false;

  categories = [];
  data_categories = [];
  sub_categories = [];
  suggestedEquipements = [];
  id = '';

  createEquipementForm: FormGroup; 

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private stepperService: AuditStepperService,
    private auditService: AuditService,
    private equipementService: EquipementService
  ) {}

  ngOnInit(): void {
    this.createEquipementForm = this.fb.group({
      category: ['', [Validators.required]],
      subcategory: ['', Validators.required],
      ref: ['', Validators.required],
      manufacturer: ['', Validators.required],
      details: ['', Validators.required],
    });

    this.stepperService.selectedEquipement$.pipe(
      tap(v => {
        if (v) {
          this.mode = 'update';
          this.id = v._id;
          this.createEquipementForm.patchValue(v);
        }
      })
    ).subscribe();

    this.fetchCategories();

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
          .find(e => e.category == value.category)?.subs.map(e => e.label) || [];
      }),
      switchMap(value => {
        return this.equipementService.searchEquipement({ manufacturer: value.manufacturer, ref: value.ref });
      })
    ).subscribe(
      (res: any) => {
        this.suggestedEquipements = this.groupEquipementsByCategory(res.data);
      }
    );
  }

  fetchCategories(){
    const data_category = [
      {
        category: 'Réseau et sécurité',
        subs: [
          { label: 'Equipements réseau', icon: 'photo' },
          { label: 'Equipement de sécurité', icon: 'mm photo' },
          { label: 'Réseau sans fils', description: 'Cisco Meraki, Cisco Catalyst, Aruba Instant, Aruba Central' },
          { label: 'Logiciel de sécurité SIEM', icon: 'photo' },
          { label: 'Système de sécurité physique', icon: 'photo5' }
        ]
      },
      {
        category: 'Serveurs',
        subs: [
          { label: 'Serveur de Surveillance', description: 'Nagios, Zabbix, SolarWinds' },
          { label: 'Serveur web', description: 'Apache, Nginx' },
          { label: 'Serveur de Base de Données', description: 'MySQL, PostgreSQL, Microsoft SQL Server, Oracle Database' },
          { label: 'Serveur d\'Application', description: 'Apache Tomcat' },
          { label: 'Serveur de Virtualisation', description: 'VMware esxi, vSphere, Microsoft Hyper-V, KVM, Xe' },
          { label: 'Serveur de Stockage', description: 'NAS, SAN' },
          { label: 'Serveur DNS', description: 'BIND, Microsoft DNS Server' },
          { label: 'Serveur Proxy', description: 'Squid, Microsoft ISA Server' },
          { label: 'Serveur backup', description: 'Veeam' }
        ]
      },
      {
        category: 'Service d\'annuaires (IAM Identity and Access Management Solutions)',
        subs: [
          { label: 'Active Directory' },
          { label: 'OpenLDAP' },
          { label: 'FreeIPA' },
          { label: 'Azure Active Directory' },
          { label: 'Okta' }
        ]
      },
      {
        category: 'Système d\'exploitation',
        subs: [
          { label: 'Système d\'exploitation', icon: 'photo' }
        ]
      },
      {
        category: 'Systèmes de gestion de cloud',
        subs: [
          { label: 'SUSE OpenStack' },
          { label: 'Red Hat OpenStack' },
          { label: 'Red Hat OpenShift' },
          { label: 'VMware' },
          { label: 'Microsoft Azure' },
          { label: 'Anthos de Google Cloud' },
          { label: 'AWS Outposts' }
        ]
      },
      {
        category: 'Middleware',
        subs: [
          { label: 'Middleware', icon: 'photo' }
        ]
      },
      {
        category: 'Firmware',
        subs: [
          { label: 'Firmware', icon: 'photo' }
        ]
      },
      {
        category: 'Équipements industriels',
        subs: [
          { label: 'Équipements industriels', icon: 'photo' }
        ]
      }
    ];
    this.data_categories = data_category;
    this.categories = data_category.map(e => e.category);
  }

  handleSubmit() {
    if (!this.createEquipementForm.valid) {
        this.messageService.add({ severity: 'error', summary: 'Please fill all fields' });
        return;
    }

    this.submitted = true;

    if (this.mode === 'add') {
        this.equipementService.addEquipement(this.createEquipementForm.value).subscribe(
            (res: any) => {
                this.callback.emit({ data: res.data, action: 'add' });
                this.messageService.add({ severity: 'success', summary: res.message });
                this.onDismiss();
            },
            (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error adding equipment' });
                this.submitted = false;
            }
        );
    } else {
        this.equipementService.updateEquipements(this.id, this.createEquipementForm.value).subscribe(
            (res: any) => {
                this.callback.emit({ data: res.data, action: 'update' });
                this.messageService.add({ severity: 'success', summary: "Equipement added successfully" });
                this.onDismiss();
            },
            (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error updating equipment' });
                this.submitted = false;
            }
        );
    }
}

  ngOnChanges(changes : any){
    if(changes.mode){
      this.mode = changes.mode.currentValue;
    }
  }

  groupEquipementsByCategory(equipements : any[]){
    let grouped = [];
    for (let i = 0; i < equipements.length; i++) {
      const element = equipements[i];
      const category = element.category;
      if(!grouped[category]){
        grouped[category] = [];
      }
      grouped[category].push(element);
    }

    return Object.keys(grouped).map(key => ({
      category: key,
      icon : this.setCategoryIcon(key),
      items: grouped[key]
    }));
  }

  setCategoryIcon(key : string){
    switch (key) {
      case 'Réseau et sécurité':
        return 'pi pi-sitemap'
      case 'Serveurs':
        return 'pi pi-server'
      case 'Service d\'annuaires (IAM Identity and Access Management Solutions)':
        return 'pi pi-lock'
      case 'Système d\'exploitation':
        return 'pi pi-microsoft'
      case 'Systèmes de gestion de cloud':
        return 'pi pi-cloud'
      case 'Middleware':
        return 'pi pi-code'
      case 'Firmware':
        return 'pi pi-code'
      case 'Équipements industriels':
        return 'pi pi-cog'
      default:
        return 'pi-angle-right'
    }
  }

  onDismiss() {
    this.createEquipementForm.reset();
    this.submitted = false; 
  }
  
}