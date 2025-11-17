import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritySectionComponent } from './security-section.component';

describe('SecuritySectionComponent', () => {
  let component: SecuritySectionComponent;
  let fixture: ComponentFixture<SecuritySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuritySectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecuritySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
