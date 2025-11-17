import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmFilesSectionComponent } from './confirm-files-section.component';

describe('ConfirmFilesSectionComponent', () => {
  let component: ConfirmFilesSectionComponent;
  let fixture: ComponentFixture<ConfirmFilesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmFilesSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmFilesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
