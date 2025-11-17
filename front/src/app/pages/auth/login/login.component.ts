import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit{

    constructor(
        public layoutService: LayoutService,
        private fb : FormBuilder,
        private _auth : AuthService,
        private _message : MessageService
    ) { }

    authForm : FormGroup;

    ngOnInit(): void {
        this.authForm = this.fb.group({
            email : ['', Validators.required],
            password : ['', Validators.required],
        })
    }

    handleLogin(){
        if(!this.authForm.valid) {
            this._message.add({severity:"error", summary: 'Error', detail: "Please enter all fields"})
            return;
        }
        this._auth.login(this.authForm.value).subscribe();
    }
}
