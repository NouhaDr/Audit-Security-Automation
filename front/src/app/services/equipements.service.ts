import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class EquipementService {

    constructor(
        private _http : HttpClient, 
    ){}

    readonly baseUrl = `${environment.apiUrl}/api/equipements`;


    addEquipement(data: { category: string, subcategory: string, ref: string, details?: string, manufacturer: string }) {
        return this._http.post(`${this.baseUrl}/add`, data);
    }
    searchEquipement(data : { manufacturer  : string, ref : string }){
        return this._http.post(`${this.baseUrl}/search`, data)
    }
    findAll(){
        return this._http.get(`${this.baseUrl}`);
    }
    deleteEquipements(id : string){
        return this._http.delete(`${this.baseUrl}/${id}`);
    }
    updateEquipements(id : string, data : any){
        return this._http.patch(`${this.baseUrl}/${id}`, data);
    }
 
  }