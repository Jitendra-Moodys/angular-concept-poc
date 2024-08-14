import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Add this import

import { ClLayoutComponent } from './cl-layout.component';

describe('ClLayoutComponent', () => {
  let component: ClLayoutComponent;
  let fixture: ComponentFixture<ClLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, ClLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
