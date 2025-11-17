import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { map, switchMap, take, tap } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-add-audit-stepper',
  standalone: true,
  imports: [
    SharedModule,
    StepsModule
  ],
  templateUrl: './add-audit-stepper.component.html',
  styleUrl: './add-audit-stepper.component.scss'
})
export class AddAuditStepperComponent implements OnInit{

  constructor(
    private _activatedRoute : ActivatedRoute, 
    private _audit : AuditService,
    private _auditStepper : AuditStepperService,
  ){}

  items: MenuItem[] = [
    {
        label: 'Contact',
        routerLink: 'contact'
    },
    {
        label: 'Infrastructure',
        routerLink: 'infrastructure'
    },
    {
        label: 'Questionnaire',
        routerLink: 'questionnaire'
    },
    {
        label: 'Files',
        routerLink: 'files'
    },
    {
        label: 'Confirmation',
        routerLink: 'confirmation'
    }
];

  ngOnInit(): void {
    this._activatedRoute.paramMap.pipe(
      take(1),
      tap((v : any) => {
        this._auditStepper.setSelectedID(v.params.id);
      })
    ).    
    subscribe()
  }

}
