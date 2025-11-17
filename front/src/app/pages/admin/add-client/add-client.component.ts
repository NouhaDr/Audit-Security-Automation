import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule,DropdownModule,RadioButtonModule
  ],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent implements OnInit {

  submitted = false;
  roles = ['ADMIN', 'CLIENT', 'AUDITOR', 'AUDITLEADER'];

  newUserForm: FormGroup;
  image = "";
  formTitle = "";
  role = "AUDITOR";

  constructor(
    private _user: UserService, 
    private _formBuilder: FormBuilder,
    private _message: MessageService,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._route.data.pipe(
      tap(data => {
        this.formTitle = `Add User`;
        this.role = data['role'];
      })
    ).subscribe();

    this.newUserForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]], 
      password: ['', [Validators.required, Validators.minLength(6)]],
      adresse: ['', Validators.required],
      role: [this.role || '', Validators.required],
      company: [''], // Initialisation vide, validation ajustée dynamiquement
      gender: ['', Validators.required],
    });

    // Gestion dynamique des validations selon le rôle sélectionné
    this.newUserForm.get('role')?.valueChanges.pipe(
      tap(role => {
        this.role = role;
        const companyControl = this.newUserForm.get('company');

        if (role === 'CLIENT') {
          companyControl?.setValidators([Validators.required]);
        } else {
          companyControl?.clearValidators();
        }
        companyControl?.updateValueAndValidity();
      })
    ).subscribe();
  }

  handleSubmit() {
    if (!this.newUserForm.valid) {
      this._message.add({ severity: 'error', summary: "Missing or Invalid fields, please try again!" });
      this.submitted = false;
      return;
    }

    this.submitted = true;
    this._user.createUser(this.newUserForm.value).subscribe({
      next: (res: any) => {
        this._message.add({ severity: 'success', summary:"User added successfully" });
        this.submitted = false;
      },
      error: err => {
        this.submitted = false;
      }
    });
  }
}
