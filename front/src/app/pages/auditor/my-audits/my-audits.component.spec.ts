import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAuditsComponent } from './my-audits.component';

describe('MyAuditsComponent', () => {
  let component: MyAuditsComponent;
  let fixture: ComponentFixture<MyAuditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAuditsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyAuditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
