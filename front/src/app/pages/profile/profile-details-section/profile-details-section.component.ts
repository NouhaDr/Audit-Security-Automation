import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-profile-details-section',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './profile-details-section.component.html',
  styleUrl: './profile-details-section.component.scss'
})
export class ProfileDetailsSectionComponent {

  @Input() currentUser : any | null = null;

}
