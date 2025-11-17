import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { QuestionService } from 'src/app/services/question.service';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-add-question-category-dialog',
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: './add-question-category-dialog.component.html',
  styleUrl: './add-question-category-dialog.component.scss'
})
export class AddQuestionCategoryDialogComponent {
  @Input() selectedCategory: any | null = null;
  @Output() callback: any = new EventEmitter();
  @Input() editDialogVisible = false;
  @Output() dismiss = new EventEmitter();

  imagesUrl = environment.userImagesUrl;
  submitted = false;
  dialogHeader = 'Create new category';

  createCategoryForm: FormGroup;
  subcategoryInput = '';
  subcategories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private _message: MessageService,
    private _question: QuestionService
  ) {}

  ngOnInit(): void {
    this.createCategoryForm = this.fb.group({
      label: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCategory'] && this.selectedCategory) {
      this.dialogHeader = 'Edit Category';
      this.createCategoryForm.patchValue({
        label: this.selectedCategory.label,
      });
      this.subcategories = [...(this.selectedCategory.subcategories || [])];
    } else if (!this.selectedCategory) {
      this.dialogHeader = 'Create new category';
      this.subcategories = [];
    }
  }

  addSubcategory() {
    const value = this.subcategoryInput.trim();
    if (value && !this.subcategories.includes(value)) {
      this.subcategories.push(value);
    }
    this.subcategoryInput = '';
  }

  removeSubcategory(sc: string) {
    this.subcategories = this.subcategories.filter(s => s !== sc);
  }

  handleAdd() {
    if (!this.createCategoryForm.valid) {
      this._message.add({ severity: 'error', summary: 'Please fill all fields' });
      return;
    }

    const payload = {
      ...this.createCategoryForm.value,
      subcategories: this.subcategories
    };

    this.submitted = true;

    if (this.selectedCategory) {
      this.updateCategory(payload);
    } else {
      this.createCategory(payload);
    }
  }

  createCategory(payload: any) {
    this._question.createCategory(payload).subscribe({
      next: (res: any) => {
        this._message.add({ severity: 'success', summary: res.message });
        this.submitted = false;
        this.callback.emit({ type: 'add', data: res.data });
        this.resetForm();
      },
      error: (err: any) => {
        this.submitted = false;
        this._message.add({ severity: 'error', summary: err.message });
      },
    });
  }

  updateCategory(payload: any) {
    this._question.updateCategory(this.selectedCategory._id, payload).subscribe({
      next: (res: any) => {
        this._message.add({ severity: 'success', summary: res.message });
        this.submitted = false;
        this.callback.emit({ type: 'update', data: res.data });
        this.resetForm();
      },
      error: (err: any) => {
        this.submitted = false;
        this._message.add({ severity: 'error', summary: err.message });
      },
    });
  }

  onDismiss() {
    this.resetForm();
    this.dismiss.emit(false);
  }

  resetForm() {
    this.createCategoryForm.reset();
    this.subcategoryInput = '';
    this.subcategories = [];
    this.selectedCategory = null;
  }
}
