import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditInfosDialogComponent } from './audit-infos-dialog.component';

describe('AuditInfosDialogComponent', () => {
  let component: AuditInfosDialogComponent;
  let fixture: ComponentFixture<AuditInfosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditInfosDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditInfosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
