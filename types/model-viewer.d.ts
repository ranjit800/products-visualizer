import * as React from "react";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "model-viewer": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    src?: string;
                    alt?: string;
                    ar?: boolean;
                    "ar-modes"?: string;
                    "ar-scale"?: string;
                    "camera-controls"?: boolean;
                    "camera-orbit"?: string;
                    "min-camera-orbit"?: string;
                    "max-camera-orbit"?: string;
                    "field-of-view"?: string;
                    "min-field-of-view"?: string;
                    "max-field-of-view"?: string;
                    "environment-image"?: string;
                    exposure?: string | number;
                    "shadow-intensity"?: string | number;
                    "shadow-softness"?: string | number;
                    autoplay?: boolean;
                    "auto-rotate"?: boolean;
                    "auto-rotate-delay"?: number;
                    loading?: "auto" | "lazy" | "eager";
                    poster?: string;
                    reveal?: "auto" | "interaction" | "manual";
                    "touch-action"?: string;
                },
                HTMLElement
            >;
        }
    }
}
