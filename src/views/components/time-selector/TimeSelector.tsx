import React from "react";
import styles from "./timeselector.module.css";

export interface TimeSelectorProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const TimeSelector: React.FC<TimeSelectorProps> = props => (
  <input type="time" className={styles.time} {...props} />
);

export default TimeSelector;