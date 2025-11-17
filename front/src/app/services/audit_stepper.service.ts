import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn : 'root'
})
export class AuditStepperService {
    constructor(){}


    private auditFormSubject = new BehaviorSubject<any | null>(null)
    auditForm$ = this.auditFormSubject.asObservable();

    private equipementsFormSubject = new BehaviorSubject<any[] | null>([])
    equipementForm$ = this.equipementsFormSubject.asObservable();
  
    private selectedAuditIDSubject = new BehaviorSubject<string | null>(null)
    selectedAuditID$ = this.selectedAuditIDSubject.asObservable();

    private selectedEquipementSubject = new BehaviorSubject<any | null>(null);
    selectedEquipement$ = this.selectedEquipementSubject.asObservable();
    
    private questionsSubject = new BehaviorSubject<any[] | null>([]);
    questions$ = this.questionsSubject.asObservable();
    
    setQuestions(qs : any){
        this.questionsSubject.next(qs);
    }

    getQuestions(){
        return this.questionsSubject.value;
    }

    setSelectedEquiepemnt(eq : any){
        this.selectedEquipementSubject.next(eq);
    }


    clearForm(){
        this.auditFormSubject.next(null);
    }

    clearSelectedID(){
        this.selectedAuditIDSubject.next(null);
    }

    setSelectedID(id : string){
        this.selectedAuditIDSubject.next(id);
    }

    setForm(title : string, data : any){
        this.auditFormSubject.next({ ...this.auditFormSubject.value, ...{ [title] : data} });
    }

    addEquipement(event : { type : string, data : any }){
        let equipements = this.equipementsFormSubject.value;         
        const category = event.data.category;

        if(event.type == 'add'){            
            if(!equipements[category]){
                equipements[category] = [];
            }
            const uuid = this.generateUniqueId();
            const new_eq = {...event.data, id : uuid}
            equipements[category].push(new_eq);
            this.equipementsFormSubject.next(equipements);
        }if(event.type == 'update'){
            const index = equipements[category].findIndex(e => e.id === event.data.id);
            equipements[category][index] = event.data;    
            this.equipementsFormSubject.next(equipements);
        }
        if(event.type == 'delete'){
            const res = confirm("Dou you want to delete this equipement ?");
            if(!res) return;
            let equ_cat = equipements[category];
            const index = equ_cat.findIndex(e => e.id === event.data.id);
            equ_cat.splice(index, 1);
            equipements[category] = equ_cat;
            if(equipements[category].length == 0 ){
                delete equipements[category];
            }
            this.equipementsFormSubject.next(equipements);
        }
        
    }

    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
}