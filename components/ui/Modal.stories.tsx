/* eslint-disable storybook/no-renderer-packages */
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import * as React from "react";

const meta: Meta<typeof Modal> = {
  title: "UI/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(args.open);
    
    // Sync internal state with storybook control
    React.useEffect(() => {
      setIsOpen(args.open);
    }, [args.open]);

    return (
      <div className="flex h-[400px] items-center justify-center">
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal 
          {...args} 
          open={isOpen} 
          onClose={() => setIsOpen(false)}
          title="Custom Configuration"
          description="Are you sure you want to save this configuration?"
        >
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your custom chair with the current material and accessories will be saved to your profile.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsOpen(false)}>Confirm Save</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};
