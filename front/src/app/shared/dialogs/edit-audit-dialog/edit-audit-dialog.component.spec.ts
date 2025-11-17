import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAuditDialogComponent } from './edit-audit-dialog.component';

describe('EditAuditDialogComponent', () => {
  let component: EditAuditDialogComponent;
  let fixture: ComponentFixture<EditAuditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAuditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAuditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
