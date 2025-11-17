import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDetailsSectionComponent } from './profile-details-section.component';

describe('ProfileDetailsSectionComponent', () => {
  let component: ProfileDetailsSectionComponent;
  let fixture: ComponentFixture<ProfileDetailsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDetailsSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileDetailsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
