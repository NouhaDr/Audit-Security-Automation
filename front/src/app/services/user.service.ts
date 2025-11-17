import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn : 'root'
})
export class UserService {

    constructor(private _http : HttpClient){}

    readonly baseUrl = `${environment.apiUrl}/api/users`;

    findAll(){
        return this._http.get(`${this.baseUrl}/findAll`)
    }
    findAllAuditors(){
        return this._http.get(`${this.baseUrl}/findAllAuditors`)
    }
    findAllClients(){
        return this._http.get(`${this.baseUrl}/findAllClients`)
    }
    findAllAuditleaders(){
        return this._http.get(`${this.baseUrl}/findAllAuditleaders`)
    }

    findById(id : string){
        return this._http.get(`${this.baseUrl}/findById/${id}`);
    }
    /*enableUser(id : string){
        return this._http.patch(`${this.baseUrl}/enable/${id}`, {});
    }
    findEnabled(enabled : boolean, role : string, deleted? : boolean | null){
        return this._http.get(`${this.baseUrl}/findEnabled?enabled=${enabled}&role=${role}`);
    }*/
    findDeleted(){
        return this._http.get(`${this.baseUrl}/findDeleted`);
    }
    updateDetails(id : string, data : any){
        return this._http.patch(`${this.baseUrl}/updateDetails/${id}`, data);
    }
    changePassword(id : string, data : any){
        return this._http.patch(`${this.baseUrl}/changePassword/${id}`, data);
    }
    updateImage(id : string, image : File){
        const formData = new FormData();
        formData.append('image', image);
        return this._http.patch(`${this.baseUrl}/${id}/image`, formData);
    }
    createUser(data : any){
        return this._http.post(`${this.baseUrl}/createUser`, data);
    }
    delete(id : string){
        return this._http.delete(`${this.baseUrl}/delete/${id}`);
    }
}