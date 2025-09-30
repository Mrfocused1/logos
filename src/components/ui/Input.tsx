import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'error';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, variant = 'default', className = '', ...props }, ref) => {
    const hasError = error || variant === 'error';

    const inputClasses = `
      glass-input
      ${hasError ? 'border-error focus:ring-error/20' : 'focus:border-primary focus:ring-primary/20'}
      ${className}
    `;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />

        {(error || helperText) && (
          <p className={`mt-1 text-xs ${error ? 'text-error' : 'text-gray-600'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;