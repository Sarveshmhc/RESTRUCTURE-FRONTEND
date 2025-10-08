import React, { useRef, useState, useEffect } from "react";
import styles from "./searchbar.module.css";
import { Search, X, Sun, Moon, Clock } from "lucide-react";
import { useThemeStore } from "../../contexts/ThemeStore";
import { useNavigate } from "react-router-dom";


export interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  showThemeToggle?: boolean;
  onNavigate?: (path: string) => void;
  menuItems?: { label: string; path: string; icon?: React.ComponentType<any> }[];
  maxResults?: number;
}

const RECENT_KEY = "recent_global_search";

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  showThemeToggle = false,
  onNavigate,
  menuItems = [],
  maxResults = 8,
}) => {
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<typeof menuItems>([]);
  const [active, setActive] = useState<number>(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (!value.trim()) {
      setResults([]);
      setActive(-1);
      return;
    }
    const q = value.toLowerCase();
    const filtered = menuItems.filter(
      s =>
        s.label.toLowerCase().includes(q) ||
        (s.path || "").toLowerCase().includes(q)
    );
    setResults(filtered.slice(0, maxResults));
    setActive(-1);
  }, [value, menuItems, maxResults]);

  const updatePos = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const top = r.bottom + window.scrollY + 8;
    const left = Math.max(8, r.left + window.scrollX);
    setDropdownRect({ top, left, width: Math.min(r.width, window.innerWidth - left - 8) });
  };

  useEffect(() => {
    if (open) {
      updatePos();
      window.addEventListener("resize", updatePos);
      window.addEventListener("scroll", updatePos, true);
      return () => {
        window.removeEventListener("resize", updatePos);
        window.removeEventListener("scroll", updatePos, true);
      };
    }
  }, [open]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && active < results.length) select(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  const select = (item: { label: string; path: string }) => {
    try {
      const newRecent = [item.label, ...recent.filter(r => r !== item.label)].slice(0, 6);
      setRecent(newRecent);
      localStorage.setItem(RECENT_KEY, JSON.stringify(newRecent));
    } catch {}
    onChange("");
    setOpen(false);
    setActive(-1);
    if (onNavigate) onNavigate(item.path);
    else navigate(item.path);
  };

  const clickOutsideHandler = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
  };

  useEffect(() => {
    if (open) document.addEventListener("mousedown", clickOutsideHandler);
    return () => document.removeEventListener("mousedown", clickOutsideHandler);
  }, [open]);

  return (
    <div ref={ref} className={styles.root}>
      <div className={styles.inputWrap}>
        
        <Search className={styles.searchIcon} />
        <input
          aria-label="Search"
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => { setOpen(true); updatePos(); }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={styles.input}
        />
        {value && (
          <button aria-label="Clear search" className={styles.clearBtn} onClick={() => onChange("")}>
            <X className={styles.clearIcon} />
          </button>
        )}
        {showThemeToggle && (
          <button aria-label="Toggle theme" className={styles.toggleBtn} onClick={toggleTheme}>
            {isDark ? <Sun className={styles.toggleIcon} /> : <Moon className={styles.toggleIcon} />}
          </button>
        )}
      </div>

      {open && (results.length > 0 || recent.length > 0) && typeof document !== "undefined" && (
        <div
          className={styles.dropdown}
          style={{ top: dropdownRect.top, left: dropdownRect.left, width: dropdownRect.width, zIndex: 99999, position: "absolute" }}
        >
          {results.length > 0 ? (
            <div>
              <div className={styles.sectionHeader}>Search Results</div>
              {results.map((r, idx) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.path + idx}
                    onClick={() => select(r)}
                    onMouseEnter={() => setActive(idx)}
                    className={`${styles.item} ${active === idx ? styles.itemActive : ""}`}
                  >
                    {Icon ? <Icon className={styles.itemIcon} /> : <span className={styles.itemIconPlaceholder} />}
                    <div className={styles.itemLabel}>{r.label}</div>
                    <div className={styles.itemMeta}>{r.path}</div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <div className={styles.sectionHeader}>Recent</div>
              {recent.map((r, i) => (
                <button key={r + i} className={styles.recentItem} onClick={() => {
                  const match = menuItems.find(s => s.label === r);
                  if (match) select(match);
                  else onChange(r);
                }}>
                  <Clock className={styles.recentIcon} />
                  <div className={styles.itemLabel}>{r}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

