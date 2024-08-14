import type { Meta, StoryObj } from '@storybook/angular';
import { ClLogicalOperatorComponent } from './cl-logical-operator.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<ClLogicalOperatorComponent> = {
  component: ClLogicalOperatorComponent,
  title: 'ClLogicalOperatorComponent'
};
export default meta;
type Story = StoryObj<ClLogicalOperatorComponent>;

export const Primary: Story = {
  args: {
    hideRemove: false
  }
};

export const Heading: Story = {
  args: {
    hideRemove: false
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/cl-logical-operator works!/gi)).toBeTruthy();
  }
};
