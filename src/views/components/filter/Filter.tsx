import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './filter.module.css';

export type FilterOption = { value: string; label: string };
export type FilterType = 'single' | 'multi' | 'daterange' | 'text';

export type FilterDefinition =
  | { id: string; type: 'single' | 'multi'; label: string; options: FilterOption[]; placeholder?: string }
  | { id: string; type: 'daterange'; label: string; fromPlaceholder?: string; toPlaceholder?: string }
  | { id: string; type: 'text'; label: string; placeholder?: string };

export type FilterValues = Record<string, any>;

interface GlobalFilterProps {
  definitions: FilterDefinition[];
  values?: FilterValues; // optional initial values
  onChange?: (values: FilterValues) => void;
  onApply?: (values: FilterValues) => void;
  onClear?: () => void;
  compact?: boolean;
}

/**
 * Reusable global filter component.
 * Supports:
 *  - single select (radio-like)
 *  - multi select (checkboxes)
 *  - date range (two native date inputs)
 *  - free text
 *
 * Accessibility:
 *  - keyboard navigable dropdowns
 *  - ARIA attributes for panels
 */
const GlobalFilter: React.FC<GlobalFilterProps> = ({ definitions = [], values = {}, onChange, onApply, onClear, compact = false }) => {
  // local working state
  const [local, setLocal] = useState<FilterValues>(() => {
    // normalize multi -> array; daterange -> {from,to}
    const init: FilterValues = {};
    // ensure definitions is an array before iterating
    const defs = Array.isArray(definitions) ? definitions : [];
    for (const def of defs) {
      if (values[def.id] !== undefined) init[def.id] = values[def.id];
      else if (def.type === 'multi') init[def.id] = [];
      else if (def.type === 'daterange') init[def.id] = { from: '', to: '' };
      else init[def.id] = '';
    }
    return init;
  });

  useEffect(() => {
    onChange?.(local);
  }, [local, onChange]);

  useEffect(() => {
    // if parent provides new values, merge them
    const merged: FilterValues = { ...local };
    for (const def of definitions) {
      if (values[def.id] !== undefined) merged[def.id] = values[def.id];
    }
    setLocal(merged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [definitions, JSON.stringify(values)]);

  const dropdownOpenRef = useRef<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        // close all
        dropdownOpenRef.current = {};
        // force rerender minimal
        setLocal(l => ({ ...l }));
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const toggleDropdown = (id: string) => {
    dropdownOpenRef.current[id] = !dropdownOpenRef.current[id];
    setLocal(l => ({ ...l }));
  };

  const isOpen = (id: string) => !!dropdownOpenRef.current[id];

  const updateValue = (id: string, next: any) => {
    setLocal(prev => {
      const n = { ...prev, [id]: next };
      return n;
    });
  };

  const handleOptionToggle = (id: string, option: string, multi: boolean) => {
    const cur = local[id];
    if (multi) {
      const nextArr = Array.isArray(cur) ? [...cur] : [];
      const idx = nextArr.indexOf(option);
      if (idx >= 0) nextArr.splice(idx, 1);
      else nextArr.push(option);
      updateValue(id, nextArr);
    } else {
      updateValue(id, option);
      dropdownOpenRef.current[id] = false;
      setLocal(l => ({ ...l }));
    }
  };

  const apply = () => {
    onApply?.(local);
  };

  const clearAll = () => {
    const cleared: FilterValues = {};
    for (const def of definitions) {
      if (def.type === 'multi') cleared[def.id] = [];
      else if (def.type === 'daterange') cleared[def.id] = { from: '', to: '' };
      else cleared[def.id] = '';
    }
    setLocal(cleared);
    onClear?.();
    onChange?.(cleared);
  };

  const renderedDefs = useMemo(() => definitions, [definitions]);

  return (
    <div ref={containerRef} className={[styles.container, compact ? styles.compact : ''].join(' ')} role="region" aria-label="Global filters">
      <div className={styles.row}>
        {renderedDefs.map(def => {
          if (def.type === 'text') {
            return (
              <div key={def.id} className={styles.field}>
                <label className={styles.label}>{def.label}</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={def.placeholder ?? 'Filter...'}
                  value={local[def.id] ?? ''}
                  onChange={e => updateValue(def.id, e.target.value)}
                  aria-label={def.label}
                />
              </div>
            );
          }

          if (def.type === 'daterange') {
            const cur = local[def.id] ?? { from: '', to: '' };
            return (
              <div key={def.id} className={styles.field}>
                <label className={styles.label}>{def.label}</label>
                <div className={styles.dateRow}>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={cur.from ?? ''}
                    onChange={e => updateValue(def.id, { ...cur, from: e.target.value })}
                    aria-label={`${def.label} from`}
                    placeholder={def.fromPlaceholder ?? 'From'}
                  />
                  <span className={styles.dateSep}>—</span>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={cur.to ?? ''}
                    onChange={e => updateValue(def.id, { ...cur, to: e.target.value })}
                    aria-label={`${def.label} to`}
                    placeholder={def.toPlaceholder ?? 'To'}
                  />
                </div>
              </div>
            );
          }

          // single or multi select -> dropdown
          const isMulti = def.type === 'multi';
          const curVal = local[def.id];
          const selectedText = isMulti
            ? Array.isArray(curVal) && curVal.length > 0 ? def.options.filter(o => curVal.includes(o.value)).map(o => o.label).join(', ') : ''
            : (def.options.find(o => o.value === curVal)?.label ?? '');

          return (
            <div key={def.id} className={styles.field}>
              <label className={styles.label}>{def.label}</label>
              <div className={styles.dropdownWrapper}>
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isOpen(def.id) ? 'true' : 'false'}
                  onClick={() => toggleDropdown(def.id)}
                  className={styles.dropdownButton}
                >
                  <span className={styles.selected}>{selectedText || (def as any).placeholder || 'Select'}</span>
                  <svg className={styles.chev} width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                </button>

                {isOpen(def.id) && (
                  <div
                    className={styles.pop}
                    role="listbox"
                    aria-label={def.label}
                    aria-multiselectable={isMulti ? true : undefined}
                  >
                    <div className={styles.options}>
                      {def.options.map(opt => {
                        const checked = isMulti ? Array.isArray(curVal) && curVal.includes(opt.value) : curVal === opt.value;
                        return (
                          <div
                            key={opt.value}
                            className={styles.option}
                            role="option"
                            aria-selected={checked ? true : false}
                            tabIndex={0}
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => handleOptionToggle(def.id, opt.value, isMulti)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleOptionToggle(def.id, opt.value, isMulti);
                              }
                            }}
                          >
                            <span className={styles.optionLabel}>{opt.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button className={styles.clearBtn} onClick={clearAll} type="button">Reset</button>
        <div className={styles.flexSpacer} />
        <button className={styles.applyBtn} onClick={apply} type="button">Apply</button>
      </div>
    </div>
  );
};

export default GlobalFilter;