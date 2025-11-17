import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-infos-dialog',
  standalone : true,
  imports  :[
    DialogModule,
    CommonModule
  ],
  templateUrl: './user-infos-dialog.component.html',
  styleUrl: './user-infos-dialog.component.scss'
})
export class UserInfosDialogComponent {

  imagesUrl = environment.userImagesUrl;

  @Input() selectedUser : any | null = null;
  @Input() visible : boolean  = false;

  @Output() hide  = new EventEmitter()


  handleHide(){
    this.hide.emit(true);
  }
}
