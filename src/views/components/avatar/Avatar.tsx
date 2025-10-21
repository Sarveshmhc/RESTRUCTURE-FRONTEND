import React from "react";
import styles from "./avatar.module.css";

export type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | number;
  fallbackSrc?: string;
  initials?: string;
  className?: string;
};

const sizeMap = {
  sm: 28,
  md: 40,
  lg: 56,
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = "md",
  fallbackSrc,
  initials,
  className,
  ...rest
}) => {
  const [imgError, setImgError] = React.useState(false);
  const numericSize = typeof size === "number" ? size : sizeMap[size] ?? sizeMap.md;
  const showImg = !!src && !imgError;

  const handleError = () => setImgError(true);

  return (
    <div
      role="img"
      aria-label={alt ?? initials ?? "avatar"}
      className={[
        styles.root,
        className ?? "",
        numericSize <= 32 ? styles.sm : numericSize >= 56 ? styles.lg : styles.md,
        typeof size === "number" ? `${styles[`size${numericSize}`]}` : "",
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {showImg ? (
        // try primary src first; if it errors we'll fallback to fallbackSrc (if provided) or initials
        <img
          src={src as string}
          alt={alt ?? "avatar"}
          className={styles.img}
          onError={(e) => {
            // if fallbackSrc exists, swap to it once; otherwise mark error to show initials
            if (fallbackSrc && (e.currentTarget.src !== fallbackSrc)) {
              e.currentTarget.src = fallbackSrc;
            } else {
              handleError();
            }
          }}
        />
      ) : fallbackSrc ? (
        <img src={fallbackSrc} alt={alt ?? "avatar fallback"} className={styles.img} onError={handleError} />
      ) : (
        <div className={styles.fallback}>
          {initials ? (
            <span className={styles.initials}>{initials}</span>
          ) : (
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden>
              <path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4Z" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

export default Avatar;