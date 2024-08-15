import { Component, OnInit } from '@angular/core';
import { AsyncPipe, JsonPipe, NgTemplateOutlet } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
  FormArray,
  FormGroup,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet,
    AsyncPipe,
    JsonPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  form!: UntypedFormGroup;

  invalid = false;
  valid = true;

  private destroy$$ = new Subject<boolean>();
  constructor(private fb: UntypedFormBuilder) {
    this.form = this.fb.group({
      operator: ['AND'],
      rules: this.fb.array([])
    });
  }
  get rules() {
    return this.form.get('rules') as FormArray;
  }
  ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$$)).subscribe(() => {
      this.invalid = this.form.invalid;
      this.valid = this.form.valid;
    });

    this.subscribeToRuleChanges();
  }

  createCondition(): FormGroup {
    return this.fb.group({
      fieldName: ['', [(control: AbstractControl) => Validators.required(control)]],
      operator: ['=', [(control: AbstractControl) => Validators.required(control)]],
      value: ['', [(control: AbstractControl) => Validators.required(control)]]
    });
  }

  createGroup(): FormGroup {
    return this.fb.group({
      operator: ['AND', [(control: AbstractControl) => Validators.required(control)]],
      rules: this.fb.array([])
    });
  }

  addCondition(host: UntypedFormGroup): void {
    const rules = this.getRulesFormArray(host);
    rules.push(this.createCondition());
    this.subscribeToRuleChanges();
  }

  addGroup(host: UntypedFormGroup) {
    const rules = this.getRulesFormArray(host);
    rules.push(this.createGroup());
    this.subscribeToRuleChanges();
  }

  removeItem(index: number, parent: UntypedFormGroup): void {
    (parent.get('rules') as UntypedFormArray).removeAt(index);
  }

  extractRules(formGroup: UntypedFormGroup): UntypedFormArray {
    return formGroup.get('rules') as UntypedFormArray;
  }

  isCondition(rule: AbstractControl): boolean {
    return rule.get('fieldName') !== null;
  }

  isGroup(rule: AbstractControl): boolean {
    return rule.get('rules') !== null;
  }
  submit() {
    console.log(this.form.value);
  }
  private getRulesFormArray(host: UntypedFormGroup): UntypedFormArray {
    const rules = host.get('rules');
    if (!rules || !(rules instanceof UntypedFormArray)) {
      throw new Error('rules is not an instance of FormArray');
    }
    return rules;
  }

  private subscribeToRuleChanges() {
    this.rules.controls.forEach((ruleGroup: AbstractControl) => {
      ruleGroup
        .get('fieldName')
        ?.valueChanges.pipe(takeUntil(this.destroy$$))
        .subscribe((value) => {
          console.log('fieldName changed:', value);
        });

      ruleGroup
        .get('operator')
        ?.valueChanges.pipe(takeUntil(this.destroy$$))
        .subscribe((value) => {
          console.log('operator changed:', value);
        });

      ruleGroup
        .get('value')
        ?.valueChanges.pipe(takeUntil(this.destroy$$))
        .subscribe((value) => {
          console.log('value changed:', value);
        });
    });
  }
}
