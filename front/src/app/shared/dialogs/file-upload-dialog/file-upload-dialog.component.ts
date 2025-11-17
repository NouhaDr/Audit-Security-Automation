import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { of, switchMap } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-file-upload-dialog',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './file-upload-dialog.component.html',
  styleUrl: './file-upload-dialog.component.scss'
})
export class FileUploadDialogComponent {

  @Output() addCallback = new EventEmitter();
  @Output() dismiss = new EventEmitter();
  @Input() visible = false;
  @Input() auditId: string = ''; 

  constructor(
    private _stepper : AuditStepperService,
    private _audit : AuditService,
    private _message : MessageService,
  ){}

  submitted = false;
  selectedFile : any | null = null;

  onDismiss(){
    this.dismiss.emit(false);
  }  

   onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  handleUpload() {
    if (!this.auditId) {
      this._message.add({ severity: "error", summary: "Audit ID manquant !" });
      return;
    }

    if (!this.selectedFile) {
      this._message.add({ severity: "warn", summary: "Aucun fichier sélectionné." });
      return;
    }

    this.submitted = true;
    this._audit.uploadFile(this.auditId, this.selectedFile).subscribe({
      next: (res: any) => {
        this.submitted = false;
        this._message.add({ severity: 'success', summary: res.message });
        this.selectedFile = null;
        this.addCallback.emit(res.data); // ✅ Émettre le fichier ajouté
      },
      error: (err: any) => {
        this._message.add({ severity: "error", summary: err.message });
        this.submitted = false;
      },
    });
  }


}
