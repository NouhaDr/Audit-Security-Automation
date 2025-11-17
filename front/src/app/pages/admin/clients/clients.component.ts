import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, of, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { CustomConfirmDialogComponent } from 'src/app/shared/dialogs/custom-confirm-dialog/custom-confirm-dialog.component';
import { UserInfosDialogComponent } from 'src/app/shared/dialogs/user-infos-dialog/user-infos-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    SharedModule,
    UserInfosDialogComponent,
    CustomConfirmDialogComponent
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit{

  imagesUrl = environment.userImagesUrl;
  clients : any[] = [];
  filteredClients : any[] = [];
  loading: boolean = false;
  dialogVisible = false;
  selectedUser = null;
  deleteClientLoading : string | null = null;


  constructor(
    private _users : UserService,
    private _message : MessageService
  ){}

  ngOnInit(): void {
    this.getAllClients();
  }

  getAllClients(){
    this.loading = true;
    this._users.findAllClients().pipe(
      tap((res : any) => {
        this.loading = false;
        this.clients = res.data
        this.filteredClients = res.data
      }),
      catchError(err => {
        this.loading = false;
        return of(err)
      })
    ).subscribe()
  }

  showDetails(user :any){
    this.selectedUser = user;
  }

  handleUserDelete(){
    this._users.delete(this.deleteClientLoading!).subscribe(
      {
        next : (res : any)=>{
          this._message.add({ severity : 'success', summary : res.message });
          this.clients = this.clients.filter(c => c._id !== res.data._id);
          this.filteredClients = this.clients;
          this.clearLoading()
        },
        error : (err)=>{
          this.clearLoading()
        }
      }
    )
  }

  delete(id : string){
    this.deleteClientLoading = id;
  }

  clearLoading(){
    this.deleteClientLoading = null;
  }

  handleSearch(v : any){
    this.filteredClients = this.clients.filter(u => u.firstName.toLowerCase().includes(v.toLowerCase()))
  }


}
