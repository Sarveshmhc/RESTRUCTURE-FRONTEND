import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export interface AnimatedBackButtonProps {
  to?: string;                 // optional explicit route, defaults to history back
  ariaLabel?: string;
  size?: number;               // square button size in px (default 44)
  className?: string;
}

const AnimatedBackButton: React.FC<AnimatedBackButtonProps> = ({
  to,
  ariaLabel = 'Go back',
  size = 44,
  className
}) => {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 250);
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <ButtonWrapper
      className={className}
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={handleClick}
      data-pressed={pressed ? 'true' : 'false'}
      style={
        {
          // expose size/scale via CSS vars (keeps original line math intact)
          ['--btn-size' as any]: `${size}px`,
          ['--scale' as any]: `${size / 58}`, // original artboard height was 58
        } as React.CSSProperties
      }
    >
      <div className="lines">
        <div className="line line1" />
        <div className="line line2" />
        <div className="line line3" />
      </div>
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.button`
  /* Button base */
  --btn-size: 44px;
  --scale: 0.76;
  appearance: none;
  border: 1px solid var(--sidebar-border, #334155);
  background: rgba(120,130,150,0.08);
  color: var(--sidebar-text, #e2e8f0);
  width: var(--btn-size);
  height: var(--btn-size);
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  outline: none;
  transition: background 0.2s, border-color 0.2s, transform 0.12s ease-out;

  &:hover {
    background: var(--sidebar-hover, #2a364a);
    border-color: var(--color-primary, #3b82f6);
  }

  &:active {
    transform: scale(0.98);
  }

  /* Inner drawing area matches the original code’s coordinate system */
  .lines {
    position: relative;
    width: calc(70px * var(--scale));
    height: calc(58px * var(--scale));
  }

  .line {
    position: absolute;
    width: calc(70px * var(--scale));
    height: calc(6px * var(--scale));
    background-color: currentColor;
    left: 0;
    border-radius: 6px;
    transition: transform 0.3s ease, width 0.3s ease, border-radius 0.3s ease, opacity 0.2s ease;
    will-change: transform, width;
  }

  /* Positions (from your original) scaled to the new canvas */
  .line1 { top: 0; }
  .line2 { top: calc(18px * var(--scale)); }
  .line3 { top: calc(36px * var(--scale)); }

  /* “Arrow” state: we always render as a back chevron using your transforms */
  .line1 {
    transform: rotate(-35deg) scaleX(0.55) translate(calc(-39px * var(--scale)), calc(-4.5px * var(--scale)));
    border-radius: 50px 0 0 50px;
    transform-origin: left center;
  }

  .line3 {
    transform: rotate(35deg) scaleX(0.55) translate(calc(-39px * var(--scale)), calc(4.5px * var(--scale)));
    border-radius: 50px 0 0 50px;
    transform-origin: left center;
  }

  .line2 {
    width: calc(45px * var(--scale));
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
  }

  /* Small press feedback (subtle morph) */
  &[data-pressed="true"] .line1 {
    transform: rotate(-40deg) scaleX(0.5) translate(calc(-41px * var(--scale)), calc(-5px * var(--scale)));
  }
  &[data-pressed="true"] .line3 {
    transform: rotate(40deg) scaleX(0.5) translate(calc(-41px * var(--scale)), calc(5px * var(--scale)));
  }
  &[data-pressed="true"] .line2 {
    width: calc(42px * var(--scale));
  }
`;

export default AnimatedBackButton;