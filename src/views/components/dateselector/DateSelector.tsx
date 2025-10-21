import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./dateselector.module.css";

type DateSelectorProps = {
  value?: string | null; // ISO yyyy-mm-dd
  onChange: (isoDate: string | null) => void;
  placeholder?: string;
  clearable?: boolean;
  minDate?: string;
  maxDate?: string;
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function toIsoDate(d: Date) { return d.toISOString().slice(0,10); }
function parseDate(v?: string | null) {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0,0,0,0);
  return d;
}
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function startOfWeek(d: Date) {
  const day = d.getDay();
  const r = new Date(d);
  r.setDate(d.getDate() - day);
  r.setHours(0,0,0,0);
  return r;
}
function addDays(d: Date, days: number) { const r = new Date(d); r.setDate(r.getDate() + days); return r; }
function addMonths(d: Date, months: number) { return new Date(d.getFullYear(), d.getMonth() + months, 1); }
function isSameDay(a: Date, b: Date | null) {
  if (!b) return false;
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}

function formatDisplay(d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString(undefined, { month: "long", day: "2-digit", year: "numeric" });
}

const defaultYearRange = (center: number, span = 12) => {
  const start = center - Math.floor(span/2);
  return Array.from({length: span}, (_,i) => start + i);
};

const DateSelector: React.FC<DateSelectorProps> = ({ value, onChange, placeholder = "Select date", clearable = true, minDate, maxDate }) => {
  const inputRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const parsed = useMemo(() => parseDate(value ?? null), [value]);
  const [selected, setSelected] = useState<Date | null>(parsed);
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => parsed ? startOfMonth(parsed) : startOfMonth(new Date()));
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);

  useEffect(() => setSelected(parsed ?? null), [parsed]);

  useEffect(() => { if (parsed) setVisibleMonth(startOfMonth(parsed)); }, [parsed]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (panelRef.current && panelRef.current.contains(e.target as Node)) return;
      if (inputRef.current && inputRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const grid = useMemo(() => {
    const start = startOfWeek(startOfMonth(visibleMonth));
    const arr: Date[] = [];
    for (let i=0;i<42;i++) arr.push(addDays(start, i));
    return arr;
  }, [visibleMonth]);

  const minD = useMemo(() => parseDate(minDate ?? null), [minDate]);
  const maxD = useMemo(() => parseDate(maxDate ?? null), [maxDate]);

  const selectDay = (d: Date) => {
    if ((minD && d < minD) || (maxD && d > maxD)) return;
    setSelected(d);
    onChange(toIsoDate(d));
    setOpen(false);
  };

  const clear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelected(null);
    onChange(null);
  };

  const gotoPrev = () => setVisibleMonth(m => addMonths(m, -1));
  const gotoNext = () => setVisibleMonth(m => addMonths(m, +1));

  const onMonthChange = (m: number) => setVisibleMonth(v => new Date(v.getFullYear(), m, 1));
  const onYearChange = (y: number) => setVisibleMonth(v => new Date(y, v.getMonth(), 1));

  // prepare years list centered around visible month
  const years = useMemo(() => defaultYearRange(visibleMonth.getFullYear(), 16), [visibleMonth]);

  return (
    <div className={styles.wrapper}>
      <button
        ref={inputRef}
        type="button"
        className={styles.inputBtn}
        aria-haspopup="dialog"
        aria-expanded={open ? "true" : "false"}
        onClick={() => setOpen(v => !v)}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.25" fill="none" />
          <path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>

        <span className={styles.inputText}>
          { selected ? formatDisplay(selected) : <span className={styles.placeholder}>{placeholder}</span> }
        </span>

        <div className={styles.inputActions}>
          { clearable && selected && (
            <button className={styles.actionBtn} onClick={clear} aria-label="Clear date">
              <svg className={styles.actionIcon} viewBox="0 0 24 24" width="14" height="14"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          )}
          <svg className={styles.chevIcon} viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      </button>

      {open && (
        <div className={styles.panelWrap} ref={panelRef} role="dialog" aria-modal="false">
          <div className={styles.panel}>
            <div className={styles.topRow}>
              <button className={styles.iconBtn} onClick={gotoPrev} aria-label="Previous month">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
              </button>

              <div className={styles.selects}>
                <select className={styles.selectMonth} value={visibleMonth.getMonth()} onChange={e => onMonthChange(Number(e.target.value))} aria-label="Select month">
                  {MONTHS.map((m, idx) => <option key={m} value={idx}>{m.slice(0,3)}</option>)}
                </select>

                <select className={styles.selectYear} value={visibleMonth.getFullYear()} onChange={e => onYearChange(Number(e.target.value))} aria-label="Select year">
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <button className={styles.iconBtn} onClick={gotoNext} aria-label="Next month">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
              </button>
            </div>

            <div className={styles.weekRow}>
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} className={styles.weekDay}>{d}</div>)}
            </div>

            <div className={styles.grid}>
              {grid.map(d => {
                const iso = toIsoDate(d);
                const outside = d.getMonth() !== visibleMonth.getMonth();
                const todayFlag = isSameDay(d, today);
                const selectedFlag = isSameDay(d, selected);
                const disabled = (minD && d < minD) || (maxD && d > maxD);
                return (
                  <button
                    key={iso}
                    className={[
                      styles.cell,
                      outside ? styles.outside : "",
                      todayFlag ? styles.today : "",
                      selectedFlag ? styles.selected : "",
                      disabled ? styles.disabled : ""
                    ].join(" ")}
                    onClick={() => !disabled && selectDay(d)}
                    disabled={!!disabled}
                    aria-current={todayFlag ? "date" : undefined}
                  >
                    <span className={styles.cellNumber}>{d.getDate()}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.footerRow}>
              <button className={styles.todayBtn} onClick={() => { selectDay(today); }}>Today</button>
              <div className={styles.footerRight}>
                <button className={styles.clearBtn} onClick={() => { setOpen(false); }} aria-label="Close">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;