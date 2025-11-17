import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScanService {
  
  constructor(private http: HttpClient) {}

  readonly baseUrl =  `${environment.apiUrl}/api/scan`;

  launchScan(data: { auditId: string; ip: string; typeScan: string }) {
    return this.http.post(`${this.baseUrl}/lancer`, data);
  }  

  getScanConfigs() {
    return this.http.get(`${this.baseUrl}/scan-configs`);
  }

  getByAudit(auditId: string) {
    return this.http.get(`${this.baseUrl}/audit/${auditId}`);
  }

  // ✅ Récupérer les vulnérabilités d’un scan
  getVulnerabilitiesByScan(scanId: string){
    return this.http.get(`${this.baseUrl}/${scanId}/vulnerabilities`);
  }
  
}
