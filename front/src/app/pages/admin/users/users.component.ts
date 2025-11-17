import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, of, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { CustomConfirmDialogComponent } from 'src/app/shared/dialogs/custom-confirm-dialog/custom-confirm-dialog.component';
import { EditUserDialogComponent } from 'src/app/shared/dialogs/edit-user-dialog/edit-user-dialog.component';
import { UserInfosDialogComponent } from 'src/app/shared/dialogs/user-infos-dialog/user-infos-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    SharedModule,
    CustomConfirmDialogComponent,
    UserInfosDialogComponent,
    EditUserDialogComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{

  users : any[] = [];
  filteredUsers : any[] = [];
  imagesUrl = environment.userImagesUrl;
  loading: boolean = false;
  deleteUserloading  : string | null = null;
  selectedUser : any | null = null;
  editDialogVisible = false;
 

  dialogVisible = false;


  constructor(
    private _users : UserService,
    private _message : MessageService,
  ){}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(){
    this.loading = true;
    this._users.findAll().pipe(
      tap((res : any) => {
        this.loading = false;
        this.users = res.data
        this.filteredUsers = res.data;
      }),
      catchError(err => {
        this.loading = false;
        return of(err)
      })
    ).subscribe()
  }


  handleSearch(e : any){
    this.filteredUsers = this.users.filter(u => u.firstName.toLowerCase().includes(e.target.value.toLowerCase()))
  }

  selectUserToDelete(id : string){
    this.deleteUserloading = id;
  }

  handleUserDelete(){
    this._users.delete(this.deleteUserloading).subscribe({
      next : (res : any)=> {
        this.filteredUsers = this.filteredUsers.filter(u => u._id !== this.deleteUserloading)
        this.clearLoading();
        this._message.add({ severity : 'success', summary : res.message })
      },
      error : (err)=> {
        this.clearLoading()
      }
    })
  }

  clearLoading(){
    this.deleteUserloading = null;
  }

  showDetails(user : any){
    this.dialogVisible = !this.dialogVisible;
    this.selectedUser = user;
  }

  handleUserUpdate(event : any){
    const index = this.users.findIndex(u => u._id === event._id);
    this.users[index] = event;
    this.editDialogVisible = !this.editDialogVisible;
    this.selectedUser = null;
  }

  showEditDialog(user : any){
    this.editDialogVisible = !this.editDialogVisible;
    this.selectedUser = user;
  }

}