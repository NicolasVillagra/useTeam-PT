import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
}

const variantClass: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost: 'btn btn-ghost',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      className={`${variantClass[variant]} ${loading ? 'btn-loading' : ''} ${className}`.trim()}
      disabled={loading || props.disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
