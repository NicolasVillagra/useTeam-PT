import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <label className="form-control w-full">
      {label && <span className="label-text mb-1">{label}</span>}
      <input className={`input input-bordered w-full ${className}`.trim()} {...props} />
      {error && <span className="text-error text-sm mt-1">{error}</span>}
    </label>
  );
};

export default Input;
