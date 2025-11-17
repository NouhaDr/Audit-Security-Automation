import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEquipementAdminComponent } from './add-equipement-admin.component';

describe('AddAuditComponent', () => {
  let component: AddEquipementAdminComponent;
  let fixture: ComponentFixture<AddEquipementAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEquipementAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEquipementAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});