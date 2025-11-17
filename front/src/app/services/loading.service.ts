import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() { }

  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  showLoading() {
    this.loading.next(true);
  }
  hideLoading() {
    this.loading.next(false);
  }
}