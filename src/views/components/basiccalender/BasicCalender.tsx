import React, { useState, useMemo } from 'react';
import styles from './basiccalender.module.css';

type EventItem = {
  date: string; // "YYYY-MM-DD"
  title?: string;
  color?: string;
};

interface BasicCalendarProps {
  events?: EventItem[];
  initialDate?: string; // "YYYY-MM-DD" or undefined (defaults to today)
  onDateSelect?: (dateISO: string) => void;
}

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function addDays(d: Date, days: number) {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n;
}

function monthMatrix(baseDate: Date) {
  // build 6 rows x 7 cols matrix starting on Sunday
  const start = startOfMonth(baseDate);
  const startDay = start.getDay(); // 0..6 (Sun..Sat)
  const firstCell = addDays(start, -startDay);
  const matrix: Date[][] = [];
  let cursor = firstCell;
  for (let week = 0; week < 6; week++) {
    const row: Date[] = [];
    for (let day = 0; day < 7; day++) {
      row.push(cursor);
      cursor = addDays(cursor, 1);
    }
    matrix.push(row);
  }
  return matrix;
}

function monthLabel(d: Date) {
  return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
}

const BasicCalendar: React.FC<BasicCalendarProps> = ({ events = [], initialDate, onDateSelect }) => {
  const today = useMemo(() => toISO(new Date()), []);
  const init = initialDate ?? today;
  const [viewDate, setViewDate] = useState(() => {
    const [y, m] = init.split('-').map(Number);
    return new Date(y, (m || 1) - 1, 1);
  });
  const [selected, setSelected] = useState<string>(init);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const ev of events) {
      const list = map.get(ev.date) ?? [];
      list.push(ev);
      map.set(ev.date, list);
    }
    return map;
  }, [events]);

  const matrix = useMemo(() => monthMatrix(viewDate), [viewDate]);

  const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const gotoToday = () => {
    const n = new Date();
    setViewDate(new Date(n.getFullYear(), n.getMonth(), 1));
    const iso = toISO(n);
    setSelected(iso);
    onDateSelect?.(iso);
  };

  const handleSelect = (d: Date) => {
    const iso = toISO(d);
    setSelected(iso);
    onDateSelect?.(iso);
  };

  return (
    <div className={styles.container} role="application" aria-label="Basic calendar">
      <div className={styles.header}>
        <button className={styles.navButton} onClick={prevMonth} aria-label="Previous month">&lsaquo;</button>
        <div className={styles.title}>{monthLabel(viewDate)}</div>
        <button className={styles.navButton} onClick={nextMonth} aria-label="Next month">&rsaquo;</button>
      </div>

      <div className={styles.controls}>
        <button className={styles.todayButton} onClick={gotoToday}>Today</button>
      </div>

      <div className={styles.grid} role="grid" aria-rowcount={6}>
        <div className={styles.weekNames} aria-hidden>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className={styles.dayName}>{d}</div>
          ))}
        </div>

        {matrix.map((week, wi) => (
          <div key={wi} className={styles.week} role="row">
            {week.map((dt, di) => {
              const iso = toISO(dt);
              const inMonth = dt.getMonth() === viewDate.getMonth();
              const isToday = iso === today;
              const isSelected = iso === selected;
              const ev = eventsByDate.get(iso);
              return (
                <button
                  key={di}
                  role="gridcell"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(dt)}
                  className={[
                    styles.day,
                    !inMonth ? styles.otherMonth : '',
                    isToday ? styles.today : '',
                    isSelected ? styles.selected : ''
                  ].join(' ')}
                >
                  <div className={styles.dayNumber}>{dt.getDate()}</div>
                  <div className={styles.eventRow}>
                    {ev?.slice(0,2).map((e, idx) => (
                      <span key={idx} className={styles.event} style={{ backgroundColor: e.color ?? '#2563eb' }} title={e.title}>
                        {e.title ? (e.title.length > 12 ? e.title.slice(0,12)+'…' : e.title) : ''}
                      </span>
                    ))}
                    {ev && ev.length > 2 && <span className={styles.more}>+{ev.length - 2}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicCalendar;