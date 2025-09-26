import React, { useState } from "react";
import styles from "./notification.module.css";
import { Bell } from "lucide-react";

const mockNotifications = [
  { id: "1", message: "to MH-HR!", read: false },
  { id: "2", message: "Your leave was approved.", read: false },
];

const Notification: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.iconBtn} onClick={() => setOpen(o => !o)}>
        <Bell size={22} />
        {notifications.some(n => !n.read) && <span className={styles.dot} />}
      </button>
      {open && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            Notifications
            <button className={styles.markAll} onClick={markAllRead}>Mark all as read</button>
          </div>
          <ul className={styles.list}>
            {notifications.length === 0 && <li className={styles.empty}>No notifications</li>}
            {notifications.map(n => (
              <li key={n.id} className={n.read ? styles.read : styles.unread}>
                {n.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;