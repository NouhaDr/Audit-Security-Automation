import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { map, of, switchMap, take, tap } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { QuestionService } from 'src/app/services/question.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss'
})
export class QuestionnaireComponent implements OnInit{

  questions = [];

  constructor(
    public _router : Router, 
    private _auditStepper : AuditStepperService,
    private _questionnaire : QuestionService,
    private _audit : AuditService,
    private _message : MessageService,
  ){}

  goBack(){
    this._auditStepper.selectedAuditID$.pipe(
      take(1),
      switchMap((id : string | null) => {
        if(id){
          return this._router.navigateByUrl(`/main/auditor/add-audit-stepper/${id}/infrastructure`);
        } 
        return of(null)
      })
    ).subscribe()
  }
  goNext(){
    this._auditStepper.setForm('questionnaire', this.questions)
    this.submitQuestions();
    this._auditStepper.selectedAuditID$.pipe(
      take(1),
      switchMap((id : string | null) => {
        if(id){
          return this._router.navigateByUrl(`/main/auditor/add-audit-stepper/${id}/files`);
        } 
        return of(null)
      })
    ).subscribe();
  }

  fetchQuestions(){
    return this._auditStepper.selectedAuditID$.pipe(
      take(1),
      switchMap(id => {
        if(!id) return of();
        return this._audit.findAuditQuestionnaire(id).pipe(
          switchMap((res : any) => {
            if(res.data.length != 0) return of(res.data)
            return this._questionnaire.findAll().pipe(
              map((res : any) => res.data.map(e => ({ question : e, response : null }))),
            )
          })   
        )
      }),
             
    ).subscribe(
      res => {
        this.questions = res
      }
    )
  }

  submitQuestions(){
    this._auditStepper.selectedAuditID$.pipe(
      take(1),
      switchMap((id : any) => {
        if(!id) return of(); 
        return this._audit.submitQuestions(id, this.questions).pipe(
          tap(res => {
            this._message.add({ severity : 'success', summary : res.message })
          })
        )
      })
    ).subscribe()
  }

  ngOnInit(): void {
    this.fetchQuestions()
  }

  handleQuestionCheck(q : any, answer : boolean){
    const index = this.questions.findIndex(e => e.question._id === q.question._id)
    if(index == -1) return;
    this.questions[index].response = `${answer}`;
  }

}
