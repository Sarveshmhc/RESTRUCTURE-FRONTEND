import Badge, { BadgeProps } from "./Badge";

export default function BadgeVariants() {
  const badges: BadgeProps[] = [
    { label: "Primary", color: "primary" },
    { label: "Success", color: "success" },
    { label: "Warning", color: "warning" },
    { label: "Danger", color: "danger" },
    { label: "Pill", color: "primary", style: { borderRadius: 999 } },
  ];

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      {badges.map((badge, index) => (
        <Badge key={index} {...badge} />
      ))}
    </div>
  );
}