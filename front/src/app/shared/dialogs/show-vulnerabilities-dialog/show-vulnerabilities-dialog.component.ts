import { Component, Input ,Output ,EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-show-vulnerabilities-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './show-vulnerabilities-dialog.component.html',
})
export class ShowVulnerabilitiesDialogComponent {
  @Input() visible = false;
  @Input() vulnerabilities: any[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();

  onClose() {
    this.visible = false;
    this.visibleChange.emit(false); // notifie le parent
    
  }
}
