import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@jitu-ui/shared';

@Component({
  selector: 'lib-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './lib-layout.component.html',
  styleUrl: './lib-layout.component.scss',
})
export class LibLayoutComponent {
  currentYear: number = new Date().getFullYear();
  isExpanded = true;

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
  }
}
