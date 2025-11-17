import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLeadHomeComponent } from './audit-lead-home.component';

describe('AuditLeadHomeComponent', () => {
  let component: AuditLeadHomeComponent;
  let fixture: ComponentFixture<AuditLeadHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditLeadHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditLeadHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
