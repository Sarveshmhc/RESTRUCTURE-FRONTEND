import React from "react";
import styles from "./switch.module.css";

export type SwitchProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked: checkedProp, defaultChecked, onCheckedChange, disabled, className, ...rest }, ref) => {
    const isControlled = typeof checkedProp === "boolean";
    const [checkedState, setCheckedState] = React.useState<boolean>(defaultChecked ?? false);
    const checked = isControlled ? (checkedProp as boolean) : checkedState;

    React.useEffect(() => {
      if (isControlled) setCheckedState(checkedProp as boolean);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkedProp]);

    const toggle = React.useCallback(
      (next?: boolean) => {
        if (disabled) return;
        const newVal = typeof next === "boolean" ? next : !checked;
        if (!isControlled) setCheckedState(newVal);
        onCheckedChange?.(newVal);
      },
      [checked, disabled, isControlled, onCheckedChange]
    );

    const onKeyDown: React.KeyboardEventHandler = (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggle();
      }
    };

    return (
      <button
        {...rest}
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked ? "true" : "false"}
        aria-disabled={disabled ? "true" : undefined}
        disabled={disabled}
        onClick={() => toggle()}
        onKeyDown={onKeyDown}
        className={[
          styles.switch,
          checked ? styles.on : styles.off,
          disabled ? styles.disabled : "",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className={styles.track}>
          <span className={styles.thumb} />
        </span>
      </button>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;