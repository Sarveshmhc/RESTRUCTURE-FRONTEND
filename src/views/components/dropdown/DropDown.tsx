import React, { useEffect, useRef, useState, useId, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./dropdown.module.css";

export type DropOption = {
  value: string;
  label: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  tags?: string[]; // optional tags to support filtering
};

export interface DropDownProps {
  options?: DropOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  variant?: "select" | "custom";
  customTrigger?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  maxHeight?: number;
  // new: optional simple filter chips - strings must match option.tags values
  filters?: { id: string; label: string }[];
  allowSearch?: boolean;
}

const KEY_NEXT = ["ArrowDown"];
const KEY_PREV = ["ArrowUp"];
const KEY_SELECT = ["Enter"];
const KEY_CLOSE = ["Escape", "Tab"];

export default function DropDown({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  variant = "custom",
  customTrigger,
  disabled = false,
  className = "",
  maxHeight = 300,
  filters = [],
  allowSearch = true,
}: DropDownProps) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [highlight, setHighlight] = useState<number>(-1);
  const [selectedValue, setSelectedValue] = useState<string>(value ?? "");
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => setSelectedValue(value ?? ""), [value]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (
        !menuRef.current ||
        !triggerRef.current ||
        (menuRef.current.contains(e.target as Node) || triggerRef.current.contains(e.target as Node))
      )
        return;
      setIsOpen(false);
      setHighlight(-1);
    }
    if (isOpen) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const idx = options.findIndex((o) => o.value === selectedValue);
    setHighlight(idx >= 0 ? idx : 0);
    // focus search input if present
    setTimeout(() => searchRef.current?.focus(), 0);
  }, [isOpen, options, selectedValue]);

  const openToggle = (next?: boolean) => {
    if (disabled) return;
    setIsOpen((v) => (typeof next === "boolean" ? next : !v));
  };

  const commit = (opt: DropOption) => {
    setSelectedValue(opt.value);
    onChange?.(opt.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (KEY_NEXT.includes(e.key) || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const onMenuKey = (e: React.KeyboardEvent) => {
    if (KEY_NEXT.includes(e.key)) {
      e.preventDefault();
      setHighlight((h) => Math.min(filtered.length - 1, Math.max(0, h + 1)));
      scrollToHighlighted();
    } else if (KEY_PREV.includes(e.key)) {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
      scrollToHighlighted();
    } else if (KEY_SELECT.includes(e.key)) {
      e.preventDefault();
      if (filtered[highlight]) commit(filtered[highlight]);
    } else if (KEY_CLOSE.includes(e.key)) {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  const scrollToHighlighted = () => {
    const menu = menuRef.current;
    if (!menu) return;
    const el = menu.querySelectorAll<HTMLButtonElement>("button[data-index]")[highlight] as HTMLButtonElement | undefined;
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  // filter options by query and activeFilters (tags)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter((o) => {
      if (q) {
        const label = String(o.label).toLowerCase();
        const desc = (o.description ?? "").toLowerCase();
        if (!label.includes(q) && !desc.includes(q) && !String(o.value).toLowerCase().includes(q)) return false;
      }
      if (activeFilters.length > 0) {
        if (!o.tags || !activeFilters.every((f) => o.tags?.includes(f))) return false;
      }
      return true;
    });
  }, [options, query, activeFilters]);

  // simple select fallback
  if (variant === "select") {
    return (
      <select
        className={`${styles.dropdown} ${className}`}
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          onChange?.(e.target.value);
        }}
        disabled={disabled}
        aria-label={placeholder}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  const selectedOption = options.find((o) => o.value === selectedValue);

  const toggleFilter = (idFilter: string) => {
    setActiveFilters((prev) => (prev.includes(idFilter) ? prev.filter((p) => p !== idFilter) : [...prev, idFilter]));
  };

  return (
    <div className={`${styles.customDropdown} ${className}`} >
      <button
        type="button"
        ref={triggerRef}
        className={`${styles.dropdownTrigger} ${isOpen ? styles.open : ""} ${disabled ? styles.disabled : ""}`}
        onClick={() => openToggle()}
        onKeyDown={onTriggerKey}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`dropdown-${id}`}
        disabled={disabled}
      >
        <span className={styles.selectedText}>{selectedOption?.label ?? placeholder}</span>
        <ChevronDown className={`${styles.chevronIcon} ${isOpen ? styles.rotated : ""}`} />
      </button>

      {isOpen && (
        <div
          id={`dropdown-${id}`}
          ref={menuRef}
          className={styles.dropdownMenu}
          role="listbox"
          tabIndex={0}
          aria-activedescendant={highlight >= 0 ? `opt-${id}-${highlight}` : undefined}
          style={{ maxHeight }}
          onKeyDown={onMenuKey}
        >
          {allowSearch && (
            <div className={styles.menuSearch}>
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className={styles.menuSearchInput}
                aria-label="Filter options"
              />
            </div>
          )}

          {filters.length > 0 && (
            <div className={styles.filters} role="toolbar" aria-label="Filter options">
              {filters.map((f) => {
                const active = activeFilters.includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={active}
                    className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                    onClick={() => toggleFilter(f.id)}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className={styles.optionsWrap}>
            {filtered.length === 0 ? (
              <div className={styles.empty}>No results</div>
            ) : (
              filtered.map((opt, i) => {
                const sel = opt.value === selectedValue;
                const act = i === highlight;
                return (
                  <button
                    key={opt.value}
                    id={`opt-${id}-${i}`}
                    data-index={i}
                    type="button"
                    role="option"
                    aria-selected={sel}
                    className={`${styles.dropdownOption} ${sel ? styles.selected : ""} ${act ? styles.itemActive : ""}`}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => commit(opt)}
                  >
                    {opt.icon ? <span className={styles.optIcon}>{opt.icon}</span> : null}
                    <div className={styles.optBody}>
                      <div className={styles.optLabel}>{opt.label}</div>
                      {opt.description ? <div className={styles.optDesc}>{opt.description}</div> : null}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}