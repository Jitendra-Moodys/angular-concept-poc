import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibLayoutComponent } from './lib-layout.component';

describe('LibLayoutComponent', () => {
  let component: LibLayoutComponent;
  let fixture: ComponentFixture<LibLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LibLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
