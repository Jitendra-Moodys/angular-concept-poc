import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibsComponent } from './libs.component';

describe('LibsComponent', () => {
  let component: LibsComponent;
  let fixture: ComponentFixture<LibsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LibsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
