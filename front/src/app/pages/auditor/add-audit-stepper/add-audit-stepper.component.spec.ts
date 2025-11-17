import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuditStepperComponent } from './add-audit-stepper.component';

describe('AddAuditStepperComponent', () => {
  let component: AddAuditStepperComponent;
  let fixture: ComponentFixture<AddAuditStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAuditStepperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAuditStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
