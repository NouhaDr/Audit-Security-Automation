import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfosDialogComponent } from './user-infos-dialog.component';

describe('UserInfosDialogComponent', () => {
  let component: UserInfosDialogComponent;
  let fixture: ComponentFixture<UserInfosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInfosDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserInfosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
