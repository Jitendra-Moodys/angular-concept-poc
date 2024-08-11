import type { Meta, StoryObj } from '@storybook/angular';
import { ClFieldSelectComponent } from './cl-field-select.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<ClFieldSelectComponent> = {
  component: ClFieldSelectComponent,
  title: 'ClFieldSelectComponent'
};
export default meta;
type Story = StoryObj<ClFieldSelectComponent>;

export const Primary: Story = {
  args: {}
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/cl-field-select works!/gi)).toBeTruthy();
  }
};
