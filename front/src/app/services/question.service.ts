import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn : 'root'
})
export class QuestionService {

    constructor(private _http : HttpClient){}

    readonly baseUrl = `${environment.apiUrl}/api/questions`;

    findAll(){
        return this._http.get(`${this.baseUrl}/findAll`)
    }
    create(data : any){
        return this._http.post(`${this.baseUrl}/create`, data);
    }
    delete(id : string){
        return this._http.delete(`${this.baseUrl}/delete/${id}`);
    }
    update(id : string, data : any){
        return this._http.patch(`${this.baseUrl}/update/${id}`, data);
    }

    getQuestionById(id : string){
        return this._http.get(`${this.baseUrl}/${id}`);
    }
    
    //categories
    
    getCategories(){
        return this._http.get(`${this.baseUrl}/categories/findAll`)
    }
    
    createCategory(data : any){
        return this._http.post(`${this.baseUrl}/categories/create`, data);
    }
    
    deleteCategory(id : string){
        return this._http.delete(`${this.baseUrl}/categories/delete/${id}`);
    }

    updateCategory(id : string, data : any){
        return this._http.patch(`${this.baseUrl}/categories/update/${id}`, data);
    }
 
}