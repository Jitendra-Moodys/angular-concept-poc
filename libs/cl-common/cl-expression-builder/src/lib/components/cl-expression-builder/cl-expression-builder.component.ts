import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import {
  QueryExpression,
  Field,
  ExpressionChangeEvent,
  LogicalOperator
} from '../../interfaces/cl-express-builder.inteface';
import { ClExpressionService } from '../../services/cl-expression.service';
import { ClConditionComponent } from '../cl-condition/cl-condition.component';
import { ClFieldSelectComponent } from '../cl-field-select/cl-field-select.component';
import { ClLogicalOperatorComponent } from '../cl-logical-operator/cl-logical-operator.component';

@Component({
  selector: 'cl-expression-builder',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    AsyncPipe,
    ReactiveFormsModule,
    ClConditionComponent,
    ClFieldSelectComponent,
    ClLogicalOperatorComponent
  ],
  templateUrl: './cl-expression-builder.component.html',
  styleUrl: './cl-expression-builder.component.scss',
  providers: [ClExpressionService]
})
export class ClExpressionBuilderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data!: QueryExpression;
  @Input() fields: Field[] = [];

  @Output() valuechange: EventEmitter<ExpressionChangeEvent> = new EventEmitter<ExpressionChangeEvent>();

  form!: UntypedFormGroup;

  invalid = false;
  valid = true;

  private destroy$$ = new Subject<boolean>();

  constructor(
    private expService: ClExpressionService,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit() {
    this.expService.setFields(this.fields);
    this.initialize();
    this.subscribeToForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.initialize();
      this.subscribeToForm();
      this.emitChanges();
    }
  }

  ngOnDestroy(): void {
    this.destroy$$.next(true);
    this.destroy$$.complete();
  }

  addCondition(host: UntypedFormGroup): void {
    const rules = this.getRulesFormArray(host);
    rules.push(this.expService.createCondition(''));
  }

  addGroup(host: UntypedFormGroup): void {
    const rules = this.getRulesFormArray(host);
    rules.push(this.expService.createGroup(LogicalOperator.And));
  }

  emitChanges(): void {
    this.valuechange.emit({
      valid: this.form.valid,
      expression: this.form.value as QueryExpression
    });
  }

  extractRules(formGroup: UntypedFormGroup): UntypedFormArray {
    return formGroup.get('rules') as UntypedFormArray;
  }

  isCondition(value: AbstractControl): boolean {
    return value.get('fieldName') != undefined;
  }

  isGroup(value: AbstractControl): boolean {
    return value.get('rules') != undefined;
  }

  isFirstCondition(index: number, rules: AbstractControl[]): boolean {
    const firstCondIndex = rules.findIndex((control) => this.isCondition(control));
    return index === firstCondIndex;
  }

  isLastCondition(index: number, rules: AbstractControl[]): boolean {
    const lastCondIndex = [...rules].reverse().findIndex((control) => this.isCondition(control));
    return index === rules.length - 1 - lastCondIndex;
  }

  removeItem(index: number, parent: UntypedFormGroup): void {
    (parent.get('rules') as UntypedFormArray).removeAt(index);
  }

  validateField(control: AbstractControl): boolean {
    const value = (control?.value as string) || '';
    return this.fields.some((field) => field.name === value);
  }

  private subscribeToForm(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$$)).subscribe(() => {
      this.valid = this.form.valid;
      this.invalid = this.form.invalid;
      this.emitChanges();
    });
  }

  private initialize(): void {
    if (this.data && this.expService.validate(this.data)) {
      console.log('Valid expression.');
      this.form = this.expService.toFormGroup(this.data);
    } else {
      if (!this.form) {
        console.log('Unable to validate expression.');
        this.form = this.fb.group({
          operator: [LogicalOperator.And],
          rules: this.fb.array([])
        });
      }
    }
  }

  private getRulesFormArray(host: UntypedFormGroup): UntypedFormArray {
    const rules = host.get('rules');
    if (!rules || !(rules instanceof UntypedFormArray)) {
      throw new Error('rules is not an instance of FormArray');
    }
    return rules;
  }
}
