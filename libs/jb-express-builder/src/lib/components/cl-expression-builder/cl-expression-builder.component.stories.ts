import type { Meta, StoryObj } from '@storybook/angular';
import { ClExpressionBuilderComponent } from './cl-expression-builder.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<ClExpressionBuilderComponent> = {
  component: ClExpressionBuilderComponent,
  title: 'ClExpressionBuilderComponent'
};
export default meta;
type Story = StoryObj<ClExpressionBuilderComponent>;

export const Primary: Story = {
  args: {
    fields: []
  }
};

export const Heading: Story = {
  args: {
    fields: []
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/cl-expression-builder works!/gi)).toBeTruthy();
  }
};
