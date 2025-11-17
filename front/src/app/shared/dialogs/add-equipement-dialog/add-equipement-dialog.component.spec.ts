import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEquipementDialogComponent } from './add-equipement-dialog.component';

describe('AddEquipementDialogComponent', () => {
  let component: AddEquipementDialogComponent;
  let fixture: ComponentFixture<AddEquipementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEquipementDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEquipementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
