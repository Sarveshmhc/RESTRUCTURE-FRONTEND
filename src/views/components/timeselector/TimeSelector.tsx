import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./timeselector.module.css";

type TimeSelectorProps = {
  value?: string | null;         // "HH:MM" (24h) or null
  onChange: (time: string | null) => void;
  step?: number;                 // minutes step (default 15)
  clearable?: boolean;
  twelveHour?: boolean;          // show AM/PM (default false)
  placeholder?: string;
  id?: string;
  className?: string;
};

function pad(n: number) { return n.toString().padStart(2, "0"); }
function normalizeInput(v?: string | null) {
  if (!v) return null;
  const [h, m] = v.split(":").map((s) => parseInt(s, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  const hh = (h + 24) % 24;
  const mm = Math.max(0, Math.min(59, m));
  return `${pad(hh)}:${pad(mm)}`;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  value,
  onChange,
  step = 15,
  clearable = true,
  twelveHour = false,
  placeholder = "Select time",
  id,
  className,
}) => {
  const inputRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const parsed = useMemo(() => normalizeInput(value), [value]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(parsed);
  const [hours, minutes] = useMemo(() => {
    const hs = Array.from({ length: 24 }, (_, i) => pad(i));
    const ms: string[] = [];
    for (let m = 0; m < 60; m += step) ms.push(pad(m));
    return [hs, ms];
  }, [step]);

  useEffect(() => setSelected(parsed ?? null), [parsed]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (panelRef.current && panelRef.current.contains(e.target as Node)) return;
      if (inputRef.current && inputRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const displayLabel = useMemo(() => {
    if (!selected) return "";
    const [h, m] = selected.split(":").map((s) => parseInt(s, 10));
    if (twelveHour) {
      const am = h < 12;
      const hh = ((h + 11) % 12) + 1;
      return `${pad(hh)}:${pad(m)} ${am ? "AM" : "PM"}`;
    }
    return `${pad(h)}:${pad(m)}`;
  }, [selected, twelveHour]);

  const pick = (h: string, m: string) => {
    const val = `${h}:${m}`;
    setSelected(val);
    onChange(val);
    setOpen(false);
  };

  const clear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelected(null);
    onChange(null);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // keyboard navigation inside panel
  const [focusPos, setFocusPos] = useState<{ h: number; m: number } | null>(null);
  useEffect(() => {
    if (!open) { setFocusPos(null); return; }
    if (selected) {
      const [sh, sm] = selected.split(":").map((s) => parseInt(s, 10));
      const mh = Math.max(0, Math.min(23, sh));
      const mmIndex = minutes.findIndex(x => x === pad(sm));
      setFocusPos({ h: mh, m: mmIndex >= 0 ? mmIndex : 0 });
    } else {
      setFocusPos({ h: 12, m: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onPanelKey = (e: React.KeyboardEvent) => {
    if (!focusPos) return;
    const { h, m } = focusPos;
    if (e.key === "ArrowRight") setFocusPos({ h, m: Math.min(minutes.length - 1, m + 1) });
    else if (e.key === "ArrowLeft") setFocusPos({ h, m: Math.max(0, m - 1) });
    else if (e.key === "ArrowUp") setFocusPos({ h: Math.max(0, h - 1), m });
    else if (e.key === "ArrowDown") setFocusPos({ h: Math.min(23, h + 1), m });
    else if (e.key === "Enter") {
      const hh = pad(focusPos.h);
      const mm = minutes[focusPos.m] ?? "00";
      pick(hh, mm);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <button
        type="button"
        id={id}
        ref={inputRef}
        className={styles.inputBtn}
        aria-haspopup="dialog"
        aria-expanded={open ? true : false}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" width="16" height="16" aria-hidden>
          <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>

        <span className={styles.inputText}>
          {selected ? displayLabel : <span className={styles.placeholder}>{placeholder}</span>}
        </span>

        <div className={styles.actions}>
          {clearable && selected && (
            <button className={styles.clearBtn} onClick={clear} aria-label="Clear time">
              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
            </button>
          )}
          <svg className={styles.chev} viewBox="0 0 24 24" width="16" height="16" aria-hidden>
            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      </button>

      {open && (
        <div className={styles.panelWrap} ref={panelRef} role="dialog" aria-modal="false" onKeyDown={onPanelKey}>
          <div className={styles.panel}>
            <div className={styles.header}>
              <div className={styles.title}>Select time</div>
              <div className={styles.presetRow}>
                <button className={styles.preset} onClick={() => { pick("09", "00"); }}>09:00</button>
                <button className={styles.preset} onClick={() => { pick("12", "00"); }}>12:00</button>
                <button className={styles.preset} onClick={() => { pick("17", "00"); }}>17:00</button>
              </div>
            </div>

            <div className={styles.body}>
              <div className={styles.colHours} role="group" aria-label="Hours">
                {hours.map((hh, i) => {
                  const active = selected?.startsWith(hh);
                  const focused = focusPos?.h === i;
                  return (
                    <button
                      key={hh}
                      className={`${styles.cell} ${active ? styles.active : ""} ${focused ? styles.focused : ""}`}
                      onClick={() => {
                        // open minute selection by default: pick first minute option
                        const mm = (selected && selected.split(":")[1]) ?? minutes[0];
                        pick(hh, mm);
                      }}
                    >
                      {twelveHour ? (() => {
                        const n = Number(hh);
                        const am = n < 12;
                        const disp = ((n + 11) % 12) + 1;
                        return `${disp} ${am ? "AM" : "PM"}`;
                      })() : hh}
                    </button>
                  );
                })}
              </div>

              <div className={styles.colMinutes} role="group" aria-label="Minutes">
                {minutes.map((mm, j) => {
                  const active = selected?.endsWith(mm);
                  const focused = focusPos?.m === j;
                  // show selected hour with minute mapping
                  return (
                    <button
                      key={mm}
                      className={`${styles.cell} ${active ? styles.active : ""} ${focused ? styles.focused : ""}`}
                      onClick={() => {
                        const h = selected ? selected.split(":")[0] : "12";
                        pick(h, mm);
                      }}
                    >
                      {mm}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.footer}>
              <button className={styles.todayBtn} onClick={() => { const now = new Date(); const hh = pad(now.getHours()); const mmVal = pad(Math.floor(now.getMinutes() / step) * step); pick(hh, mmVal); }}>Now</button>
              <div className={styles.footerRight}>
                <button className={styles.closeBtn} onClick={() => setOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSelector;