import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-confirm-files-section',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './confirm-files-section.component.html',
  styleUrl: './confirm-files-section.component.scss'
})
export class ConfirmFilesSectionComponent{

  @Input() files = [];

  constructor(){}

}
