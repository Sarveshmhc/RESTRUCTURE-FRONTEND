import React from "react";
import styles from "./textbox.module.css";

export interface TextBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const TextBox: React.FC<TextBoxProps> = props => (
  <input className={styles.textbox} {...props} />
);

export default TextBox;