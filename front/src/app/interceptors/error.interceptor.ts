import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { MessageService } from "primeng/api";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authServ: AuthService,
    private _message : MessageService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          this.authServ.logout();
        }
        this._message.add({severity:'error', summary: 'Error', detail: err.error.message})
        return throwError(err);
      })
    );
  }
}