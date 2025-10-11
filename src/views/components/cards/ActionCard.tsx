import React from "react";
import { motion } from "framer-motion";
import Card from "./Cards";
import styles from "./cards.module.css";

export type ActionCardProps = {
  title: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  footer?: React.ReactNode;
  className?: string;
};

const ActionCard: React.FC<ActionCardProps> = ({ title, description, primaryLabel = "Open", secondaryLabel, onPrimary, onSecondary, footer, className = "" }) => {
  return (
    <Card className={`${styles.actionCard} ${className}`}>
      <div className={styles.actionInner}>
        <div>
          <div className={styles.actionTitle}>{title}</div>
          {description ? <div className={styles.actionDesc}>{description}</div> : null}
        </div>

        <div className={styles.actionBtns}>
          {secondaryLabel && (
            <button type="button" className={`${styles.ghostBtn}`} onClick={onSecondary}>
              {secondaryLabel}
            </button>
          )}
          <motion.button whileTap={{ scale: 0.97 }} className={styles.primaryBtn} onClick={onPrimary}>
            {primaryLabel}
          </motion.button>
        </div>
      </div>

      {footer ? <div className={styles.actionFooter}>{footer}</div> : null}
    </Card>
  );
};

export default ActionCard;