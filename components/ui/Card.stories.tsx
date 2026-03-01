/* eslint-disable storybook/no-renderer-packages */
import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardImage } from "./Card";
import * as React from "react";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    hoverable: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="max-w-md">
      <CardImage src="https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop" alt="Demo Chair" />
      <CardHeader>
        <CardTitle>Aurora Chair</CardTitle>
        <CardDescription>A modern minimalist chair for your home office.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Features ergonomic support and high-quality materials for maximum comfort during long work sessions.
        </p>
      </CardContent>
      <CardFooter>
        <span className="text-lg font-bold text-slate-900 dark:text-slate-50">$129.00</span>
      </CardFooter>
    </Card>
  ),
};

export const Hoverable: Story = {
  render: (args) => (
    <Card {...args} hoverable className="max-w-md">
      <CardImage src="https://images.unsplash.com/photo-1567531934887-3291655dd8af?q=80&w=1000&auto=format&fit=crop" alt="Demo Chair" />
      <CardHeader>
        <CardTitle>Ember Lounge</CardTitle>
        <CardDescription>Premium leather lounge chair.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Hand-crafted from top-grain leather with a solid oak frame.
        </p>
      </CardContent>
      <CardFooter>
        <span className="text-lg font-bold text-slate-900 dark:text-slate-50">$349.00</span>
      </CardFooter>
    </Card>
  ),
};
