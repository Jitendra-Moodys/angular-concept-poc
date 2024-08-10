import {
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  ValidatorFn,
  AbstractControl,
  ReactiveFormsModule
} from '@angular/forms';

import { provideNativeDateAdapter } from '@angular/material/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MaterialModule } from '@jitu-ui/shared';
import {
  Field,
  OptionValue,
  FieldTypeOperators,
  ConditionOperator,
  FieldType,
  LookupService,
  LookupValidatorError,
  Person
} from '../../interfaces/cl-express-builder.inteface';
import { ClExpressionService } from '../../services/cl-expression.service';
import { ClFieldSelectComponent } from '../cl-field-select/cl-field-select.component';

@Component({
  selector: 'lib-condition',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, ClFieldSelectComponent, MaterialModule, AsyncPipe],
  templateUrl: './cl-condition.component.html',
  styleUrl: './cl-condition.component.scss'
})
export class ClConditionComponent implements OnInit, OnDestroy {
  @Input() allFields!: Field[];
  @Input() formGroup!: UntypedFormGroup;

  @Output() remove: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('input', { read: ElementRef }) private input!: ElementRef;
  operators: OptionValue[] = [];
  inputValue = '';
  fieldSubs!: Subscription;
  valueSubs!: Subscription;
  conditionSubs!: Subscription;
  lookupService: LookupService | null = null;
  fielteredOptions = new BehaviorSubject<Field[]>([]);
  constructor(
    private expService: ClExpressionService,
    private injector: Injector
  ) {
    this.lookupDisplay = this.lookupDisplay.bind(this);
  }
  get field(): UntypedFormControl {
    return this.formGroup.get('fieldName') as UntypedFormControl;
  }

  get fieldName(): string {
    return this.field.value as string;
  }

  get fieldOptions(): Field {
    return this.expService.fields.value(this.fieldName);
  }

  get typeOptions(): FieldTypeOperators | null {
    if (this.fieldOptions) {
      return this.expService.typeOptions(this.fieldOptions.type);
    }
    return null;
  }

  get condition(): UntypedFormControl {
    return this.formGroup.get('condition') as UntypedFormControl;
  }

  get value(): UntypedFormControl {
    return this.formGroup.get('value') as UntypedFormControl;
  }

  ngOnInit() {
    this.fielteredOptions.next(this.allFields);

    this.fieldSubs = this.field.valueChanges.subscribe((value: string) => this.fieldChange(value));

    this.valueSubs = this.value.valueChanges.subscribe((value) =>
      this.valueChange(value as string | Record<string, string | number>)
    );

    this.conditionSubs = this.condition.valueChanges.subscribe((value: string) => this.conditionChange(value));

    if (this.fieldOptions) {
      this.operatorFilter(this.fieldOptions);
    }

    if (((this.field && !this.field.value) || this.field.invalid) && this.value) {
      this.value.disable();
    }

    this.initLookup();
  }

  ngOnDestroy() {
    if (this.fieldSubs) this.fieldSubs.unsubscribe();
    if (this.valueSubs) this.valueSubs.unsubscribe();
    if (this.conditionSubs) this.conditionSubs.unsubscribe();
  }
  filterOptions(contains: string): void {
    if (contains) {
      const values = this.allFields.filter((item) => item.label.toLowerCase().includes(contains.toLowerCase()));
      this.fielteredOptions.next(values);
    } else {
      this.fielteredOptions.next(this.allFields);
    }
  }
  optionSelected(e: string): void {
    const selectedValue = e;
    this.setFromName(selectedValue);
    //this.fieldSelected.emit(selectedValue);
  }
  setFromName(fieldName: string): void {
    const option = this.expService.fieldOptions(fieldName);
    if (option) {
      this.inputValue = option.label;
      const inputElement = this.input.nativeElement as HTMLInputElement;
      inputElement.value = this.inputValue;
    }
  }
  blur(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    this.filterOptions(inputElement.value);
  }
  clear(): void {
    this.filterOptions('');
    this.field.setValue('');
  }

  clearLookup(): void {
    if (this.value) {
      this.value.setValue('');
    }

    if (this.lookupService) {
      this.lookupService.search('');
    }
  }

  conditionChange(condition: string): void {
    if (condition === ConditionOperator.NotNull.toString() || condition === ConditionOperator.Null.toString()) {
      this.value.setValue('');
      this.value.disable();
    } else {
      this.value.enable();
    }
  }

  fieldChange(fieldName: string): void {
    const field = this.expService.fieldOptions(fieldName);
    this.optionSelected(fieldName);
    this.filterOptions(fieldName);
    this.condition.setValue('');
    this.value.setValue('');
    if (fieldName && !field) {
      const inputElement = this.input.nativeElement as HTMLInputElement;
      const temporaryValue = Object.assign({}, inputElement.value);
      this.field.setValue('', { emitEvent: false });
      inputElement.value = temporaryValue;
    }
    if (field) {
      const validators = this.expService.validadorsByType(field.type);
      if (field.type === FieldType.Lookup && field.lookup) {
        validators.push(this.lookupValidator(field.lookup.textField, field.lookup.valueField));
      }
      this.value.setValidators(validators);
    } else {
      this.value.setValidators(null);
    }

    if (this.field.value && this.field.valid) {
      this.value.enable();
    } else {
      this.value.setValue(null);
      this.value.disable();
    }

    if (field) {
      // Check if field is not null before calling operatorFilter
      this.initLookup();
      this.operatorFilter(field);
    }
  }

  initLookup(): void {
    if (this.fieldOptions && this.fieldOptions.lookup && this.fieldOptions.lookup.service) {
      this.lookupService = this.injector.get(this.fieldOptions.lookup.service);
      this.lookupService.search('');
    } else {
      this.lookupService = null;
    }
  }

  lookupDisplay(value: Record<string, string | number>): string {
    let label: string | undefined; // Initialize label as undefined

    if (this.fieldOptions && this.fieldOptions.lookup) {
      label = value[this.fieldOptions.lookup.textField] as string;
    }
    return label || '';
  }

  operatorFilter(fieldOptions: Field): void {
    this.operators = [];

    if (fieldOptions) {
      this.operators =
        fieldOptions.values && fieldOptions.values.length > 0
          ? this.expService.optionSetOperators()
          : this.expService.operatorsByType(fieldOptions.type);
    }

    if (this.operators.length > 0) {
      this.condition.enable();
    } else {
      this.condition.disable();
    }
  }

  lookupValidator(textField: string, valueField: string): ValidatorFn {
    return (control: AbstractControl): LookupValidatorError | null => {
      const value = control.value as string | Record<string, string | number>;

      if (
        value &&
        (typeof value === 'string' ||
          !Object.prototype.hasOwnProperty.call(value, textField) ||
          !Object.prototype.hasOwnProperty.call(value, valueField))
      ) {
        return {
          LookupInvalidOption: {
            value: control.value as string | Record<string, string | number>
          }
        };
      }

      return null;
    };
  }

  operatorDisplayFn(operator: ConditionOperator): string {
    let name: string = '';
    const result = this.operators.filter((item) => item.value === operator.toString());

    if (result && result.length > 0) {
      name = result[0].label;
    }

    return name;
  }

  valueChange(value: string | Record<string, string | number>): void {
    let filter: string = '';

    if (typeof value === 'string') {
      filter = value;
    } else if (this.fieldOptions && this.fieldOptions.lookup) {
      filter = value[this.fieldOptions.lookup.textField] as string;
    }

    if (this.lookupService) {
      this.lookupService.search(filter);
    }
  }

  removeCondition(): void {
    this.remove.emit();
  }

  valueControl(): string {
    let name: string = 'text';

    if (this.fieldOptions) {
      if (this.fieldOptions.values && this.fieldOptions.values.length > 0) {
        name = 'options';
      } else if (this.fieldOptions.type && this.fieldOptions.type === FieldType.Lookup) {
        name = 'lookup';
      } else {
        name = this.fieldOptions.type;
      }
    }

    return name;
  }
  trackByFn(index: number): number {
    return index;
  }
  getOptionValue(option: Person, field: string): string {
    return option[field as keyof Person] as string;
  }
}
