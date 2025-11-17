import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { saveAs } from 'file-saver';
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuditService {

    private sectionsSubject = new BehaviorSubject<any[]>([]);
    sections$ = this.sectionsSubject.asObservable(); // Observable pour suivre les mises à jour des sections

    constructor(
        private _http: HttpClient,
    ) { }
    
    readonly baseUrl = `${environment.apiUrl}/api/audits`;

    // ✅ Trouver tous les audits
    findAllAudits() {
        return this._http.get(`${this.baseUrl}/findAll`);
    }

    // ✅ Trouver un audit par ID
    findById(id: string) {
        return this._http.get(`${this.baseUrl}/findById/${id}`);
    }

    // ✅ Trouver les informations de contact d'un audit
    findAuditContactInfosById(id: string) {
        return this._http.get(`${this.baseUrl}/${id}/contact`);
    }

    // ✅ Trouver les équipements d'un audit
    findAuditEquipements(id: string) {
        return this._http.get(`${this.baseUrl}/${id}/equipements`);
    }

    // ✅ Trouver les équipements par ID d'audit
    findAuditEquipementsByID(id: string) {
        return this._http.get(`${this.baseUrl}/${id}/equipements`);
    }

    // ✅ Trouver le questionnaire d'un audit
    findAuditQuestionnaire(id: string) {
        return this._http.get(`${this.baseUrl}/${id}/questionnaire`);
    }

    // ✅ Trouver les fichiers d'un audit
    findAuditFiles(id: string) {
        return this._http.get(`${this.baseUrl}/${id}/files`);
    }

    // ✅ Trouver les audits assignés à un auditeur leader
    findByAuditLeader(id: string) {
        return this._http.get(`${this.baseUrl}/findByAuditLeader/${id}`);
    }

    // ✅ Créer un audit
    createAudit(data: any) {
        return this._http.post(`${this.baseUrl}/create`, data);
    }

    // ✅ Supprimer un audit
    deleteAudit(id: string) {
        return this._http.delete(`${this.baseUrl}/delete/${id}`);
    }

    // ✅ Assigner des auditeurs et auditleaders
    assign(data: { auditors: string[], auditleaders: string[] }, id: string) {
        return this._http.patch(`${this.baseUrl}/assign/${id}`, data);
    }

    // ✅ Trouver les audits assignés à un auditeur
    findByAuditor(id: string) {
        return this._http.get(`${this.baseUrl}/findByAuditor/${id}`);
    }

    findByClient(id: string) {
        return this._http.get(`${this.baseUrl}/findByClient/${id}`);
    }

    // ✅ Mettre à jour un audit
    updateAudit(id: string, data: any) {
        return this._http.patch(`${this.baseUrl}/updateAudit/${id}`, data);
    }

    // ✅ Mettre à jour la progression d'un audit
    updateAuditProgress(id: string) {
        return this._http.patch(`${this.baseUrl}/${id}/progress`, {});
    }

    // ✅ Ajouter un équipement à un audit
    addEquipementToAudit(id : string, data : any){
        return this._http.patch(`${this.baseUrl}/${id}/equipements`, data);
    }

    // ✅ Récupérer les éléments du tableau de bord
    getDashboardItems() {
        return this._http.get(`${this.baseUrl}/dashboard`);
    }

    // ✅ Supprimer un équipement d'un audit
    removeEquipementFromAudit(auditId: string, equipementID: string) {
        return this._http.delete(`${this.baseUrl}/${auditId}/equipements/${equipementID}`);
    }

   
    // ✅ Mettre à jour un équipement d'un audit en passant `auditId` et `equipementID`
    updateEquipementFromAudit(auditId: string, equipementId: string, data: any) {
        return this._http.patch(`${this.baseUrl}/${auditId}/equipements/${equipementId}`, data);
    }
    
    
    


    // ✅ Soumettre un questionnaire d'audit
    submitQuestions(auditId: string, questionnaire: any) {
        const data = questionnaire.map(e => ({ question: e.question._id, response: e.response }));
        return this._http.patch<any>(`${this.baseUrl}/${auditId}/questionnaire`, { questionnaire: data });
    }

    // ✅ Télécharger un fichier attaché à un audit
    uploadFile(auditId: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return this._http.post(`${this.baseUrl}/${auditId}/files`, formData);
    }

    // ✅ Supprimer un fichier attaché à un audit
    deleteFile(auditId: string, fileID: string) {
        return this._http.patch(`${this.baseUrl}/${auditId}/files/${fileID}`, {});
    }

    // ✅ Télécharger un fichier depuis l'API
    downloadFile(file: string) {
        return this._http.get(`${environment.auditFilesUrl}/${file}`, { responseType: 'blob' });
    }
    

     // ✅ Ajouter une section à un audit
    addSectionToAudit(auditId: string, sectionData: { nom: string, champs: any }) {
        return this._http.patch(`${this.baseUrl}/${auditId}/sections`, sectionData).pipe(
            tap(() => {
                // 🔄 Recharger les sections après ajout
                this.findSectionsByAuditId(auditId).subscribe(sections => {
                    this.sectionsSubject.next(sections);
                });
            })
        );
    }


     // ✅ Trouver les sections d'un audit
     findSectionsByAuditId(auditId: string): Observable<any[]> {
        return this._http.get<any[]>(`${this.baseUrl}/${auditId}/sections`);
    }

      // ✅ Supprimer une section d'un audit
      deleteSectionFromAudit(auditId: string, sectionId: string) {
        return this._http.delete(`${this.baseUrl}/${auditId}/sections/${sectionId}`).pipe(
            tap(() => {
                // 🔄 Recharger les sections après suppression
                this.findSectionsByAuditId(auditId).subscribe(sections => {
                    this.sectionsSubject.next(sections);
                });
            })
        );
    }

    // ✅ Mettre à jour une section d'un audit
    updateSectionFromAudit(auditId: string,sectionId: string, sectionData: { nom: string, champs: any ,remark?: string }) {
         return this._http.patch(`${this.baseUrl}/${auditId}/sections/${sectionId}`, sectionData).pipe(
            tap(() => {
                // 🔄 Recharger les sections après mise à jour
                this.findSectionsByAuditId(sectionId).subscribe(sections => {
                    this.sectionsSubject.next(sections);
                });
            })
        );
    }
    

    // ✅ Confirmer une section d'un audit
    confirmSection(auditId: string, sectionId: string, sectionData: any) {
        return this._http.patch(`${this.baseUrl}/${auditId}/sections/${sectionId}/confirm`, sectionData).pipe(
            tap(() => {
                this.findSectionsByAuditId(auditId).subscribe(sections => {
                    this.sectionsSubject.next(sections);
                });
            })
        );
    }

    saveSectionData(auditId: string, sectionId: string, sectionData: any) {
        return this._http.patch(`${this.baseUrl}/${auditId}/sections/${sectionId}/saveSectionData`, {}).pipe(
            tap(() => {
                this.findSectionsByAuditId(auditId).subscribe(sections => {
                    this.sectionsSubject.next(sections);
                });
            })
        );
    }
    
    // ✅ Rejeter une section d'un audit
rejectSection(auditId: string, sectionId: string, sectionData: any) {
    return this._http.patch(`${this.baseUrl}/${auditId}/sections/${sectionId}/reject`, sectionData).pipe(
        tap(() => {
            // 🔄 Recharger les sections après rejet
            this.findSectionsByAuditId(auditId).subscribe(sections => {
                this.sectionsSubject.next(sections);
            });
        })
    );
}

// ✅ Valider une section d'un audit
validateSection(auditId: string, sectionId: string, sectionData: any) {
    return this._http.patch(`${this.baseUrl}/${auditId}/sections/${sectionId}/validate`, sectionData);
}

    
}
