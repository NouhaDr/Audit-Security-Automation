import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-confirm-infrastructure-section',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './confirm-infrastructure-section.component.html',
  styleUrl: './confirm-infrastructure-section.component.scss'
})
export class ConfirmInfrastructureSectionComponent {

  @Input() infrastructure : any[] | null = null; 
}
