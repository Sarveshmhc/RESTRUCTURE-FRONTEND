import React from "react";
import { motion } from "framer-motion";
import { Clock, Calendar } from "lucide-react";
import styles from "./yesterdayattendance.module.css"

export type YesterdayAttendanceData = {
  date?: string;
  inTime?: string;
  outTime?: string;
  totalHours?: string;
  status?: "Present" | "Absent" | "Late" | "Half-day";
  location?: string;
  note?: string;
};

type Props = {
  data?: YesterdayAttendanceData;
  className?: string;
  onView?: () => void;
  onExport?: () => void;
};

const defaultData: YesterdayAttendanceData = {
  date: "Yesterday",
  inTime: "09:15 AM",
  outTime: "06:30 PM",
  totalHours: "8h 45m",
  status: "Present",
  location: "Office",
  note: "",
};

const YesterdayAttendanceWidget: React.FC<Props> = ({ data = defaultData, className = "", onView, onExport }) => {
  const formatTime = (t?: string) => t ?? "-";

  const badgeClass =
    data.status === "Present"
      ? styles.badgePresent
      : data.status === "Late"
      ? styles.badgeLate
      : data.status === "Absent"
      ? styles.badgeAbsent
      : styles.badgeNeutral;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`${styles.card} ${className}`}
      role="region"
      aria-label="Yesterday's attendance"
    >
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Clock className={styles.icon} />
          <span>Yesterday's attendance</span>
        </h3>
        <div className={styles.dateWrap}>
          <Calendar className={styles.dateIcon} />
          <span className={styles.dateText}>{data.date ?? defaultData.date}</span>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.grid}>
          <div className={styles.block}>
            <div className={styles.label}>In-time</div>
            <div className={styles.value}>{formatTime(data.inTime)}</div>
          </div>

          <div className={styles.block}>
            <div className={styles.label}>Out-time</div>
            <div className={styles.value}>{formatTime(data.outTime)}</div>
          </div>

          <div className={styles.block}>
            <div className={styles.label}>Total hours</div>
            <div className={styles.value}>{data.totalHours ?? "-"}</div>
          </div>

          <div className={styles.block}>
            <div className={styles.label}>Location</div>
            <div className={styles.value}>{data.location ?? "-"}</div>
          </div>
        </div>

        <div className={styles.statusRow}>
          <span className={`${styles.statusBadge} ${badgeClass}`}>{data.status}</span>
          {data.note ? <div className={styles.note}>{data.note}</div> : null}
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={onView}>
            View details
          </button>
          <button className={styles.ghostBtn} onClick={onExport}>
            Export
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default YesterdayAttendanceWidget;