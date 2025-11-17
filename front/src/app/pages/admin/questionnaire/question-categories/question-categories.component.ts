import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { QuestionService } from 'src/app/services/question.service';
import { AddQuestionCategoryDialogComponent } from 'src/app/shared/dialogs/add-question-category-dialog/add-question-category-dialog.component';
import { CustomConfirmDialogComponent } from 'src/app/shared/dialogs/custom-confirm-dialog/custom-confirm-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-question-categories',
  standalone: true,
  imports: [
    SharedModule,
    AddQuestionCategoryDialogComponent,
    CustomConfirmDialogComponent
  ],
  templateUrl: './question-categories.component.html',
  styleUrl: './question-categories.component.scss'
})
export class QuestionCategoriesComponent {
  imagesUrl = environment.userImagesUrl;
  categories: any[] = [];
  filteredCategories: any[] = [];

  selectedCategory : any | null = null;
  
  categoryDeleteLoading : any | null = null;
  
  editDialogVisible = false;
  
  loading: boolean = true;

  constructor(
      private _questionnaire : QuestionService,
      private _message : MessageService
  ) { }

  ngOnInit() {
      this.getCategories();
  }

  getCategories(){
      this.loading = true;
      this._questionnaire.getCategories()
      .subscribe(
          (res : any) => {
              this.loading = false;
              this.categories = res.data; 
              this.filteredCategories = res.data; 
          }
      )
  }

  showDetails(c : any){
      this.selectedCategory = c;
  }

  handleCategoryDelete(){
      this._questionnaire.deleteCategory(this.categoryDeleteLoading).subscribe(
          {
              next : (res : any)=> {
                  this.categories = this.categories.filter(a => a._id != res.data)
                  this.filteredCategories = this.categories;
                  this.clearLoading();
                  this._message.add({ severity : 'success', summary : res.message })
              },
              error : (err)=> this.clearLoading()
          }
      )
  }

  clearLoading(){
      this.categoryDeleteLoading = null;
  }

  handleSearch(e : any){
      this.filteredCategories = this.categories.filter(u => u.label.toLowerCase().includes(e.target.value.toLowerCase()))
  }

  handleCallback(event : any){
    this.filteredCategories = [];
    if(event.type === 'update'){
        const index = this.categories.findIndex(u => u._id === event.data._id);
        this.categories[index] = event.data;
        this.filteredCategories = this.categories;
    }else{
        this.categories.push(event.data);
        this.filteredCategories = this.categories;
    }
    this.editDialogVisible = !this.editDialogVisible;
  }

  selectCategoryToDelete(c : any){
    this.categoryDeleteLoading = c
  }
}
