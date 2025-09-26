import React from 'react';
import styles from './cautionbox.module.css';

export interface CautionBoxProps {
  message: string;
}

const CautionBox: React.FC<CautionBoxProps> = ({ message }) => (
  <div className={styles.caution}>{message}</div>
);

export default CautionBox;