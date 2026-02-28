"use client";
import * as React from "react";

// ── Live Presence Badge (simulated) ──────────────────────────────────────────
export function PresenceBadge() {
  const [count, setCount] = React.useState(() => Math.floor(Math.random() * 7) + 2);
  React.useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => Math.max(1, c + (Math.random() > 0.5 ? 1 : -1)));
    }, 12000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 12px", borderRadius: 20,
      backgroundColor: "rgba(16,185,129,0.12)",
      border: "1px solid rgba(16,185,129,0.3)",
      fontSize: 12, fontWeight: 600, color: "#059669",
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%",
        backgroundColor: "#10b981",
        boxShadow: "0 0 0 2px rgba(16,185,129,0.3)",
        animation: "pulse 2s infinite",
        display: "inline-block",
      }} />
      {count} people viewing this right now
    </div>
  );
}
