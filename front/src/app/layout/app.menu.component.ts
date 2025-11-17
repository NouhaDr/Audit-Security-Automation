import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    role : string | null = null;

    constructor(
        public layoutService: LayoutService,
        private _auth : AuthService    
    ) { }

    ngOnInit() {
        this._auth.authenticatedUser$.pipe(
            tap(data => {
                if(data){
                    this.role = data.role;
                }
            })
        ).subscribe();

        this.model = [
            {
                label: 'Admin',
                icon: 'pi pi-fw pi-users',
                items: [
                    { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['admin'] },
                    {
                        label : 'Users',
                        icon:'pi pi-fw pi-users', 
                        items : [
                            { label: 'All users', icon: 'pi pi-fw pi-users', routerLink: ['admin/users'] },
                            { label: 'Add user', icon: 'pi pi-fw pi-user-plus', routerLink: ['admin/add-client'] },
                            { label: 'Deleted users', icon: 'pi pi-user-minus', routerLink: ['admin/deleted-users'] },
                        ]
                    },
                    
                    {
                        label : 'Audits',
                        icon:'pi pi-folder',
                        items : [
                            { label: 'All audits', icon: 'pi pi-folder', routerLink: ['admin/all-audits'] },
                            { label: 'Add audit', icon: 'pi pi-plus', routerLink: ['admin/add-audit'] },
                        
                        ]
                    },
                    {
                        label: 'Questionnaire', 
                        icon: 'pi pi-question-circle', 
                        items : [
                            { label: 'Questions', icon: 'pi pi-question', routerLink: ['admin/questionnaire/questions'] },
                            { label: 'Question categories', icon: 'pi pi-question', routerLink: ['admin/questionnaire/question-categories'] },
                        ]
                    },
    
                   
                ],
                roles : ["ADMIN"]
            },
            {
                label: 'Auditor',
                icon: 'pi pi-fw pi-users',
                items: [
                    { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['auditor/auditor'] },
                    { label: 'My audits', icon: 'pi pi-folder', routerLink: ['auditor/my-audits'] },
                    // { 
                    //     label: 'Add audit stepper', 
                    //     icon: 'pi pi-user-plus', 
                    //     routerLink: ['auditor/add-audit-stepper'],
                    //  },
        
                    { label:"Manage sections", icon: 'pi pi-th-large', routerLink: ['auditor/add-section']},
                    { label:"Scans", icon: 'pi pi-search', routerLink: ['auditor/scans']},
                    { label:"Scans history", icon: 'pi pi-search', routerLink: ['auditor/scan-history']},
                    { 
                        label: 'Reports', 
                        icon: 'pi pi-file', 
                        routerLink: ['auditor/audit-report'] 
                    },
                    
                ],
                roles : ["AUDITOR"]
            },
            {
                label: 'Audit leader',
                icon: 'pi pi-fw pi-users',
                items: [
                    { label: 'Home', 
                    icon: 'pi pi-fw pi-home', 
                    routerLink: ['auditLeader/audit-lead-home'] 
                    },
                    { 
                        label: 'My audits', 
                        icon: 'pi pi-fw pi-users', 
                        routerLink: ['auditLeader/my-audits-lead'] 
                    },
                    { 
                        label: 'Reports', 
                        icon: 'pi pi-file', 
                        routerLink: ['auditLeader/audit-report'] 
                    },
                    { label:"Scans", icon: 'pi pi-search', routerLink: ['auditLeader/scans-lead']}
                ],
                roles: ["AUDITLEADER"]
            },
            {
                label: 'Client',
                icon: 'pi pi-fw pi-users',
                items: [
                    { label: 'Home', 
                    icon: 'pi pi-fw pi-home', 
                    routerLink: ['client/client-home'] 
                    },
                    { label:"Report", icon: 'pi pi-file', routerLink: ['client/client-report']},
                    { label:"Scans", icon: 'pi pi-search', routerLink: ['client/scans-client']},
                ],
                roles: ["CLIENT"]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['pages/crud']
                    },
                    {
                        label: 'Timeline',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['pages/timeline']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['pages/empty']
                    },
                ],
                roles : ["ADMIN, AUDITOR, AUDITLEADER ,CLIENT"]
            },
            {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                            {
                                label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                        ]
                    },
                    {
                        label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                            {
                                label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                        ]
                    }
                ],
                roles : ["ADMIN, AUDITOR, CLIENT"]
            }
        ];
    }
}
