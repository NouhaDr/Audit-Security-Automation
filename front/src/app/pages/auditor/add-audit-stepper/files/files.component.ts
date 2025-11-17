import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, switchMap, take } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { FileUploadDialogComponent } from 'src/app/shared/dialogs/file-upload-dialog/file-upload-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { saveAs  } from 'file-saver'
@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    SharedModule,
    FileUploadDialogComponent
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss'
})
export class FilesComponent implements OnInit{
  
  constructor(
    private _stepper : AuditStepperService,
    private _router : Router,
    private _audit : AuditService,
    private _message : MessageService,

  ){}

  filteredFiles : any[] = [];
  files : any[] = [];
  loading = false;

  addFileDialogVisible = false;

  goBack(){
    this._stepper.selectedAuditID$.pipe(
      take(1),
      switchMap((id : string | null) => {
        if(id){
          return this._router.navigateByUrl(`/main/auditor/add-audit-stepper/${id}/questionnaire`);
        } 
        return of(null)
      })
    ).subscribe()
  }
  goNext(){
    this._stepper.selectedAuditID$.pipe(
      take(1),
      switchMap((id : string | null) => {
        if(id){
          return this._router.navigateByUrl(`/main/auditor/add-audit-stepper/${id}/confirmation`);
        } 
        return of(null)
      })
    ).subscribe();
  }


  fetchFiles(){
    this.loading = true;
    return this._stepper.selectedAuditID$.pipe(
      take(1),
      switchMap(id => {
        if(!id) return of();
        return this._audit.findById(id)
      }),
             
    ).subscribe({
      next : (res : any) => {
        this.loading = false;
        this.files = res.data.files
        this.filteredFiles = this.files;
      },
      error : (err)=> {
        this.loading = false;
      }
    }
      
    )
  }

  ngOnInit(): void {
    this.fetchFiles();
  }


  handleFileDelete(fileID : string){
    const r = confirm('Are you sure you want to delete this file ?');
    if(!r) return;
    this._stepper.selectedAuditID$.pipe(
      take(1),
      switchMap(id => {
        if(!id) return of();
        return this._audit.deleteFile(id, fileID)
      })
    ).subscribe({
      next : (res : any)=>{
        this.files = this.files.filter(f => f._id !== res.data);
        this.filteredFiles = this.files;
        this._message.add({ severity : "success", summary : res.message })
      },
      error : (err)=>{
        this._message.add({ severity : "danger", summary : err.mesage })
      }
    }
      
    );
  }

  hanldeFileAddCallback(e : any){
    this.files = [...this.files, e]
    this.filteredFiles = this.files;
    this.addFileDialogVisible = false;
  }

  downloadFile(file : string){
    this._audit.downloadFile(file);
  }
  
  handleSearch(e : string){
    this.filteredFiles = this.files.filter(f => f.title.toLowerCase().includes(e.toLowerCase()));
}
}
