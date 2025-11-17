import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAuditsLeadComponent } from './my-audits-lead.component';

describe('MyAuditsLeadComponent', () => {
  let component: MyAuditsLeadComponent;
  let fixture: ComponentFixture<MyAuditsLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAuditsLeadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyAuditsLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
