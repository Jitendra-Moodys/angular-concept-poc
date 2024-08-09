import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, map, of } from 'rxjs';
interface Option {
  label: string;
  value: string;
}
@Component({
  selector: 'cl-about',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatFormFieldModule,
    AsyncPipe,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './cl-about.component.html',
  styleUrl: './cl-about.component.scss'
})
export class ClAboutComponent implements OnInit {
  @ViewChild('input', { read: ElementRef }) private input!: ElementRef;

  inputValue = '';
  lastSelectedValue = '';
  options: Option[] = [
    { label: '1', value: 'one' },
    { label: '2', value: 'two' }
  ];
  filteredOptions!: Observable<Option[]>;

  ngOnInit() {
    this.filteredOptions = of(this.options);
    this.filterOptions();
  }
  filterOptions() {
    const filterValue = this.inputValue.toLowerCase();
    this.filteredOptions = of(this.options).pipe(
      map((options) => options.filter((option) => option.label.toLowerCase().includes(filterValue)))
    );
  }

  trackByFn(index: number): number {
    return index; // or item.id if your items have unique ids
  }
  optionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedOption = this.options.find((option) => option.value === event.option.value);
    if (selectedOption) {
      this.inputValue = selectedOption.label;
      const inputElement = this.input.nativeElement as HTMLInputElement;
      inputElement.value = this.inputValue;

      this.lastSelectedValue = selectedOption.value;
    }
  }
  onInputChange(event: Event) {
    const value = event.target as HTMLInputElement;
    if (value.value !== this.lastSelectedValue) {
      this.inputValue = value.value;
      this.filterOptions();
    }
  }
  onAutocompleteClosed() {
    console.log(this.inputValue);
    // Perform any action when autocomplete is closed
  }
  private _filter(value: string): Option[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) => option.label.toLowerCase().includes(filterValue));
  }
}
