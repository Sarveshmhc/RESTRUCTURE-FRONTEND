import React from "react";
import { motion } from "framer-motion";
import Card from "./Cards";
import styles from "./employeebluecard.module.css";

export type EmployeeBlueCardProps = {
  name: string;
  designation?: string;
  employeeId?: string;
  avatarUrl?: string;
  status?: "online" | "offline" | "away" | "busy";
  completionPercent?: number; // profile completion or similar
  lastPunch?: string;
  location?: string;
  actions?: React.ReactNode; // right-side action buttons
  onClick?: () => void;
  className?: string;
};

const statusColor = (s?: EmployeeBlueCardProps["status"]) =>
  s === "online" ? styles.statusOnline : s === "away" ? styles.statusAway : s === "busy" ? styles.statusBusy : styles.statusOffline;

const EmployeeBlueCard: React.FC<EmployeeBlueCardProps> = ({
  name,
  designation,
  employeeId,
  avatarUrl,
  status = "offline",
  completionPercent = 0,
  lastPunch,
  location,
  actions,
  onClick,
  className = "",
}) => {
  return (
    <Card className={`${styles.wrapper} ${className}`} onClick={onClick}>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36 }}>
        <div className={styles.header}>
          <div className={styles.left}>
            <div className={styles.avatarWrap}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>{(name || "E").slice(0, 1).toUpperCase()}</div>
              )}
              <span className={`${styles.statusDot} ${statusColor(status)}`} aria-hidden />
            </div>

            <div className={styles.meta}>
              <div className={styles.name}>{name}</div>
              <div className={styles.sub}>
                {designation ? <span className={styles.designation}>{designation}</span> : null}
                {employeeId ? <span className={styles.empId}>{employeeId}</span> : null}
              </div>
            </div>
          </div>

          <div className={styles.right}>
            {actions ? <div className={styles.actions}>{actions}</div> : null}
            <div className={styles.smallMeta}>
              {location ? <div className={styles.loc}>{location}</div> : null}
              {lastPunch ? <div className={styles.punch}>Last: {lastPunch}</div> : null}
            </div>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.progressRow}>
            <div className={styles.progressLabel}>Profile completion</div>
            <div className={styles.progressValue}>{Math.max(0, Math.min(100, completionPercent))}%</div>
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.max(0, Math.min(100, completionPercent))}%` }}
              aria-hidden
            />
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{completionPercent >= 100 ? "Done" : `${completionPercent}%`}</div>
              <div className={styles.statLabel}>Completion</div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statValue}>{lastPunch ?? "-"}</div>
              <div className={styles.statLabel}>Last punch</div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statValue}>{location ?? "—"}</div>
              <div className={styles.statLabel}>Location</div>
            </div>
          </div>
        </div>
      </motion.div>
    </Card>
  );
};

export default EmployeeBlueCard;