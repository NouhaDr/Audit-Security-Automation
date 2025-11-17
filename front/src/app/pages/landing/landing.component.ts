import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';
import { CarouselModule } from 'primeng/carousel';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit, OnDestroy{

    homeRedirectUrl = '';
    private destroy$: Subject<void> = new Subject<void>();


    carouselItems = [
        {
          title: 'Automated Audit Reports',
          description: 'Generate, review, and store your IT audit reports easily.',
          image: 'assets/hero-slide1.png'
        },
        {
          title: 'Built for Security Teams',
          description: 'Empower your team with real-time visibility and compliance.',
          image: 'assets/hero-slide2.png'
        }
      ];
      
    authenticated$ =  this._auth.isAuthenticated$;
    authUser$ = this._auth.authenticatedUser$.pipe(
        takeUntil(this.destroy$),
        tap((user : any) => {
            if(user){
                this.homeRedirectUrl = user.role === "ADMIN" ? 'admin' : user.role === "AUDITOR" ? 'auditor' : 'client' ;
            }
        })
    );

    constructor(
        public layoutService: LayoutService, 
        public router: Router,
        private _auth : AuthService
    ) { }

    ngOnInit(): void {
      this.authUser$.subscribe();  
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    logout(){
        this._auth.logout()
    }
}
