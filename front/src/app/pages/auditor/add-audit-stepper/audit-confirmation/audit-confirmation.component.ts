import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, of, switchMap, take } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfirmContactSectionComponent } from './confirm-contact-section/confirm-contact-section.component';
import { ConfirmInfrastructureSectionComponent } from './confirm-infrastructure-section/confirm-infrastructure-section.component';
import { ConfirmQuestionnaireSectionComponent } from './confirm-questionnaire-section/confirm-questionnaire-section.component';
import { ConfirmFilesSectionComponent } from './confirm-files-section/confirm-files-section.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-audit-confirmation',
  standalone: true,
  imports: [
    SharedModule,
    ConfirmContactSectionComponent,
    ConfirmInfrastructureSectionComponent,
    ConfirmQuestionnaireSectionComponent,
    ConfirmFilesSectionComponent
  ],
  templateUrl: './audit-confirmation.component.html',
  styleUrl: './audit-confirmation.component.scss'
})
export class AuditConfirmationComponent implements OnInit{


  constructor(
    private _stepper : AuditStepperService,
    private _router : Router,
    private _audit : AuditService,
    private _message : MessageService,
  ){}

  audit : any | null = null;

  tabs = [
    {title :  'Contact informations', router : 'contact'},
    {title :  'Infrastructure', router : 'infrastructure'},
    {title :  'Questionnaire', router : 'questionnaire'},
  ]

  handleNavigate(tab : string){
    this._stepper.selectedAuditID$.pipe(
      take(1),
      switchMap(id => {
        return this._router.navigateByUrl(`/main/auditor/add-audit-stepper/${id}/${tab}`);
      })
    ).subscribe()
  }
  
  getAuditById(){
    this._stepper.selectedAuditID$.pipe(
      take(1),
      switchMap(id => {
        if(!id) return of();
        return this._audit.findById(id)
      })
    ).pipe(
      map(
        (res : any) => ({ ...res.data, equipements : this.groupEquipementsByCategory(res.data.equipements) })
      )
    )
    .subscribe(
      (res : any) => {
        this.audit = res;
      }
    );
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
      icon : this.setCatgeoryIcon(key),
      items: grouped[key]
    }));
  }

  setCatgeoryIcon(key : string){
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

  ngOnInit(): void {
    this.getAuditById();
  }

  confirmAudit(){
    this._message.add({ severity : "success", summary : 'Audit saved successfully' });
    this._router.navigateByUrl('/main/auditor/my-audits')
  }

  goBack(){
    this._stepper.selectedAuditID$.pipe(
      take(1),
      switchMap((id : string | null) => {
        if(id){
          return this._router.navigateByUrl(`/main/auditor/add-audit-stepper/${id}/files`);
        } 
        return of(null)
      })
    ).subscribe()
  }

}
