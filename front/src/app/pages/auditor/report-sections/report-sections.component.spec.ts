import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSectionsComponent } from './report-sections.component';

describe('ReportSectionsComponent', () => {
  let component: ReportSectionsComponent;
  let fixture: ComponentFixture<ReportSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSectionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
