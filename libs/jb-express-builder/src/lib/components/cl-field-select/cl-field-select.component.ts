import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';

import { BehaviorSubject, Subject, Subscription, debounceTime } from 'rxjs';

import { MaterialModule } from '@jitu-ui/shared';
import { Field } from '../../interfaces/cl-express-builder.inteface';
import { ClExpressionService } from '../../services/cl-expression.service';

@Component({
  selector: 'lib-field-select',
  standalone: true,
  imports: [MaterialModule, AsyncPipe],
  templateUrl: './cl-field-select.component.html',
  styleUrls: ['./cl-field-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClFieldSelectComponent),
      multi: true
    }
  ]
})
export class ClFieldSelectComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() allFields!: Field[];
  @Output() fieldSelected = new EventEmitter<string>();

  @ViewChild(MatAutocompleteTrigger) selectTrigger!: MatAutocompleteTrigger;
  @ViewChild('input', { read: ElementRef }) private input!: ElementRef;

  fielteredOptions = new BehaviorSubject<Field[]>([]);
  inputValueChange = new Subject<string>();
  inputValueSubs!: Subscription;
  inputValue: string | null = null;
  selectedField?: Field;

  constructor(private expService: ClExpressionService) {}

  ngOnInit() {
    this.fielteredOptions.next(this.allFields);

    this.inputValueSubs = this.inputValueChange.pipe(debounceTime(150)).subscribe((data) => {
      this.filterOptions(data);
    });
  }

  ngOnDestroy() {
    if (this.inputValueSubs) this.inputValueSubs.unsubscribe();
    this.fielteredOptions.complete();
    this.inputValueChange.complete();
  }

  filterOptions(contains: string): void {
    if (contains) {
      const values = this.allFields.filter((item) => item.label.toLowerCase().includes(contains.toLowerCase()));
      this.fielteredOptions.next(values);
    } else {
      this.fielteredOptions.next(this.allFields);
    }
  }

  optionSelected(e: MatAutocompleteSelectedEvent): void {
    const selectedValue = e.option.value as string;
    this.setFromName(selectedValue);
    this.fieldSelected.emit(selectedValue);
  }

  setFromName(fieldName: string): void {
    const option = this.expService.fieldOptions(fieldName);
    if (option) {
      this.selectedField = option;
      this.inputValue = option.label;
      const inputElement = this.input.nativeElement as HTMLInputElement;
      inputElement.value = this.inputValue;
      this.onChange(option.name);
    }
  }

  keyup(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.inputValueChange.next(inputElement.value);
  }

  blur(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    this.setFromLabel(inputElement.value);
  }

  setFromLabel(label: string): void {
    const option = this.expService.fieldByLabel(label);
    if (option) {
      this.selectedField = option;
      this.inputValue = option.label;
      this.onChange(option.name);
    }
  }

  clear(): void {
    this.filterOptions('');
    const inputElement = this.input.nativeElement as HTMLInputElement;
    inputElement.value = '';
    this.writeValue('');
    this.onChange('');
  }
  public displayContactFn(contact?: string): string | undefined {
    console.log('displayContactFn', contact);
    return '';
  }
  /* ControlValueAccessor implementation */

  writeValue(value: string): void {
    const field = this.expService.fieldOptions(value);
    if (field) {
      this.selectedField = field;
      this.inputValue = this.selectedField.label;
    } else {
      this.selectedField = undefined;
      this.inputValue = null;
    }
  }

  registerOnChange(function_: (value: string) => void): void {
    this.onChange = function_;
  }

  registerOnTouched(function_: () => void): void {
    this.onTouched = function_;
  }

  setDisabledState?(isDisabled: boolean): void {
    console.log('setDisabledState', isDisabled);
    // Handle the disabled state
  }

  trackByFn(index: number): number {
    return index; // or item.id if your items have unique ids
  }
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
}
