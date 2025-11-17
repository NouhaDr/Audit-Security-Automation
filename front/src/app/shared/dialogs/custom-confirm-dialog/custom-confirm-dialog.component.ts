import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-custom-confirm-dialog',
  standalone : true,
  imports : [
    ConfirmDialogModule
  ],
  templateUrl: './custom-confirm-dialog.component.html',
  styleUrl: './custom-confirm-dialog.component.scss'
})
export class CustomConfirmDialogComponent {

  @Input() key ;

  @Output() onAccept: EventEmitter<void> = new EventEmitter();
  @Output() onReject: EventEmitter<void> = new EventEmitter();

  constructor(private confirmationService: ConfirmationService) {}

  show() {
    this.confirmationService.confirm({
      accept: () => {
        this.onAccept.emit();
      },
      reject: () => {
        this.onReject.emit();
      },
      key: this.key,
    });
  }

}
