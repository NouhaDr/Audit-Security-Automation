import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmContactSectionComponent } from './confirm-contact-section.component';

describe('ConfirmContactSectionComponent', () => {
  let component: ConfirmContactSectionComponent;
  let fixture: ComponentFixture<ConfirmContactSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmContactSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmContactSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
