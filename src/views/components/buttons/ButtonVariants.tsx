import React from "react";
import Button from "./Button";
import Icon from "../icons/Icon"; // lucide icon wrapper (optional)

export default function ButtonVariants() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      {/* typical variants */}
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>

      {/* sizes */}
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="lg">Large</Button>

      {/* ghost / outline */}
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>

      {/* loading */}
      <Button variant="primary" loading>Loading</Button>

      {/* icon-only */}
      {Icon ? (
        <Button variant="primary" aria-label="Back">
          {/* @ts-ignore */}
          <Icon name="ChevronLeft" />
        </Button>
      ) : (
        <Button variant="primary">◀</Button>
      )}
    </div>
  );
}