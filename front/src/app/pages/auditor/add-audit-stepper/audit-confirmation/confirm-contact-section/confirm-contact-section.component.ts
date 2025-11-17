import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-confirm-contact-section',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './confirm-contact-section.component.html',
  styleUrl: './confirm-contact-section.component.scss'
})
export class ConfirmContactSectionComponent {

  imagesUrl = environment.userImagesUrl;

  @Input() audit : any | null = null;

}
