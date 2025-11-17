import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { of, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-update-profile-details-dialog',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './update-profile-details-dialog.component.html',
  styleUrl: './update-profile-details-dialog.component.scss'
})
export class UpdateProfileDetailsDialogComponent implements OnInit, OnChanges{

  @Input() user : any | null = null;
  @Output() dismiss = new EventEmitter();
  @Input() visible = false;
  loading = false;

  constructor(
    private fb : FormBuilder,
    private _user : UserService,
    private _message : MessageService,
    private _auth : AuthService,
  ){}

  form : FormGroup;
  initialized = false;

  ngOnInit(): void {
    this.initialized = true;
    this.form = this.fb.group({
      firstName : ['' , Validators.required],
      lastName : ['', Validators.required],
      adresse : ['', Validators.required],
      phone : ['', Validators.required],
    })  
  }

  ngOnChanges(changes: any): void {
    if(changes.user && this.initialized){
      this.form.patchValue(changes.user?.currentValue)
    }
  }
  
  handleUpdate(){
    this._auth.authenticatedUser$.pipe(
      take(1),
      switchMap(user => {
        if(!user) return of()
          return this._user.updateDetails(user.id, this.form.value)
      })
    ).subscribe(
      {
        next : (res : any) => {
          this._message.add({ severity : 'success', summary : res.message });
          let user = this._auth.authenticatedUser.value;
          user.fullName = `${res.data.firstName} ${res.data.lastname}`,
          this._auth.authenticatedUser.next(user);
          this.dismiss.emit(this.form.value);
        },
        error : (err)=>{
          this._message.add({ severity : 'danger', summary : err.error.message })
        }
      }
    )
  }

}
