import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientReportSectionsComponent } from './client-report-sections.component';

describe('ClientReportSectionsComponent', () => {
  let component: ClientReportSectionsComponent;
  let fixture: ComponentFixture<ClientReportSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientReportSectionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientReportSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
