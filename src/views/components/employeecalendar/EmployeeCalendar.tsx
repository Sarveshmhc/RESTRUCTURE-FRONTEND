import React, { useMemo, useState } from 'react';
import styles from './employeecalendar.module.css';

export type EmployeeEvent = {
  id: string;
  date: string; // ISO YYYY-MM-DD (event day)
  start?: string;
  end?: string;
  title: string;
  employeeName: string;
  avatarUrl?: string;
  color?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
};

interface EmployeeCalendarProps {
  events?: EmployeeEvent[];
  initialDate?: string;
  onDateSelect?: (isoDate: string) => void;
  onEventClick?: (ev: EmployeeEvent) => void;
}

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addDays(d: Date, days: number) {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n;
}
function monthMatrix(baseDate: Date) {
  const start = startOfMonth(baseDate);
  const startDay = start.getDay();
  const firstCell = addDays(start, -startDay);
  const matrix: Date[][] = [];
  let cursor = firstCell;
  for (let w = 0; w < 6; w++) {
    const row: Date[] = [];
    for (let d = 0; d < 7; d++) {
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

const EmployeeCalendar: React.FC<EmployeeCalendarProps> = ({
  events = [], 
  initialDate,
  onDateSelect,
  onEventClick,
}) => {
  // defensive: ensure events is always an array
  const safeEvents = Array.isArray(events) ? events : [];

  const todayISO = useMemo(() => toISO(new Date()), []);
  const initISO = initialDate ?? todayISO;
  const [viewDate, setViewDate] = useState(() => {
    const [y, m] = initISO.split('-').map(Number);
    return new Date(y, (m || 1) - 1, 1);
  });
  const [selected, setSelected] = useState<string>(initISO);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EmployeeEvent[]>();
    for (const ev of safeEvents) {
      const list = map.get(ev.date) ?? [];
      list.push(ev);
      map.set(ev.date, list);
    }
    // sort by start time for display
    for (const [k, list] of map.entries()) {
      list.sort((a, b) => (a.start ?? '').localeCompare(b.start ?? ''));
      map.set(k, list);
    }
    return map;
  }, [safeEvents]);

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

  const handleSelectDay = (d: Date) => {
    const iso = toISO(d);
    setSelected(iso);
    onDateSelect?.(iso);
  };

  return (
    <div className={styles.container} role="application" aria-label="Employee calendar">
      <div className={styles.header}>
        <button aria-label="Previous month" className={styles.nav} onClick={prevMonth}>‹</button>
        <div className={styles.title} tabIndex={0} aria-live="polite">{monthLabel(viewDate)}</div>
        <button aria-label="Next month" className={styles.nav} onClick={nextMonth}>›</button>
      </div>

      <div className={styles.controls}>
        <button className={styles.today} onClick={gotoToday}>Today</button>
      </div>

      <div className={styles.weekNames} aria-hidden>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
          <div key={d} className={styles.weekName}>{d}</div>
        ))}
      </div>

      <div className={styles.grid} role="grid">
        {matrix.map((week, wi) => (
          <div key={wi} className={styles.week} role="row">
            {week.map((dt, di) => {
              const iso = toISO(dt);
              const inMonth = dt.getMonth() === viewDate.getMonth();
              const isToday = iso === todayISO;
              const isSelected = iso === selected;
              const dayEvents = eventsByDate.get(iso) ?? [];
              return (
                <button
                  key={di}
                  type="button"
                  className={[
                    styles.day,
                    !inMonth ? styles.otherMonth : '',
                    isToday ? styles.today : '',
                    isSelected ? styles.selected : ''
                  ].join(' ')}
                  onClick={() => handleSelectDay(dt)}
                  {...(inMonth ? { 'aria-selected': isSelected } : {})}
                  role="gridcell"
                  tabIndex={0}
                >
                  <div className={styles.dayHeader}>
                    <div className={styles.dayNumber}>{dt.getDate()}</div>
                    <div className={styles.eventCount}>{dayEvents.length > 0 ? `${dayEvents.length}` : ''}</div>
                  </div>

                  <div className={styles.eventList}>
                    {dayEvents.slice(0,3).map(ev => (
                      // changed from <button> to accessible <div> to avoid nested button error
                      <div
                        key={ev.id}
                        className={[
                          styles.eventItem,
                          ev.color ? styles[`eventColor_${ev.color.replace('#', '')}`] : styles.eventColor_default
                        ].join(' ')}
                        onClick={(e) => { e.stopPropagation(); onEventClick?.(ev); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            onEventClick?.(ev);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        title={`${ev.title} — ${ev.employeeName}${ev.start ? ' • ' + ev.start : ''}`}
                        aria-label={`${ev.title} by ${ev.employeeName}`}
                      >
                        <div className={styles.avatarWrap}>
                          {ev.avatarUrl ? (
                            <img src={ev.avatarUrl} alt={ev.employeeName} className={styles.avatar} />
                          ) : (
                            <div className={styles.initials}>
                              {ev.employeeName.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className={styles.eventMeta}>
                          <div className={styles.eventTitle}>{ev.title}</div>
                          <div className={styles.eventSub}>{ev.employeeName}{ev.start ? ` • ${ev.start}` : ''}</div>
                        </div>
                        <div className={[styles.status, ev.status ? styles[ev.status] : ''].join(' ')} />
                      </div>
                    ))}

                    {dayEvents.length > 3 && (
                      <div className={styles.moreLine}>+{dayEvents.length - 3} more</div>
                    )}
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

export default EmployeeCalendar;