import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuditComponent } from './add-audit.component';

describe('AddAuditComponent', () => {
  let component: AddAuditComponent;
  let fixture: ComponentFixture<AddAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAuditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
