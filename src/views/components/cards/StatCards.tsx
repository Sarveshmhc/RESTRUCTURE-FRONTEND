import React from "react";
import { motion } from "framer-motion";
import Card from "./Cards";
import styles from "./cards.module.css";

export type StatCardProps = {
  title: string;
  value: string | number;
  delta?: string; // e.g. "+4.2%"
  trend?: "up" | "down" | "flat";
  icon?: React.ReactNode;
  hint?: string;
  className?: string;
  onClick?: () => void;
};

const trendClass = (t?: StatCardProps["trend"]) =>
  t === "up" ? styles.trendUp : t === "down" ? styles.trendDown : styles.trendFlat;

const StatCard: React.FC<StatCardProps> = ({ title, value, delta, trend, icon, hint, className = "", onClick }) => {
  return (
    <Card
      className={`${styles.statCard} ${className}`}
      onClick={onClick}
    >
      <div className={styles.statRow}>
        <div className={styles.statLeft}>
          {icon ? <div className={styles.statIcon}>{icon}</div> : null}
          <div className={styles.statText}>
            <div className={styles.statTitle}>{title}</div>
            <div className={styles.statValue}>{value}</div>
          </div>
        </div>

        <div className={styles.statRight}>
          {delta ? (
            <motion.div className={`${styles.delta} ${trendClass(trend)}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {delta}
            </motion.div>
          ) : null}
          {hint ? <div className={styles.hint}>{hint}</div> : null}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;