import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionsLeadComponent } from './sections-lead.component';

describe('SectionsLeadComponent', () => {
  let component: SectionsLeadComponent;
  let fixture: ComponentFixture<SectionsLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionsLeadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SectionsLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
