import React from 'react';
import styles from './employeecalendar.module.css';

export interface EmployeeCalendarProps {
  events: { date: string; label: string }[];
}

const EmployeeCalendar: React.FC<EmployeeCalendarProps> = ({ events }) => (
  <ul className={styles.calendar}>
    {events.map(ev => (
      <li key={ev.date}>
        <span className={styles.date}>{ev.date}</span>
        <span>{ev.label}</span>
      </li>
    ))}
  </ul>
);

export default EmployeeCalendar;