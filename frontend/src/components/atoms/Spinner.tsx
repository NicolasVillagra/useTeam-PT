import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClass: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'loading-sm',
  md: 'loading-md',
  lg: 'loading-lg',
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  return <span className={`loading loading-spinner ${sizeClass[size]} ${className}`.trim()} />;
};

export default Spinner;
