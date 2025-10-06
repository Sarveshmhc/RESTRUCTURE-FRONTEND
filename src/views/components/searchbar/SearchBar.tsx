import React from 'react';
import styled from 'styled-components';

export interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => (
  <StyledWrapper>
    <div className="group">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon">
        <g>
          <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
        </g>
      </svg>
      <input
        id="query"
        className="input"
        type="search"
        placeholder={placeholder || "Search..."}
        name="searchbar"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  </StyledWrapper>
);

const StyledWrapper = styled.div`
  .group {
    display: flex;
    line-height: 28px;
    align-items: center;
    position: relative;
    width: 100%;
  }

  .input {
    font-family: var(--font-primary, "Inter", sans-serif);
    width: 100%;
    height: 45px;
    padding-left: 2.5rem;
    padding-right: 1rem;
    border: 1px solid var(--search-border, #e2e8f0);
    border-radius: 12px;
    background-color: var(--search-bg, #f8fafc);
    outline: none;
    color: var(--search-text, #1e293b);
    font-size: 0.875rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, color 0.2s ease;
    cursor: text;
    z-index: 0;
  }

  .input::placeholder {
    color: var(--search-placeholder, #94a3b8);
  }

  .input:hover {
    border-color: var(--search-border-hover, #cbd5e1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .input:focus {
    border-color: var(--search-border-focus, #3b82f6);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .search-icon {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    fill: var(--search-placeholder, #94a3b8);
    width: 1rem;
    height: 1rem;
    pointer-events: none;
    z-index: 1;
  }

  /* Dark theme styles */
  [data-theme="dark"] & {
    .input {
      background-color: var(--search-bg, #334155);
      border-color: var(--search-border, #475569);
      color: var(--search-text, #f1f5f9);
    }

    .input::placeholder {
      color: var(--search-placeholder, #94a3b8);
    }

    .input:hover {
      border-color: var(--search-border-hover, #64748b);
    }

    .input:focus {
      border-color: var(--search-border-focus, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .search-icon {
      fill: var(--search-placeholder, #94a3b8);
    }
  }
`;

export default SearchBar;