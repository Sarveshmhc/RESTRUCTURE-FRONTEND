import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import styles from "./quickactions.module.css";
import { getQuickActions, QuickAction } from "./Quickactionsutils";

const QUICK_ACTIONS_KEY = "customQuickActionsV2";

/**
 * QuickActions
 * - Shows a compact grid of quick action buttons (icons + label)
 * - "Customize" button opens modal where user can enable/disable and reorder actions
 * - Persists selection & order to localStorage (QUICK_ACTIONS_KEY)
 * - Use onNavigate(path) prop to integrate with react-router, otherwise falls back to window.location
 */
type Props = {
  maxVisible?: number;
  onNavigate?: (path: string) => void;
  className?: string;
};

const QuickActions: React.FC<Props> = ({ maxVisible = 6, onNavigate, className = "" }) => {
  const allActions = useMemo<QuickAction[]>(() => getQuickActions(), []);
  const allTitles = useMemo(() => allActions.map((a) => a.title), [allActions]);

  const [customOrder, setCustomOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem(QUICK_ACTIONS_KEY);
    if (!saved) return allTitles.slice(0, maxVisible);
    try {
      const parsed = JSON.parse(saved) as string[];
      // ensure we include any new actions and maintain order
      const missing = allTitles.filter((t) => !parsed.includes(t));
      return [...parsed.filter((t) => allTitles.includes(t)), ...missing];
    } catch {
      return allTitles.slice(0, maxVisible);
    }
  });
  const [selectedSet, setSelectedSet] = useState<Set<string>>(() => new Set(customOrder.slice(0, maxVisible)));
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // keep selected in sync if order changes externally
    setSelectedSet((prev) => {
      const next = new Set(prev);
      const valid = allTitles;
      for (const s of Array.from(next)) if (!valid.includes(s)) next.delete(s);
      return next;
    });
  }, [allTitles]);

  const visibleActions = useMemo(() => {
    // filter actions by selectedSet and customOrder order
    const selected = customOrder.filter((t) => selectedSet.has(t));
    return selected
      .map((title) => allActions.find((a) => a.title === title))
      .filter(Boolean) as QuickAction[];
  }, [customOrder, selectedSet, allActions]);

  const handleNavigate = (path: string) => {
    if (onNavigate) onNavigate(path);
    else window.location.href = path;
  };

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const toggleSelect = (title: string) => {
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const move = (idx: number, dir: -1 | 1) => {
    setCustomOrder((prev) => {
      const arr = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= arr.length) return arr;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return arr;
    });
  };

  const handleSave = () => {
    const toSave = customOrder;
    localStorage.setItem(QUICK_ACTIONS_KEY, JSON.stringify(toSave));
    // ensure selectedSet trimmed to available items (optional)
    setShowModal(false);
  };

  const handleReset = () => {
    const defaultOrder = allTitles.slice(0, Math.max(6, Math.min(12, allTitles.length)));
    setCustomOrder(defaultOrder);
    setSelectedSet(new Set(defaultOrder.slice(0, maxVisible)));
  };

  return (
    <>
      <div className={`${styles.container} ${className}`}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>Quick Actions</h3>
            <p className={styles.subtitle}>Shortcuts to common pages</p>
          </div>

          <div className={styles.actions}>
            <button className={styles.iconBtn} onClick={openModal} aria-label="Customize quick actions" title="Customize">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          {visibleActions.length === 0 ? (
            <div className={styles.empty}>No quick actions selected.</div>
          ) : (
            visibleActions.map((a) => (
              <motion.button
                key={a.title}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={styles.actionBtn}
                onClick={() => handleNavigate(a.path)}
                title={a.title}
              >
                <span className={styles.iconWrap}>
                  {a.icon ? <a.icon className={styles.icon} /> : <span className={styles.fallbackIcon}>🔗</span>}
                </span>
                <span className={styles.label}>{a.title}</span>
              </motion.button>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className={styles.modalWrap} role="dialog" aria-modal="true" aria-label="Customize quick actions">
          <div className={styles.modalBackdrop} onClick={closeModal} />

          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <div className={styles.modalHeader}>
              <h4 className={styles.modalTitle}>Customize Quick Actions</h4>
              <button className={styles.closeBtn} onClick={closeModal} aria-label="Close">
                <X />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.instructions}>Toggle actions and reorder to fit your workflow. Changes persist to this browser.</div>

              <div className={styles.list}>
                {customOrder.map((title, idx) => {
                  const action = allActions.find((a) => a.title === title);
                  if (!action) return null;
                  const isSelected = selectedSet.has(title);
                  return (
                    <div key={title} className={styles.listItem}>
                      <div className={styles.listLeft}>
                        <input
                          id={`qa-${idx}`}
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(title)}
                          className={styles.checkbox}
                          aria-labelledby={`qa-label-${idx}`}
                        />
                        <label
                          htmlFor={`qa-${idx}`}
                          id={`qa-label-${idx}`}
                          className={styles.visuallyHidden}
                        >
                          {title}
                        </label>
                        <div className={styles.listMeta}>
                          <div className={styles.itemLabel}>{title}</div>
                          <div className={styles.itemPath}>{action.path}</div>
                        </div>
                      </div>

                      <div className={styles.listRight}>
                        <button
                          className={styles.smallBtn}
                          onClick={() => move(idx, -1)}
                          aria-label={`Move ${title} up`}
                          disabled={idx === 0}
                        >
                          <ChevronUp />
                        </button>
                        <button
                          className={styles.smallBtn}
                          onClick={() => move(idx, 1)}
                          aria-label={`Move ${title} down`}
                          disabled={idx === customOrder.length - 1}
                        >
                          <ChevronDown />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.footerLeft}>
                <button className={styles.ghostBtn} onClick={handleReset}>Reset</button>
              </div>

              <div className={styles.footerRight}>
                <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                <button className={styles.saveBtn} onClick={handleSave}>Save</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default QuickActions;