import React from "react";
import { motion } from "framer-motion";
import { Star, Gift, Calendar, Users, Bell } from "lucide-react";
import styles from "./todayshighlight.module.css";

export type HighlightItem = {
  id: string;
  type?: "celebration" | "birthday" | "anniversary" | "holiday" | "meeting" | "reminder";
  title: string;
  subtitle?: string;
  time?: string;
  icon?: React.ReactNode; // optional override
};

type Props = {
  highlights?: HighlightItem[];
  className?: string;
};

const ICON_MAP: Record<NonNullable<HighlightItem["type"]>, React.ComponentType<any>> = {
  celebration: Gift,
  birthday: Gift,
  anniversary: Calendar,
  holiday: Star,
  meeting: Users,
  reminder: Bell,
};

const DEFAULT: HighlightItem[] = [
  { id: "h1", type: "birthday", title: "John Doe's birthday", subtitle: "Wish him today", time: "All day" },
  { id: "h2", type: "anniversary", title: "Acme Corp - 3 years", subtitle: "Work anniversary", time: "Today" },
  { id: "h3", type: "meeting", title: "Sprint planning", subtitle: "Zoom - Room A", time: "11:00 AM" },
];

const TodaysHighlightsWidget: React.FC<Props> = ({ highlights = DEFAULT, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`${styles.card} ${className}`}
      role="region"
      aria-label="Today's highlights"
    >
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <Star className={styles.headerIcon} />
          <h3 className={styles.title}>Today's Highlights</h3>
        </div>
        <div className={styles.count}>{highlights.length}</div>
      </div>

      <div className={styles.list}>
        {highlights.length === 0 ? (
          <div className={styles.empty}>No highlights today</div>
        ) : (
          highlights.map((h, i) => {
            const Icon = (h.icon ? null : ICON_MAP[h.type ?? "reminder"]) as any;
            return (
              <motion.button
                key={h.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, delay: i * 0.04 }}
                className={styles.item}
                type="button"
                title={h.title}
              >
                <div className={styles.itemLeft}>
                  <div className={styles.itemIcon}>
                    {h.icon ? h.icon : <Icon className={styles.iconSvg} />}
                  </div>
                  <div className={styles.itemBody}>
                    <div className={styles.itemTitle}>{h.title}</div>
                    {h.subtitle ? <div className={styles.itemSubtitle}>{h.subtitle}</div> : null}
                  </div>
                </div>

                {h.time ? <div className={styles.itemTime}>{h.time}</div> : null}
              </motion.button>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default TodaysHighlightsWidget;