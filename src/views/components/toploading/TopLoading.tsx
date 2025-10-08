import React, { useEffect, useState } from "react";

interface TopLoadingProps {
  loading?: boolean;
  color?: string;
  height?: number;
  fadeDelay?: number; // ms to wait before hiding for a smooth UX
}

const TopLoading: React.FC<TopLoadingProps> = ({
  loading = false,
  color = "#2563eb",
  height = 3,
  fadeDelay = 200,
}) => {
  const [visible, setVisible] = useState<boolean>(loading);
  const [opacity, setOpacity] = useState<number>(loading ? 1 : 0);

  useEffect(() => {
    if (loading) {
      setVisible(true);
      // show immediately
      requestAnimationFrame(() => setOpacity(1));
      return;
    }
    // hide with small delay for smooth fade
    setOpacity(0);
    const t = setTimeout(() => setVisible(false), fadeDelay);
    return () => clearTimeout(t);
  }, [loading, fadeDelay]);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: `${height}px`,
        background: color,
        zIndex: 99999,
        transition: "opacity 180ms ease",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

export default TopLoading;