import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAuditProgressDialogComponent } from './change-audit-progress-dialog.component';

describe('ChangeAuditProgressDialogComponent', () => {
  let component: ChangeAuditProgressDialogComponent;
  let fixture: ComponentFixture<ChangeAuditProgressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeAuditProgressDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeAuditProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
