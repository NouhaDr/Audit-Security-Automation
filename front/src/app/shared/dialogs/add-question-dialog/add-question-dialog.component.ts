import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { QuestionService } from 'src/app/services/question.service';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../../shared.module';
import { tap } from 'rxjs';

@Component({
  selector: 'app-add-question-dialog',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './add-question-dialog.component.html',
  styleUrl: './add-question-dialog.component.scss'
})
export class AddQuestionDialogComponent {
  @Input() selectedQuestion : any | null = null;
  @Output() callback : any = new EventEmitter();
  @Input() editDialogVisible = false;
  @Output() dismiss = new EventEmitter();

  imagesUrl = environment.userImagesUrl;
  submitted = false;

  categories: any[] = [];
  subCategories: any[] = [];
  selectedCategory : any | null = null;
  dialogHeader = "";

  constructor(
    private fb : FormBuilder,
    private _message : MessageService,
    private _question : QuestionService,
  ){}

  createQuestionForm : FormGroup; 

  ngOnInit(): void {
    this.fetchCategories();
    this.createQuestionForm =  this.fb.group({
      category : ['', [ Validators.required ]],
      subcategory : [''],
      question : ['', [ Validators.required ]],
    })
    
    this.createQuestionForm.valueChanges.pipe(
      tap(value => {
        if(value){
          this.selectedCategory = this.categories.find(c => c.label === value.category);
          this.subCategories = this.selectedCategory?.subcategories;
        }
      })
    ).subscribe()
  }

  
  fetchCategories(){
    this._question.getCategories().subscribe(
        (res : any) => {
            this.categories = res.data;
        }
    )
  }

  handleUpdate(){
    if(!this.createQuestionForm.valid){
      this._message.add({ severity: 'error', summary : 'Please fill all fields' });
      return;
    }
    this.submitted = true;
    if(this.selectedQuestion){
      this.updateQuestion();
      return;
    }
    this.createQuestion();    
  }

  createQuestion(){
    this._question.create(this.createQuestionForm.value).subscribe(
      {
        next : (res : any)=> {
          this._message.add({ severity: 'success', summary : res.message });
          this.submitted = false;
          this.callback.emit({type : "add", data : res.data});
        },
        error : (err : any)=> {
          this.submitted = false;
          this._message.add({ severity: 'error', summary : err.message });
        },
      }
    )
  }

  updateQuestion(){
    this._question.update(this.selectedQuestion._id,  this.createQuestionForm.value).subscribe(
      {
        next : (res : any)=> {
          this._message.add({ severity: 'success', summary : res.message });
          this.submitted = false;
          this.callback.emit({type :'update' , data : res.data});
        },
        error : (err : any)=> {
          this.submitted = false;
          this._message.add({ severity: 'error', summary : err.message });
        },
      }
    ) 
  }

  onDismiss(){
    // this.createQuestionForm.reset();
    this.dismiss.emit(false);
  }

  ngOnChanges(changes: any) {
    if (changes.selectedQuestion && this.selectedQuestion) {
      this.dialogHeader = "Edit Question";
      this.subCategories = this.categories.find(c => c.label === changes.selectedQuestion.categroy); 
      this.createQuestionForm.patchValue({...this.selectedQuestion});
    }
    if(!changes.selectedQuestion){
      this.dialogHeader = "Add Question";
      this.createQuestionForm.reset();
    }
  }
}
