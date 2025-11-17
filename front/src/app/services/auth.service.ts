import { Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { LoadingService } from "./loading.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "../models/api_response";
import { AuthRequest } from "../models/auth_request";
import { RegisterRequest } from "../models/register_request";
import { AuthResponse } from "../models/auth_response";
import { ToastService } from "./toast.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = `${environment.apiUrl}/api/auth`;

  isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  authenticatedUser = new BehaviorSubject<AuthResponse | null>(null);
  authenticatedUser$ = this.authenticatedUser.asObservable();

  readonly AUDIT_APP_KEY = "audit_app_prologic";
  private tokenExpirationTimer: any;

  constructor(
    private _http: HttpClient,
    private _loading: LoadingService,
    private _router: Router,
    private _toast: ToastService
  ) {}

  getAuthUser() {
    return this.authenticatedUser.value;
  }

  public saveAuthToLS(data: AuthResponse) {
    localStorage.setItem(this.AUDIT_APP_KEY, JSON.stringify(data));
  }

  public loadAuthFromLS(): AuthResponse | null {
    let auth = localStorage.getItem(this.AUDIT_APP_KEY);
    if (auth) {
      return JSON.parse(auth);
    }
    return null;
  }

  login(auth: AuthRequest) {
    this._loading.showLoading();
    return this._http.post<ApiResponse>(`${this.baseUrl}/login`, auth).pipe(
      tap(response => {
        this.saveAuthToLS(response.data);
        this.isAuthenticated.next(true);
        this.authenticatedUser.next(response.data);
        this._loading.hideLoading();

        // ✅ Redirige en fonction de isFirstLogin
        this.redirectUser(response.data.role, response.data.isFirstLogin, true);
      })
    );
  }

  register(auth: RegisterRequest) {
    this._loading.showLoading();
    return this._http.post<ApiResponse>(`${this.baseUrl}/register`, auth).pipe(
      tap(response => {
        this.saveAuthToLS(response.data);
        this.isAuthenticated.next(true);
        this.authenticatedUser.next(response.data);
        this._toast.setSuccess(response.data);
        this._loading.hideLoading();

        this.redirectUser(response.data.role, response.data.isFirstLogin, true);
      })
    );
  }

  autoLogin() {
    let auth = this.loadAuthFromLS();
    if (auth != null) {
      this.isAuthenticated.next(true);
      this.authenticatedUser.next(auth);
    }
  }

  private isCurrentRouteMatchingRole(role: string): boolean {
    const currentRoute = this._router.url;
    switch (role) {
      case 'ADMIN':
        return currentRoute.startsWith('/main/admin');
      case 'AUDITOR':
        return currentRoute.startsWith('/main/auditor');
      case 'AUDITLEADER':
        return currentRoute.startsWith('/main/auditLeader');
      default:
        return currentRoute.startsWith('/main');
    }
  }

  /**
   * ✅ Redirection conditionnelle vers la bonne page
   * @param role - rôle de l'utilisateur
   * @param isFirstLogin - booléen qui indique si c'est la première connexion
   * @param forceRedirect - forcer la redirection après connexion
   */
  private redirectUser(role: string, isFirstLogin: boolean, forceRedirect: boolean) {
    if (isFirstLogin) {
      this._router.navigate(['/main/profile']);
      return;
    }

    if (forceRedirect || !this.isCurrentRouteMatchingRole(role)) {
      switch (role) {
        case 'ADMIN':
          this._router.navigate(['/main/admin']);
          break;
        case 'AUDITOR':
          this._router.navigate(['/main/auditor']);
          break;
        case 'AUDITLEADER':
          this._router.navigate(['/main/auditLeader']);
          break;
        case 'CLIENT':
          this._router.navigate(['/main/client']);
          break;
        default:
          this._router.navigate(['/main']);
      }
    }
  }

  signup(data: RegisterRequest) {
    this._loading.showLoading();
    return this._http.post<ApiResponse>(`${this.baseUrl}/signup`, data).pipe(
      tap(response => {
        this._loading.hideLoading();
      })
    );
  }

  logout() {
    this.authenticatedUser.next(null);
    this.isAuthenticated.next(false);
    localStorage.removeItem(this.AUDIT_APP_KEY);
    this._router.navigateByUrl("/");
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this._toast.setSuccess("Token expiré, vous êtes déconnecté");
    }, expirationDuration);
  }

  updatePasword(userID: string, data: any) {
    return this._http.patch(`${this.baseUrl}/user/${userID}/password`, data);
  }
}
