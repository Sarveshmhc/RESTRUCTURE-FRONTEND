import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './dropdown.module.css';

export interface DropDownProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  placeholder?: string;
  variant?: 'select' | 'custom';
  customTrigger?: React.ReactNode; // Add support for custom trigger
}

const DropDown: React.FC<DropDownProps> = ({ 
  options, 
  onChange, 
  placeholder = "Select an option...",
  variant = 'select',
  value,
  customTrigger,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    onChange?.(optionValue);
  };

  if (variant === 'select') {
    return (
      <select 
        className={styles.dropdown} 
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          onChange?.(e.target.value);
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div className={styles.customDropdown} ref={dropdownRef}>
      <button
        type="button"
        className={`${styles.dropdownTrigger} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {customTrigger || (
          <>
            <span className={styles.selectedText}>
              {selectedOption?.label || placeholder}
            </span>
            <ChevronDown className={`${styles.chevronIcon} ${isOpen ? styles.rotated : ''}`} />
          </>
        )}
      </button>

      {isOpen && (
        <div
          className={styles.dropdownMenu}
          role="listbox"
          aria-label={placeholder || "Options"}
        >
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              className={`${styles.dropdownOption} ${option.value === selectedValue ? styles.selected : ''}`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={option.value === selectedValue ? true : false}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;