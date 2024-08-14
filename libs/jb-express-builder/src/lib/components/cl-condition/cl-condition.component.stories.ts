import type { Meta, StoryObj } from '@storybook/angular';
import { ClConditionComponent } from './cl-condition.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<ClConditionComponent> = {
  component: ClConditionComponent,
  title: 'ClConditionComponent'
};
export default meta;
type Story = StoryObj<ClConditionComponent>;

export const Primary: Story = {
  args: {}
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/cl-condition works!/gi)).toBeTruthy();
  }
};
