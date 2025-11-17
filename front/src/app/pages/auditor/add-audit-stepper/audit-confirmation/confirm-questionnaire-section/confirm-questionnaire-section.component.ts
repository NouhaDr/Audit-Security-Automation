import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-confirm-questionnaire-section',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './confirm-questionnaire-section.component.html',
  styleUrl: './confirm-questionnaire-section.component.scss'
})
export class ConfirmQuestionnaireSectionComponent {

  @Input() questionnaire : any[] | null = null;

}
