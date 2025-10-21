import React from "react";
import styles from "./button.module.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  loading,
  className,
  ...props
}) => {
  const variantClass =
    variant === "primary"
      ? styles.primary
      : variant === "secondary"
      ? styles.secondary
      : styles.danger;

  const combinedClassName = [styles.button, variantClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      className={combinedClassName}
      disabled={loading || props.disabled}
    >
      {loading ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 50 50"
          aria-hidden="true"
          className={styles.loadingIcon}
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="31.4 31.4"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;