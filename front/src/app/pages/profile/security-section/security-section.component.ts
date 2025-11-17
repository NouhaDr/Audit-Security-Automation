import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { of, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-security-section',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './security-section.component.html',
  styleUrl: './security-section.component.scss'
})
export class SecuritySectionComponent implements OnInit{

  constructor(
    private _message : MessageService,
    private _auth : AuthService,
    private fb : FormBuilder,
  ){}

  passwordLoading = false;
  passwordForm : FormGroup

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      oldPassword : ['', [Validators.required, Validators.minLength(5)]],
      newPassword : ['', [Validators.required, Validators.minLength(5)]],
      confirmNewPassword : ['', [Validators.required, Validators.minLength(5)]],
    })
  }


  handlePasswordChange(){
    this.passwordLoading = true;
    this._auth.authenticatedUser$.pipe(
      tap(e=>{
        this._message.clear();
      }),
      switchMap(user => {
        if(!user || !user.id) return of();
        return this._auth.updatePasword(user.id, this.passwordForm.value)
      })
    ).subscribe({
      next : (res : any) => {
        console.log(res)
        this.passwordLoading = false;
        this._message.add({ severity : 'success', summary : res.message })
      },
      error : (err : any) => {
        this.passwordLoading = false;
        this._message.add({ severity : 'danger', summary : err.error.message })
      }
    }      
    )
  }

}
