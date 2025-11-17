import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSectionDialogComponent } from './edit-section-dialog.component';

describe('EditSectionDialogComponent', () => {
  let component: EditSectionDialogComponent;
  let fixture: ComponentFixture<EditSectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSectionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
