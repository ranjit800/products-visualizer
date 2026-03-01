import type { Preview } from "@storybook/nextjs-vite";
import * as React from "react";
import { I18nProvider } from "../components/i18n/I18nProvider";
import "../app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
  decorators: [
    (Story) =>
      React.createElement(
        I18nProvider,
        null,
        React.createElement(
          "div",
          { style: { padding: "3rem", display: "flex", justifyContent: "center" } },
          React.createElement(Story)
        )
      ),
  ],
};

export default preview;
