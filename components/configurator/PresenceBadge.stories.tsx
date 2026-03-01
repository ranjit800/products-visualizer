/* eslint-disable storybook/no-renderer-packages */
import type { Meta, StoryObj } from "@storybook/react";
import { PresenceBadge } from "./PresenceBadge";

const meta: Meta<typeof PresenceBadge> = {
  title: "Configurator/PresenceBadge",
  component: PresenceBadge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PresenceBadge>;

export const Default: Story = {};
