import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Field,
  QueryExpression,
  ExpressionChangeEvent,
  ClExpressionBuilderComponent
} from '@jitu-ui/jb-express-builder';
import { sampleFields, sampleData } from './sample-data';

@Component({
  selector: 'app-query-builder',
  standalone: true,
  imports: [CommonModule, ClExpressionBuilderComponent],
  templateUrl: './query-builder.component.html',
  styleUrl: './query-builder.component.scss'
})
export class QueryBuilderComponent {
  fields: Field[] = sampleFields;
  data!: QueryExpression;

  valid!: boolean;
  expression!: QueryExpression;

  feed(): void {
    this.data = { ...(sampleData as QueryExpression) };
  }

  change(e: ExpressionChangeEvent) {
    setTimeout(() => {
      this.valid = e.valid;
      this.expression = e.expression;
    }, 0);
  }
}
