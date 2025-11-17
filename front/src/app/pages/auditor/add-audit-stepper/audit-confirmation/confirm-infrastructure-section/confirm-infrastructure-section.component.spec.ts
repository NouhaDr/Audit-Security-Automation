import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmInfrastructureSectionComponent } from './confirm-infrastructure-section.component';

describe('ConfirmInfrastructureSectionComponent', () => {
  let component: ConfirmInfrastructureSectionComponent;
  let fixture: ComponentFixture<ConfirmInfrastructureSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmInfrastructureSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmInfrastructureSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
