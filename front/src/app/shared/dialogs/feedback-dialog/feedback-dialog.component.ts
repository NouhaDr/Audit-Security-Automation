import { Component,Input,Output,EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog'; 
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-feedback-dialog',
  standalone : true,
  imports : [DialogModule,FormsModule,ButtonModule],
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss']
})
export class FeedbackDialogComponent {
  @Input() visible: boolean = false;
  @Input() feedbackText: string = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() feedbackSubmitted = new EventEmitter<string>();

  submit() {
    this.feedbackSubmitted.emit(this.feedbackText);
    this.close();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}