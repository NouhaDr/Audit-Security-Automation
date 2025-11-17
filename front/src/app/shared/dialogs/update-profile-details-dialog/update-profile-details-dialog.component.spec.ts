import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileDetailsDialogComponent } from './update-profile-details-dialog.component';

describe('UpdateProfileDetailsDialogComponent', () => {
  let component: UpdateProfileDetailsDialogComponent;
  let fixture: ComponentFixture<UpdateProfileDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProfileDetailsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateProfileDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
