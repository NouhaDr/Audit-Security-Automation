import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DialogModule } from 'primeng/dialog';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../../shared.module';
import { AuditService } from 'src/app/services/audit.service';
import { ConfirmInfrastructureSectionComponent } from 'src/app/pages/auditor/add-audit-stepper/audit-confirmation/confirm-infrastructure-section/confirm-infrastructure-section.component';

@Component({
  selector: 'app-audit-infos-dialog',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    AvatarGroupModule,
		AvatarModule ,
    SharedModule,
    ConfirmInfrastructureSectionComponent
  ],
  templateUrl: './audit-infos-dialog.component.html',
  styleUrl: './audit-infos-dialog.component.scss'
})
export class AuditInfosDialogComponent {
  imagesUrl = environment.userImagesUrl;

constructor(
  private _audit : AuditService
){

}

  @Input() selectedAudit : any | null = null;
  @Input() visible : boolean  = false;

  @Output() hide  = new EventEmitter()


  handleHide(){
    this.hide.emit(true);
  }

  downloadFile(file : string){
    this._audit.downloadFile(file);
  }
}
