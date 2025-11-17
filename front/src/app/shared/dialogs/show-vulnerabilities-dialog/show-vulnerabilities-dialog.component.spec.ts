import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowVulnerabilitiesDialogComponent } from './show-vulnerabilities-dialog.component';

describe('ShowVulnerabilitiesDialogComponent', () => {
  let component: ShowVulnerabilitiesDialogComponent;
  let fixture: ComponentFixture<ShowVulnerabilitiesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowVulnerabilitiesDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowVulnerabilitiesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
