import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserImageUploadDialogComponent } from './user-image-upload-dialog.component';

describe('UserImageUploadDialogComponent', () => {
  let component: UserImageUploadDialogComponent;
  let fixture: ComponentFixture<UserImageUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserImageUploadDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserImageUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
