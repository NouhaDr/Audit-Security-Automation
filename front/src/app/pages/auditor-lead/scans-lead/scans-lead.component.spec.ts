import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScansLeadComponent } from './scans-lead.component';

describe('ScansLeadComponent', () => {
  let component: ScansLeadComponent;
  let fixture: ComponentFixture<ScansLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScansLeadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScansLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
