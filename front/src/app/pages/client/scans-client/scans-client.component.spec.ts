import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScansClientComponent } from './scans-client.component';

describe('ScansClientComponent', () => {
  let component: ScansClientComponent;
  let fixture: ComponentFixture<ScansClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScansClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScansClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
