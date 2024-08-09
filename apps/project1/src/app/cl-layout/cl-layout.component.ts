import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LibLayoutComponent } from '@jitu-ui/libs';



@Component({
  selector: 'cl-cl-layout',
  standalone: true,
  imports: [RouterOutlet, LibLayoutComponent],
  templateUrl: './cl-layout.component.html',
  styleUrl: './cl-layout.component.scss'
})
export class ClLayoutComponent {}
