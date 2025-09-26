import React from "react";
import styles from "./toploading.module.css";

export interface TopLoadingProps {
  loading: boolean;
}

const TopLoading: React.FC<TopLoadingProps> = ({ loading }) =>
  loading ? <div className={styles.toploading} /> : null;

export default TopLoading;