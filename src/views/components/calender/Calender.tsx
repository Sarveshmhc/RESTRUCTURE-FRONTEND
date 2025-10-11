import React, { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  X,
} from "lucide-react";
import styles from "./calender.module.css";

/**
 * HRScheduleCalendar
 * - Small, self-contained HR-facing monthly calendar used on the HR home page.
 * - Shows month grid, marks days with events, provides event list and quick add modal.
 * - Accessible (keyboard nav where applicable) and animated (framer-motion).
 *
 * Usage:
 * import HRScheduleCalendar from "src/components/HRScheduleCalendar/HRScheduleCalendar";
 * <HRScheduleCalendar onOpenEvent={(e) => ...} onCreateEvent={(e) => ...} />
 *
 * References:
 * - Example Schedule component in repo: [src/components/ScheduleComponent.tsx](c:\Users\sarxx\Downloads\front\src\components\ScheduleComponent.tsx)
 */

export type HRCalendarEvent = {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO "YYYY-MM-DD"
  start?: string; // "09:00"
  end?: string; // "10:00"
  color?: string;
};

type Props = {
  initialEvents?: HRCalendarEvent[];
  onOpenEvent?: (ev: HRCalendarEvent) => void;
  onCreateEvent?: (ev: HRCalendarEvent) => void;
  className?: string;
};

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}
function isoDate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const sampleEvents: HRCalendarEvent[] = [
  { id: "e1", title: "All-hands meeting", date: isoDate(new Date()), start: "11:00", end: "12:00", color: "#4f7cf3" },
  { id: "e2", title: "Payroll cut-off", date: isoDate(new Date(new Date().setDate(new Date().getDate() + 2))), color: "#ef4444" },
  { id: "e3", title: "Onboarding - Maya", date: isoDate(new Date(new Date().setDate(new Date().getDate() + 5))), start: "09:30", color: "#10b981" },
];

const HRScheduleCalendar: React.FC<Props> = ({ initialEvents = sampleEvents, onOpenEvent, onCreateEvent, className = "" }) => {
  const [today] = useState(() => new Date());
  const [focusDate, setFocusDate] = useState<Date>(() => startOfMonth(today));
  const [events, setEvents] = useState<HRCalendarEvent[]>(initialEvents);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftTime, setDraftTime] = useState("");
  const [draftDate, setDraftDate] = useState<string | undefined>(undefined);
  const monthStart = useMemo(() => startOfMonth(focusDate), [focusDate]);
  const monthEnd = useMemo(() => endOfMonth(focusDate), [focusDate]);

  const daysMatrix = useMemo(() => {
    // create array of Date objects representing the calendar grid (6 rows x 7 cols)
    const firstDayIdx = monthStart.getDay(); // 0 = Sunday
    const daysInMonth = monthEnd.getDate();
    const prevMonthLast = new Date(monthStart.getFullYear(), monthStart.getMonth(), 0).getDate();

    const matrix: { date: Date; inMonth: boolean }[] = [];
    // previous month's tail
    for (let i = firstDayIdx - 1; i >= 0; i--) {
      matrix.push({ date: new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, prevMonthLast - i), inMonth: false });
    }
    // current month
    for (let d = 1; d <= daysInMonth; d++) {
      matrix.push({ date: new Date(monthStart.getFullYear(), monthStart.getMonth(), d), inMonth: true });
    }
    // next month fill
    let nextDay = 1;
    while (matrix.length % 7 !== 0) {
      matrix.push({ date: new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, nextDay++), inMonth: false });
    }
    // ensure 6 rows (42 cells) for consistent height
    while (matrix.length < 42) {
      const last = matrix[matrix.length - 1].date;
      const next = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
      matrix.push({ date: next, inMonth: false });
    }
    return matrix;
  }, [monthStart, monthEnd]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, HRCalendarEvent[]>();
    for (const ev of events) {
      const arr = map.get(ev.date) ?? [];
      arr.push(ev);
      map.set(ev.date, arr);
    }
    return map;
  }, [events]);

  const goMonth = useCallback((dir: -1 | 1) => {
    setFocusDate((d) => new Date(d.getFullYear(), d.getMonth() + dir, 1));
  }, []);

  const goToday = useCallback(() => setFocusDate(startOfMonth(new Date())), []);

  const openDay = (d: Date) => {
    const iso = isoDate(d);
    setSelectedDay(iso);
  };

  const closeDetails = () => setSelectedDay(null);

  const openCreateFor = (d?: string) => {
    setDraftDate(d);
    setDraftTitle("");
    setDraftTime("");
    setShowCreate(true);
  };
  const closeCreate = () => setShowCreate(false);

  const handleCreate = () => {
    if (!draftTitle || !draftDate) return;
    const newEvent: HRCalendarEvent = {
      id: `ev-${Date.now()}`,
      title: draftTitle,
      date: draftDate,
      start: draftTime || undefined,
      color: "#4f7cf3",
    };
    setEvents((s) => [newEvent, ...s]);
    onCreateEvent?.(newEvent);
    setShowCreate(false);
    setSelectedDay(draftDate);
  };

  const handleOpenEvent = (ev: HRCalendarEvent) => {
    onOpenEvent?.(ev);
  };

  return (
    <div className={`${styles.container} ${className}`} role="region" aria-label="HR schedule calendar">
      <div className={styles.header}>
        <div className={styles.left}>
          <CalendarIcon className={styles.calIcon} />
          <div>
            <div className={styles.monthTitle}>
              {focusDate.toLocaleString(undefined, { month: "long", year: "numeric" })}
            </div>
            <div className={styles.sub}>HR schedule & events</div>
          </div>
        </div>

        <div className={styles.controls}>
          <button className={styles.iconBtn} onClick={() => goMonth(-1)} aria-label="Previous month">
            <ChevronLeft />
          </button>
          <button className={styles.iconBtn} onClick={() => goToday()} aria-label="Go to current month">
            Today
          </button>
          <button className={styles.iconBtn} onClick={() => goMonth(1)} aria-label="Next month">
            <ChevronRight />
          </button>
          <button className={styles.addBtn} onClick={() => openCreateFor(isoDate(today))} aria-label="Add event">
            <Plus /> Add
          </button>
        </div>
      </div>

      <div className={styles.calendarWrap}>
        <div className={styles.grid}>
          <div className={styles.weekdays}>
            {weekdayNames.map((w) => (
              <div key={w} className={styles.weekday}>
                {w}
              </div>
            ))}
          </div>

          <div className={styles.cells}>
            {daysMatrix.map(({ date, inMonth }) => {
              const iso = isoDate(date);
              const isToday = iso === isoDate(today);
              const evs = eventsByDate.get(iso) ?? [];
              return (
                <button
                  key={iso}
                  className={`${styles.cell} ${!inMonth ? styles.outside : ""} ${isToday ? styles.today : ""}`}
                  onClick={() => openDay(date)}
                  aria-label={`Day ${date.getDate()}${evs.length ? `, ${evs.length} events` : ""}`}
                >
                  <div className={styles.cellTop}>
                    <span className={styles.dateNum}>{date.getDate()}</span>
                    {evs.length > 0 && <span className={styles.eventCount}>{evs.length}</span>}
                  </div>

                  <div className={styles.dotRow} aria-hidden>
                    {evs.slice(0, 3).map((e) => (
                      <span key={e.id} className={styles.eventDot} style={{ background: e.color ?? "#4f7cf3" }} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.side}>
          <div className={styles.sideHeader}>
            <div className={styles.sideTitle}>
              {selectedDay ? new Date(selectedDay).toLocaleDateString() : "Select a day"}
            </div>

            <div className={styles.sideActions}>
              <button className={styles.textBtn} onClick={() => openCreateFor(selectedDay ?? isoDate(today))}>
                + Event
              </button>
              {selectedDay && (
                <button className={styles.iconOnly} onClick={closeDetails} aria-label="Close details">
                  <X />
                </button>
              )}
            </div>
          </div>

          <div className={styles.eventList}>
            {(selectedDay ? eventsByDate.get(selectedDay) ?? [] : events.filter((e) => {
              // show events in visible month when no day selected
              const d = new Date(e.date);
              return d.getFullYear() === focusDate.getFullYear() && d.getMonth() === focusDate.getMonth();
            })).map((ev) => (
              <motion.button
                key={ev.id}
                className={styles.eventItem}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleOpenEvent(ev)}
                title={ev.title}
              >
                <div className={styles.eventLeft}>
                  <span className={styles.eventBadge} style={{ background: ev.color ?? "#4f7cf3" }} />
                  <div className={styles.eventInfo}>
                    <div className={styles.eventTitle}>{ev.title}</div>
                    <div className={styles.eventMeta}>
                      <Clock className={styles.iconSmall} />
                      <span>{ev.start ? `${ev.start}${ev.end ? ` • ${ev.end}` : ""}` : "All day"}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.eventDate}>
                  {new Date(ev.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </div>
              </motion.button>
            ))}
            { (selectedDay ? (eventsByDate.get(selectedDay) ?? []).length === 0 : events.filter((e)=> {
              const d = new Date(e.date);
              return d.getFullYear() === focusDate.getFullYear() && d.getMonth() === focusDate.getMonth();
            }).length === 0) && <div className={styles.empty}>No events</div>}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div className={styles.modalWrap} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={styles.backdrop} onClick={closeCreate} />
            <motion.div className={styles.modal} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>Create event</div>
                <button className={styles.iconOnly} onClick={closeCreate} aria-label="Close">
                  <X />
                </button>
              </div>

              <div className={styles.modalBody}>
                <label className={styles.label}>Title</label>
                <input className={styles.input} value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />

                <label className={styles.label}>Date</label>
                <input
                  className={styles.input}
                  type="date"
                  value={draftDate ?? isoDate(today)}
                  onChange={(e) => setDraftDate(e.target.value)}
                />

                <label className={styles.label}>Time (optional)</label>
                <input className={styles.input} type="time" value={draftTime} onChange={(e) => setDraftTime(e.target.value)} />
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.ghostBtn} onClick={closeCreate}>Cancel</button>
                <button className={styles.primaryBtn} onClick={handleCreate} disabled={!draftTitle || !draftDate}>Create</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HRScheduleCalendar;