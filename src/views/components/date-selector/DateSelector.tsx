import React from 'react';
import styles from './dateselector.module.css';

export interface DateSelectorProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const DateSelector: React.FC<DateSelectorProps> = (props) => (
  <input type="date" className={styles.date} {...props} />
);

export default DateSelector;