import React from 'react';

interface BrandMarkProps {
  size?: number;
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({size = 36, className = ''}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <rect width="64" height="64" rx="16" fill="#0F5132" />
    <rect x="26.5" y="13" width="11" height="38" rx="3" fill="#FFFFFF" />
    <rect x="13" y="26.5" width="38" height="11" rx="3" fill="#FFFFFF" />
    <path
      d="M36.5 27C42.5 21 49.5 19 49.5 19C49.5 19 48 27 42 32.5C38.5 35.5 34.5 35.8 32 34.5C32.8 31.8 34 29.5 36.5 27Z"
      fill="#22C55E"
    />
    <path
      d="M33.2 33.5C37.2 29.5 42.5 24.8 46.8 22"
      stroke="#0F5132"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
