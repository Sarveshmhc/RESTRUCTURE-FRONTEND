import React from 'react';
import styles from './basiccalendar.module.css';

export interface BasicCalendarProps {
  date: Date;
}

const BasicCalendar: React.FC<BasicCalendarProps> = ({ date }) => (
  <div className={styles.calendar}>
    <div className={styles.month}>{date.toLocaleString('default', { month: 'long' })}</div>
    <div className={styles.day}>{date.getDate()}</div>
    <div className={styles.year}>{date.getFullYear()}</div>
  </div>
);

export default BasicCalendar;