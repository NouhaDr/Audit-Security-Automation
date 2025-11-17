import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { of, switchMap, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-user-image-upload-dialog',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './user-image-upload-dialog.component.html',
  styleUrl: './user-image-upload-dialog.component.scss'
})
export class UserImageUploadDialogComponent {;
  @Output() dismiss = new EventEmitter();
  @Input() visible = false;

  constructor(
    private _message : MessageService,
    private _auth : AuthService,
    private _user : UserService,
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

  handleUpload(){
    this.submitted = true;
    this._auth.authenticatedUser$.pipe(
      take(1),
      switchMap(user => {
        if(!user) return of();
        return this._user.updateImage(user.id,  this.selectedFile)
      })
    ).subscribe({
      next : (res : any)=> {
        this.submitted = false;
        this._message.add({ severity : 'success', summary : res.message });
        this.selectedFile = null;
        this._auth.authenticatedUser.next({  ...this._auth.authenticatedUser.value, image : res.data });
        const ls_data = this._auth.loadAuthFromLS();
        this._auth.saveAuthToLS({  ...ls_data, image : res.data })
        this.dismiss.emit();
      },
      error : (err : any)=>{
        this._message.add({ severity : "danger", summary : err.message })
        this.submitted = false;
      },
    }
    );
  }
}
