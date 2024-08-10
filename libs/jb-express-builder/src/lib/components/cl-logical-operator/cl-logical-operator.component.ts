import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';


import { LogicalOperator } from '../../interfaces/cl-express-builder.inteface';
import { MaterialModule } from '@jitu-ui/shared';

@Component({
  selector: 'lib-logical-operator',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './cl-logical-operator.component.html',
  styleUrl: './cl-logical-operator.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClLogicalOperatorComponent),
      multi: true
    }
  ]
})
export class ClLogicalOperatorComponent implements ControlValueAccessor {
  @Input() hideRemove!: boolean;
  @Output() addGroup: EventEmitter<void> = new EventEmitter<void>();
  @Output() addCondition: EventEmitter<void> = new EventEmitter<void>();
  @Output() remove: EventEmitter<void> = new EventEmitter<void>();

  LogicalOperator = LogicalOperator;
  operator: LogicalOperator = LogicalOperator.And;
  disable!: boolean;

  newCondition(): void {
    this.addCondition.emit();
  }

  newGroup(): void {
    this.addGroup.emit();
  }

  change(e: MatButtonToggleChange): void {
    this.operator = e.value as LogicalOperator;
    this.onChange(this.operator);
  }

  removeGroup(): void {
    this.remove.emit();
  }

  /* ControlValueAccessor implementation */

  writeValue(value: LogicalOperator): void {
    this.operator = value || LogicalOperator.And;
  }

  registerOnChange(function_: (value: LogicalOperator) => void): void {
    this.onChange = function_;
  }

  registerOnTouched(function_: () => void): void {
    this.onTouched = function_;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disable = isDisabled;
  }
  private onChange: (value: LogicalOperator) => void = () => {};
  private onTouched: () => void = () => {};
}
