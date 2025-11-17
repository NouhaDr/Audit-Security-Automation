import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { LayoutService } from "./service/app.layout.service";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private _auth: AuthService,
        public router: Router
    ) { }

    ngOnInit() {
        this.layoutService.loadDarkMode();
    }

    toggleDarkMode() {
        this.layoutService.toggleDarkMode();
    }

    handleLogout() {
        this._auth.logout();
    }
}