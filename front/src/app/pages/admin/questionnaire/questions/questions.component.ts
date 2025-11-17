import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { QuestionService } from 'src/app/services/question.service';
import { AddQuestionDialogComponent } from 'src/app/shared/dialogs/add-question-dialog/add-question-dialog.component';
import { CustomConfirmDialogComponent } from 'src/app/shared/dialogs/custom-confirm-dialog/custom-confirm-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [
   SharedModule,
   AddQuestionDialogComponent,
   CustomConfirmDialogComponent
  ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss'
})
export class QuestionsComponent {
  imagesUrl = environment.userImagesUrl;
  questions: any[] = [];
  filteredQuestions: any[] = [];

  questionDeleteLoading  : string | null = null;

  dialogVisible = false;

  selectedQuestion : any | null = null;

  selectedUser : any | null = null;

  editDialogVisible = false;
  
  loading: boolean = true;

  constructor(
      private _questionnaire : QuestionService,
      private _message : MessageService
  ) { }

  ngOnInit() {
      this.getQuestions();
  }

  getQuestions(){
      this.loading = true;
      this._questionnaire.findAll()
      .subscribe(
          (res : any) => {
              this.loading = false;
              this.questions = res.data; 
              this.filteredQuestions = res.data; 
          }
      )
  }

  showDetails(audit : any){
      this.selectedQuestion = audit;
  }

  handleQuestionCreate(){
    this.editDialogVisible = true;
    this.selectedQuestion = null;
  }

  handleQuestionDelete(){
      this._questionnaire.delete(this.questionDeleteLoading).subscribe(
          {
              next : (res : any)=> {
                  this.questions = this.questions.filter(a => a._id != res.data._id)
                  this.filteredQuestions = this.questions;
                  this.clearLoading();
                  this._message.add({ severity : 'success', summary : res.message })
              },
              error : (err)=> this.clearLoading()
          }
      )
  }

  clearLoading(){
      this.questionDeleteLoading = null;
  }

  handleSearch(e : any){
      this.filteredQuestions = this.questions.filter(u => u.question.toLowerCase().includes(e.target.value.toLowerCase()))
  }

  handleQuestionUpdate(event : any){
    this.filteredQuestions = [];
    if(event.type === 'update'){
        const index = this.questions.findIndex(u => u._id === event.data._id);
        this.questions[index] = event.data;
    } else{
        this.questions = [...this.questions, event.data];
    }
    this.filteredQuestions = this.questions;
    this.editDialogVisible = false;
    this.selectedQuestion = null;
}
}
