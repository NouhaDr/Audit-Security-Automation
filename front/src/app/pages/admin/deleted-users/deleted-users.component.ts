import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, of, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { CustomConfirmDialogComponent } from 'src/app/shared/dialogs/custom-confirm-dialog/custom-confirm-dialog.component';
import { UserInfosDialogComponent } from 'src/app/shared/dialogs/user-infos-dialog/user-infos-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-deleted-users',
  standalone: true,
  imports: [
    SharedModule,
    CustomConfirmDialogComponent,
    UserInfosDialogComponent
  ],
  templateUrl: './deleted-users.component.html',
  styleUrl: './deleted-users.component.scss'
})
export class DeletedUsersComponent {

  imagesUrl = environment.userImagesUrl;
  users: any[] = [];
  filteredUsers: any[] = [];
  rowGroupMetadata: any;
  loading: boolean = false;
  dialogVisible = false;
  selectedUser = null;
  
  deleteLoading: string | null = null;

  constructor(
    private _users: UserService,
    private _message: MessageService,
  ) {}

  ngOnInit(): void {
    this.getAllDeleted();
  }

  getAllDeleted() {
    this.loading = true;
    this._users.findDeleted().pipe(
      tap((res: any) => {
        this.loading = false;
        this.users = res.data;
        this.filteredUsers = this.users;
      }),
      catchError(err => {
        this.loading = false;
        return of(err);
      })
    ).subscribe();
  }

  showDetails(user: any) {
    this.selectedUser = user;
    this.dialogVisible = true;
  }

  handleUserDelete() {
    this._users.delete(this.deleteLoading).subscribe(
      {
        next: (res: any) => {
          this.users = this.users.filter(u => u._id !== res.data._id);
          this.filteredUsers = this.users;
          this._message.add({ severity: 'success', summary: res.message });
        },
        error: (err) => {
          this.clearLoading();
        }
      }
    );
  }

  selectUserToDelete(id: any) {
    this.deleteLoading = id;
  }

  clearLoading() {
    this.deleteLoading = null;
  }

  handleSearch(e: any) {
    this.filteredUsers = this.users.filter(u => u.firstName.toLowerCase().includes(e.target.value.toLowerCase()));
  }
}
