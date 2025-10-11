"use client"

import React from "react"
import styles from "./SamplePanel.module.css"

// import everything from the components barrel
import * as Components from "../../../views/components"
import BadgeVariants from "../../../views/components/badge/BadgeVariants";
import ButtonVariants from "../../../views/components/buttons/ButtonVariants";

/* Minimal error boundary so a broken component doesn't break the whole panel */
class PreviewErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err: any) { console.warn("Preview render error:", err) }
  render() {
    if (this.state.hasError) return <div className={styles.previewUnavailable}>Preview unavailable</div>
    return this.props.children
  }
}

/* Try to render an exported value safely */
function RenderExport({ name, value }: { name: string; value: any }) {
  const isReactComponent = typeof value === "function" || (value && (value.$$typeof || value.prototype?.isReactComponent))

  if (!isReactComponent) {
    return <div className={styles.previewUnavailable}>Not a renderable export</div>
  }

  const Comp = value as React.ComponentType<any>
  const safeProps: Record<string, any> = {
    value: undefined,
    onChange: () => {},
    items: [],
    tabs: [],
    children: undefined,
    label: "Preview",
    title: "Preview",
  }

  try {
    return (
      <PreviewErrorBoundary>
        <div className={styles.previewInner}>
          <Comp {...safeProps} />
        </div>
      </PreviewErrorBoundary>
    )
  } catch (err) {
    console.warn("Render failed for", name, err)
    return <div className={styles.previewUnavailable}>Preview failed</div>
  }
}

/* small Card wrapper */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.card} aria-label={`${title} preview`}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.previewRow} style={{ minHeight: 96 }}>{children}</div>
    </section>
  )
}

export default function SamplePanel() {
  // get exports and stable sort
  const entries = React.useMemo(
    () =>
      Object.entries(Components)
        .filter(([k]) => !!k && k !== "default")
        .sort(([a], [b]) => a.localeCompare(b)),
    []
  )

  // auto-discover badge/button exports (case-insensitive)
  const badgeEntries = entries.filter(([name]) => /badge/i.test(name))
  const buttonEntries = entries.filter(([name]) => /button/i.test(name))

  // Breadcrumbs preview items
  const bcItems = [
    { label: "Home", href: "/hr/home" },
    { label: "Samples", href: "/hr/samples" },
    { label: "Component Preview" },
  ]

  // Breadcrumbs component reference (safe)
  const BreadcrumbsComp = (Components as any).Breadcrumbs
  const BadgeComp = (Components as any).Badge
  const ButtonComp = (Components as any).Button
  const IconComp = (Components as any).Icon // optional icon component

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Component Preview — All Exports</h1>
        <p className={styles.subtitle}>Automatic gallery of every export from the components barrel.</p>
      </header>

      {/* Breadcrumbs preview (top of panel) */}
      <div style={{ marginBottom: 14 }}>
        {BreadcrumbsComp ? (
          <div style={{ maxWidth: 820 }}>
            {/* @ts-ignore */}
            <BreadcrumbsComp items={bcItems} />
          </div>
        ) : (
          <div style={{ color: "var(--muted)" }}>Breadcrumbs component not exported — see <a href="src/views/components/breadcrumbs/BreadCrumbs.tsx">BreadCrumbs.tsx</a></div>
        )}
      </div>

      <div className={styles.grid}>
        {/* Handcrafted Badge variants (explicit examples) */}
        <Card title="Badge — Variants (explicit)">
          <div className={styles.previewCol} style={{ gap: 12 }}>
            <BadgeVariants />
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Badge variants rendered with explicit props.</div>
          </div>
        </Card>

        {/* Handcrafted Button variants (explicit examples) */}
        <Card title="Button — Variants (explicit)">
          <div className={styles.previewCol} style={{ gap: 12 }}>
            <ButtonVariants />
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Button variants including loading and icon-only previews.</div>
          </div>
        </Card>

        {/* Badges section (auto-discovered) */}
        <Card title={`Badges (${badgeEntries.length})`}>
          {badgeEntries.length === 0 ? (
            <div className={styles.note}>No badge exports found in the components barrel.</div>
          ) : (
            <div className={styles.previewCol}>
              {badgeEntries.map(([name, value]) => (
                <div key={name} style={{ width: "100%", marginBottom: 8 }}>
                  <div style={{ marginBottom: 6, fontSize: 13, color: "var(--muted)" }}>{name}</div>
                  <RenderExport name={name} value={value} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Buttons section (auto-discovered) */}
        <Card title={`Buttons (${buttonEntries.length})`}>
          {buttonEntries.length === 0 ? (
            <div className={styles.note}>No button exports found in the components barrel.</div>
          ) : (
            <div className={styles.previewCol}>
              {buttonEntries.map(([name, value]) => (
                <div key={name} style={{ width: "100%", marginBottom: 8 }}>
                  <div style={{ marginBottom: 6, fontSize: 13, color: "var(--muted)" }}>{name}</div>
                  <RenderExport name={name} value={value} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Render remaining components as before (compact preview) */}
        {entries.map(([name, value]) => (
          <Card key={name} title={name}>
            <RenderExport name={name} value={value} />
          </Card>
        ))}
      </div>
    </div>
  )
}