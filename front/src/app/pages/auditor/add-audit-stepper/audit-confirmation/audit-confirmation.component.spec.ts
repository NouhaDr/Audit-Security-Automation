import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditConfirmationComponent } from './audit-confirmation.component';

describe('AuditConfirmationComponent', () => {
  let component: AuditConfirmationComponent;
  let fixture: ComponentFixture<AuditConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
