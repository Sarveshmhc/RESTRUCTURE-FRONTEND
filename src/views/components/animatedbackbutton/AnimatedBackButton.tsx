import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export interface AnimatedBackButtonProps {
  to?: string;
  ariaLabel?: string;
  size?: number;
  className?: string;
}

const AnimatedBackButton: React.FC<AnimatedBackButtonProps> = ({
  to,
  ariaLabel = "Go back",
  size = 44,
  className,
}) => {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 180);
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <ButtonWrapper
      className={className}
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={handleClick}
      data-pressed={pressed ? "true" : "false"}
      style={
        {
          ["--btn-size" as any]: `${size}px`,
          ["--scale" as any]: `${size / 58}`,
        } as React.CSSProperties
      }
    >
      <div className="lines" aria-hidden>
        <div className="line line1" />
        <div className="line line2" />
        <div className="line line3" />
      </div>
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.button`
  --btn-size: 44px;
  --scale: 0.76;
  appearance: none;
  border: 1px solid var(--sidebar-border, rgba(15, 23, 42, 0.06));
  background: var(--sidebar-btn-bg, transparent);
  color: var(--sidebar-text, #0f1724);
  width: var(--btn-size);
  height: var(--btn-size);
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  outline: none;
  padding: 0;
  transition: transform 0.12s ease-out, background 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-2px);
  }
  &:active {
    transform: scale(0.98);
  }

  .lines {
    position: relative;
    width: calc(40px * var(--scale));
    height: calc(28px * var(--scale));
    margin: 0 auto;
  }

  .line {
    position: absolute;
    left: 50%;
    transform-origin: center;
    background: currentColor;
    width: calc(34px * var(--scale));
    height: calc(5px * var(--scale));
    border-radius: calc(4px * var(--scale));
    transition: transform 0.22s ease, width 0.22s ease, opacity 0.18s ease;
  }

  /* top angled stroke (upper arm of chevron) */
  .line1 {
    top: 4px;
    transform: translateX(-50%) rotate(-35deg);
  }

  /* middle short stroke */
  .line2 {
    top: calc(50% - calc(2.5px * var(--scale)));
    width: calc(20px * var(--scale));
    transform: translateX(-50%);
  }

  /* bottom angled stroke (lower arm of chevron) */
  .line3 {
    bottom: 4px;
    transform: translateX(-50%) rotate(35deg);
  }

  /* pressed (subtle) */
  &[data-pressed="true"] .line1 {
    transform: translateX(-50%) rotate(-42deg) translateY(-1px);
  }
  &[data-pressed="true"] .line3 {
    transform: translateX(-50%) rotate(42deg) translateY(1px);
  }
  &[data-pressed="true"] .line2 {
    width: calc(18px * var(--scale));
  }
`;

export default AnimatedBackButton;