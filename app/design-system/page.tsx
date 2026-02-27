"use client";

import * as React from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Modal,
  Select,
  Slider,
  Toggle,
} from "@/components/ui";

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [toggleOn, setToggleOn] = React.useState(false);
  const [sliderVal, setSliderVal] = React.useState(40);

  return (
    <main className="mx-auto max-w-3xl space-y-12 px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
        🎨 Design System
      </h1>

      {/* BUTTONS */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Button</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* BADGES */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Badge</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      {/* INPUT */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Input</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Name" placeholder="Type something..." />
          <Input label="With hint" placeholder="e.g. john@mail.com" hint="We never share your email." />
          <Input label="With error" placeholder="..." error="This field is required." />
          <Input label="Disabled" placeholder="Can't type here" disabled />
        </div>
      </section>

      {/* SELECT */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Select</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Category"
            placeholder="Pick a category"
            options={[
              { value: "chair", label: "Chair" },
              { value: "lamp", label: "Lamp" },
              { value: "desk", label: "Desk" },
            ]}
          />
          <Select
            label="With error"
            options={[{ value: "a", label: "Option A" }]}
            error="Please select an option."
          />
        </div>
      </section>

      {/* TOGGLE */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Toggle</h2>
        <div className="flex flex-col gap-3">
          <Toggle label="Enable AR Preview" checked={toggleOn} onChange={setToggleOn} />
          <Toggle label="Disabled toggle" checked={true} onChange={() => {}} disabled />
        </div>
        <p className="text-sm text-slate-500">
          Toggle is <strong>{toggleOn ? "ON" : "OFF"}</strong>
        </p>
      </section>

      {/* SLIDER */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Slider</h2>
        <Slider label="Brightness" min={0} max={100} value={sliderVal} onChange={setSliderVal} />
        <Slider label="Disabled" min={0} max={100} value={30} onChange={() => {}} disabled />
      </section>

      {/* CARD */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Card</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Name</CardTitle>
              <CardDescription>A short description of this product.</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="success">In Stock</Badge>
            </CardContent>
            <CardFooter>
              <Button size="sm">Configure</Button>
            </CardFooter>
          </Card>
          <Card hoverable>
            <CardHeader>
              <CardTitle>Hoverable Card</CardTitle>
              <CardDescription>Hover me to see the shadow effect.</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="info">New</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* MODAL */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Modal</h2>
        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Save Configuration"
          description="Your product setup will be saved and shareable via link."
        >
          <div className="space-y-4">
            <Input label="Configuration name" placeholder="e.g. My Chair Build" />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setModalOpen(false)}>Save</Button>
            </div>
          </div>
        </Modal>
      </section>
    </main>
  );
}
