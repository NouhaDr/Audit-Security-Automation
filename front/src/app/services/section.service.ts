import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SectionService {

    constructor(private _http: HttpClient) {}

    readonly baseUrl = `${environment.apiUrl}/api/sections`;

      
    // Récupérer toutes les sections
    findAllSections() {
        return this._http.get(`${this.baseUrl}`);
    }

    // Récupérer une section par ID
    findSectionById(id: string) {
        return this._http.get(`${this.baseUrl}/${id}`);
    }

    updateSection(id: string, data: { champs: { label: string, value: any, type: string }[] }) {
        return this._http.put(`${this.baseUrl}/${id}`, data);
      }
      


    // Ajouter une nouvelle section
    addSection(data: { nom: string, champs: Record<string, string> }) {
        return this._http.post(`${this.baseUrl}`, data);
    }

    // Récupérer toutes les sections
    findAll() {
        return this._http.get(`${this.baseUrl}`);
    }

    // Supprimer une section
    deleteSection(id: string) {
        return this._http.delete(`${this.baseUrl}/${id}`);
    }

    findSectionsByAuditId(auditId: string) {
        return this._http.get(`${this.baseUrl}/audit/${auditId}`);
    }    
      
    findOne(id: string) {
        return this._http.get(`${this.baseUrl}/${id}`);
    }

  
    update(id: string, data: any) {
        return this._http.patch(`${this.baseUrl}/${id}`, data); 
    }

    
    saveFields(id: string, champs: any) {
        return this._http.patch(`${this.baseUrl}/updateFields/${id}`, { champs });
    }    
      

}
