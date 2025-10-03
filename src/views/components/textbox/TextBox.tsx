import React from "react";
import styles from "./textbox.module.css";

export type TextBoxProps = React.InputHTMLAttributes<HTMLInputElement>;

const TextBox: React.FC<TextBoxProps> = props => (
  <input className={styles.textbox} {...props} />
);

export default TextBox;