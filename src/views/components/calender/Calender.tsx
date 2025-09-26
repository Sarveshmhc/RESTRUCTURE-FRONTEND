import React from 'react';
import styles from './calendar.module.css';

export interface CalendarProps {
  children?: React.ReactNode;
}

const Calendar: React.FC<CalendarProps> = ({ children }) => (
  <div className={styles.calendar}>{children}</div>
);

export default Calendar;