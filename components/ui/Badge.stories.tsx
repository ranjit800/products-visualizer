/* eslint-disable storybook/no-renderer-packages */
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "danger", "info"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Default Badge",
    variant: "default",
  },
};

export const Success: Story = {
  args: {
    children: "Success Badge",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "Warning Badge",
    variant: "warning",
  },
};

export const Danger: Story = {
  args: {
    children: "Danger Badge",
    variant: "danger",
  },
};

export const Info: Story = {
  args: {
    children: "Info Badge",
    variant: "info",
  },
};
