import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibLayoutComponent } from '@jitu-ui/libs';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [CommonModule, LibLayoutComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export class ContainerComponent {}
