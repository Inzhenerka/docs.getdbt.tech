import React from 'react';

export function ChevronDownIcon({ size = 12, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <polyline points="6,9 12,15 18,9"></polyline>
    </svg>
  );
}
