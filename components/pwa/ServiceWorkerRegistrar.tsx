"use client";

import * as React from "react";

/** Registers the service worker on mount (client-only). */
export function ServiceWorkerRegistrar() {
  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.info("[SW] Registered:", reg.scope);
        })
        .catch((err) => {
          console.warn("[SW] Registration failed:", err);
        });
    }
  }, []);

  return null; // renders nothing
}
