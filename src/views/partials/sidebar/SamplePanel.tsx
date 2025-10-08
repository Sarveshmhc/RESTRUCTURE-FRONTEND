import React, { useState } from "react";
import * as Components from "../../components";
import styles from "./SamplePanel.module.css";

/**
 * SamplePanel
 * - Renders previews for each export from src/views/components/index.ts
 * - Provides safe sample props for common components to avoid runtime errors
 * - Does NOT pass children by default to avoid void-element errors
 */
const SamplePanel: React.FC = () => {
  const [tabId, setTabId] = useState<string>("t1");
  const entries = Object.entries(Components).sort(([a], [b]) => a.localeCompare(b));

  const sampleProps: Record<string, any> = {
    Breadcrumbs: { items: [{ label: "Home", href: "/" }, { label: "Library" }, { label: "Current" }] },
    BreadCrumbs: { items: [{ label: "Home", href: "/" }, { label: "Library" }, { label: "Current" }] },
    BasicCalendar: { date: new Date() },
    BasicCalender: { date: new Date() },
    ProgressBar: { value: 64 },
    Tabs: {
      tabs: [
        { id: "t1", label: "One" },
        { id: "t2", label: "Two" },
      ],
      activeTab: tabId,
      onTabChange: (id: string) => setTabId(id),
    },
    Toast: { message: "Sample toast", type: "info" },
    FileViewer: { url: "https://example.com/sample.png", type: "image/png" },

    // safe DropDown and EmployeeCalendar samples
    DropDown: { options: [{ value: "1", label: "One" }, { value: "2", label: "Two" }], placeholder: "Choose" },
    EmployeeCalendar: {
      events: [
        { id: "e1", date: new Date().toISOString().slice(0,10), start: "09:00", end: "10:00", title: "Standup", employeeName: "Alice", color: "#0C736B", status: "confirmed" }
      ],
      initialDate: new Date().toISOString().slice(0,10),
      onEventClick: () => {}
    },

    // NEW: provide Accordion required props so it won't crash
    Accordion: {
      items: [
        { id: "a1", title: "Section 1", content: "Content for section 1" },
        { id: "a2", title: "Section 2", content: "Content for section 2" },
      ],
      allowMultiple: true,
      defaultExpanded: ["a1"],
    },

    // add more explicit samples here for components that require data (Charts, Cards, Table, etc.)
  };
  
  // optional: blacklist problematic names so they are skipped instead of crashing
  const blacklist = new Set(["default", "__esModule", "prakash", "SomeProblematicExport"]);
  
  const safeRender = (name: string, Comp: any) => {
    try {
      if (!Comp) return <div className={styles.unrenderable}>No export</div>;
      if (blacklist.has(name)) return <div className={styles.unrenderable}>skipped</div>;

      // Primitive / non-renderable exports
      if (typeof Comp !== "function" && typeof Comp !== "object") {
        return <div className={styles.valuePreview}>{String(Comp)}</div>;
      }

      // If we have explicit sample props for this component, use them
      if (sampleProps[name]) {
        return React.createElement(Comp, sampleProps[name]);
      }

      const n = name.toLowerCase();

      // Heuristics for known types (these use safe prop renders)
      if (n.includes("button") || n.includes("btn")) {
        return (
          <div className={styles.buttonVariants}>
            {React.createElement(Comp, { variant: "primary", size: "lg" }, "Primary")}
            {React.createElement(Comp, { variant: "secondary", size: "md" }, "Secondary")}
            {React.createElement(Comp, { variant: "ghost", size: "sm" }, "Ghost")}
          </div>
        );
      }

      if (n.includes("input") || n.includes("field") || n.includes("search")) {
        return (
          <div className={styles.formPreview}>
            {React.createElement(Comp, { placeholder: "Sample input", "aria-label": "sample-input" })}
            <textarea className={styles.textarea} placeholder="Sample textarea" />
          </div>
        );
      }

      if (n.includes("badge") || n.includes("pill")) {
        return (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {React.createElement(Comp, { label: "New", color: "primary" })}
            {React.createElement(Comp, { label: "12", color: "danger" })}
          </div>
        );
      }

      if (n.includes("avatar")) {
        return React.createElement(Comp, { src: "", alt: "Sample avatar", size: 40 });
      }

      if (n.includes("table") || n.includes("list")) {
        const sampleData = [{ id: 1, name: "Alpha" }, { id: 2, name: "Beta" }];
        return React.createElement(Comp, { data: sampleData });
      }

      if (n.includes("card") || n.includes("panel") || n.includes("widget")) {
        return React.createElement(Comp, {}, (
          <div style={{ padding: 8 }}>
            <strong>Title</strong>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Card preview content</div>
          </div>
        ));
      }

      if (n.includes("modal") || n.includes("toast") || n.includes("notif")) {
        try {
          return React.createElement(Comp, { open: false, message: "Preview" });
        } catch {
          return React.createElement(Comp, {});
        }
      }

      // Generic fallback: create element WITHOUT children to avoid injecting children into <input /> or other void elements
      return React.createElement(Comp, {});
    } catch (err) {
      console.error(`SamplePanel render error for ${name}:`, err);
      return <div className={styles.unrenderable}>Unable to render preview</div>;
    }
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h2>Global Components Preview</h2>
        <p className={styles.subtitle}>Rendering all exports from <code>src/views/components/index.ts</code></p>
      </header>

      <div className={styles.grid}>
        {entries.map(([name, Comp]) => (
          <div className={styles.card} key={name}>
            <div className={styles.cardHeader}><strong>{name}</strong></div>
            <div className={styles.cardBody}>{safeRender(name, Comp)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SamplePanel;