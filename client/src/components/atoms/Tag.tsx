import React from 'react';

export interface TagProps {
  text: string;
  color?: 'neutral' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ text, color = 'neutral', className = '' }) => {
  return <span className={`badge badge-${color} ${className}`.trim()}>{text}</span>;
};

export default Tag;
