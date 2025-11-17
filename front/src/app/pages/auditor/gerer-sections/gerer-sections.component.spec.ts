import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GererSectionsComponent } from './gerer-sections.component';

describe('GererSectionsComponent', () => {
  let component: GererSectionsComponent;
  let fixture: ComponentFixture<GererSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GererSectionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GererSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
