import React from "react";
import { motion } from "framer-motion";
import { Bell, Calendar, ChevronRight, Megaphone, Gift } from "lucide-react";
import styles from "./recentannouncements.module.css";

export type Announcement = {
  id: string;
  title: string;
  description?: string;
  date?: string; // ISO or human readable
  priority?: "high" | "medium" | "low";
  type?: "policy" | "event" | "general" | "celebration";
  readBy?: number;
  totalEmployees?: number;
};

type Props = {
  announcements?: Announcement[];
  onOpen?: (a: Announcement) => void;
  onViewAll?: () => void;
  className?: string;
};

const ICON_MAP: Record<NonNullable<Announcement["type"]>, React.ReactNode> = {
  policy: <Megaphone />,
  event: <Calendar />,
  general: <Bell />,
  celebration: <Gift />,
};

const SAMPLE: Announcement[] = [
  {
    id: "1",
    title: "New HR Policy Update",
    description: "Please review the updated leave policy effective from next month.",
    date: "2024-01-15",
    priority: "high",
    type: "policy",
    readBy: 45,
    totalEmployees: 120,
  },
  {
    id: "2",
    title: "Team Building Event - Friday",
    description: "Join us for the quarterly team building event this Friday at 3 PM.",
    date: "2024-01-19",
    priority: "medium",
    type: "event",
    readBy: 78,
    totalEmployees: 120,
  },
  {
    id: "3",
    title: "Office Maintenance",
    description: "Scheduled maintenance on Saturday. Office will be closed.",
    date: "2024-01-10",
    priority: "low",
    type: "general",
    readBy: 12,
    totalEmployees: 120,
  },
];

const priorityClass = (p?: Announcement["priority"]) =>
  p === "high" ? styles.priorityHigh : p === "medium" ? styles.priorityMedium : styles.priorityLow;

const RecentAnnouncements: React.FC<Props> = ({ announcements = SAMPLE, onOpen, onViewAll, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`${styles.card} ${className}`}
      role="region"
      aria-label="Recent announcements"
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Bell className={styles.icon} />
          <div>
            <h3 className={styles.title}>Recent Announcements</h3>
            <p className={styles.subtitle}>Company updates & events</p>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.count}>{announcements.length}</div>
          <button
            type="button"
            className={styles.viewAllBtn}
            onClick={onViewAll}
            aria-label="View all announcements"
            title="View all"
          >
            <span>View All</span>
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className={styles.list}>
        {announcements.length === 0 ? (
          <div className={styles.empty}>No recent announcements</div>
        ) : (
          announcements.map((a, i) => {
            const icon = a.type ? ICON_MAP[a.type] : <Bell />;
            const pct =
              a.readBy && a.totalEmployees ? Math.round((Number(a.readBy) / Number(a.totalEmployees)) * 100) : 0;
            return (
              <motion.button
                key={a.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, delay: i * 0.04 }}
                className={styles.item}
                onClick={() => onOpen?.(a)}
                title={a.title}
              >
                <div className={styles.itemLeft}>
                  <div className={styles.itemIcon}>{icon}</div>
                  <div className={styles.itemBody}>
                    <div className={styles.itemTitle}>{a.title}</div>
                    {a.description ? <div className={styles.itemDesc}>{a.description}</div> : null}
                    <div className={styles.metaRow}>
                      {a.date ? (
                        <div className={styles.date}>
                          <Calendar className={styles.metaIcon} />
                          <span>{new Date(a.date).toLocaleDateString()}</span>
                        </div>
                      ) : null}

                      {a.priority ? (
                        <span className={`${styles.priority} ${priorityClass(a.priority)}`}>{a.priority}</span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className={styles.itemRight}>
                  <div className={styles.readBar} aria-hidden>
                    <div className={styles.readFill} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
                  </div>
                  <div className={styles.readText}>
                    {a.readBy}/{a.totalEmployees ?? "—"}
                  </div>
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default RecentAnnouncements;