import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { sampleFields, sampleData } from './sample-data';
import { SampleRemoteService } from './sample.remote.service';
import { ClExpressionBuilderComponent, ExpressionChangeEvent, Field, QueryExpression } from '@jitu-ui/jb-express-builder';

@Component({
  selector: 'cl-express-builder',
  standalone: true,
  imports: [CommonModule, ClExpressionBuilderComponent],
  providers: [SampleRemoteService],
  templateUrl: './cl-express-builder.component.html',
  styleUrl: './cl-express-builder.component.scss'
})
export class ClExpressBuilderComponent {
  fields: Field[] = sampleFields;
  data!: QueryExpression;

  valid!: boolean;
  expression!: QueryExpression;

  feed(): void {
    this.data = sampleData as QueryExpression;
  }

  change(e: ExpressionChangeEvent) {
    this.valid = e.valid;
    this.expression = e.expression;
  }
}
