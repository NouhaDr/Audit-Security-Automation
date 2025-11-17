import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmQuestionnaireSectionComponent } from './confirm-questionnaire-section.component';

describe('ConfirmQuestionnaireSectionComponent', () => {
  let component: ConfirmQuestionnaireSectionComponent;
  let fixture: ComponentFixture<ConfirmQuestionnaireSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmQuestionnaireSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmQuestionnaireSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
