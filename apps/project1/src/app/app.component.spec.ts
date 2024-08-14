import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
   
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
   
  });

  it(`should have as title 'project1'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('project1');
  });
});
