import React from 'react';
import styles from './breadcrumbs.module.css';

export interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => (
  <nav className={styles.breadcrumbs}>
    {items.map((item, i) => (
      <span key={i}>
        {item.href ? <a href={item.href}>{item.label}</a> : item.label}
        {i < items.length - 1 && <span className={styles.sep}>/</span>}
      </span>
    ))}
  </nav>
);

export default Breadcrumbs;