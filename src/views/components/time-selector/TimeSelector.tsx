import React from "react";
import styles from "./timeselector.module.css";

export type TimeSelectorProps = React.InputHTMLAttributes<HTMLInputElement>;

const TimeSelector: React.FC<TimeSelectorProps> = props => (
  <input type="time" className={styles.time} {...props} />
);

export default TimeSelector;