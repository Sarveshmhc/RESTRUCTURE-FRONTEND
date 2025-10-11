import React from "react";
import Card from "./Cards";
import styles from "./cards.module.css";

export type IconCardProps = {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  accent?: "blue" | "green" | "orange" | "purple";
  onClick?: () => void;
  className?: string;
};

const IconCard: React.FC<IconCardProps> = ({ title, subtitle, icon, accent = "blue", onClick, className = "" }) => {
  return (
    <Card className={`${styles.iconCard} ${styles[`accent_${accent}`]} ${className}`} onClick={onClick}>
      <div className={styles.iconCardInner}>
        <div className={styles.iconWrap}>{icon}</div>
        <div className={styles.iconBody}>
          <div className={styles.iconTitle}>{title}</div>
          {subtitle ? <div className={styles.iconSubtitle}>{subtitle}</div> : null}
        </div>
      </div>
    </Card>
  );
};

export default IconCard;