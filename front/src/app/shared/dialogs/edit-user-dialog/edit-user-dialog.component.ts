import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DialogModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss'
})
export class EditUserDialogComponent implements OnInit, OnChanges{

  @Input() selectedUser : any | null = null;
  @Output() callback : any = new EventEmitter();
  @Input() editDialogVisible = false;
  @Output() dismiss = new EventEmitter();

  imagesUrl = environment.userImagesUrl;
  submitted = false;

  constructor(
    private _user : UserService,
    private fb : FormBuilder,
    private _message : MessageService
  ){}

  userForm : FormGroup; 

  ngOnInit(): void {
    this.userForm =  this.fb.group({
      firstName : [this.selectedUser?.firstName || '', Validators.required],
      lastName : [this.selectedUser?.lastName || '', Validators.required],
      email : [this.selectedUser?.email || '', Validators.required],
      phone : [this.selectedUser?.phone || '', Validators.required],
      adresse : [this.selectedUser?.adresse || '', Validators.required],
      gender : [this.selectedUser?.gender || ''],
      company : [this.selectedUser?.company || '', this.selectedUser?.role == "CLIENT" ? Validators.required : null],
    })  
  }

  handleUpdate(){
    if(!this.userForm.valid){
      this._message.add({ severity: 'error', summary : 'Please fill all fields' });
      return;
    }
    this.submitted = true;
    this._user.updateDetails(this.selectedUser._id,  this.userForm.value).subscribe(
      {
        next : (res : any)=> {
          this.submitted = false;
          this.callback.emit(res.data);
          this._message.add({ severity: 'success', summary : res.message });
        },
        error : (err : any)=> {
          this.submitted = false;
          this._message.add({ severity: 'error', summary : err.message });
        },
      }
    )
  }

  onDismiss(){
    this.dismiss.emit(false);
  }

  ngOnChanges(changes: any) {
    if (changes.selectedUser && this.selectedUser) {
      this.userForm.patchValue(this.selectedUser);
    }
  }

}
