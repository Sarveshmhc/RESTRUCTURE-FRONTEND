import React from 'react';
import styles from './avatar.module.css';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Avatar', size = 40 }) => {
  const sizeClass =
    size === 40
      ? styles.avatar40
      : size === 60
      ? styles.avatar60
      : size === 80
      ? styles.avatar80
      : '';

  return (
    <img
      className={`${styles.avatar} ${sizeClass}`}
      src={src || '/default-avatar.png'}
      alt={alt}
    />
  );
};

export default Avatar;