import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { AuditService } from 'src/app/services/audit.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-change-audit-progress-dialog',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './change-audit-progress-dialog.component.html',
  styleUrl: './change-audit-progress-dialog.component.scss'
})
export class ChangeAuditProgressDialogComponent implements OnChanges {
    @Input() visible = false;
    @Output() dismiss = new EventEmitter();
    @Input() audit : any | null = null;

    submitted = false;

    constructor(
      private _audit : AuditService,
      private _message : MessageService,
    ){}


    handleHide(){
      this.dismiss.emit(false);
    }

    handleProgressSubmit(){
      if(!this.audit){
        return;
      }
      this.submitted = true;
      // this._audit.updateAuditProgress(this.audit._id, this.audit.progress).subscribe({
      //   next : (res : any) => {
      //     this.submitted = false;
      //     this._message.add({ severity : 'success', summary : res.message });
      //     this.dismiss.next(res.data);
      //   },
      //   error : (err)=>{
      //     this.submitted = false;
      //   }
      // })
    }

    ngOnChanges(changes: any): void {
      if(changes.audit){
        this.audit = changes.audit.currentValue;
      }
    }
}
