import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'glass-btn text-black hover:text-black hover:bg-white/20 hover:-translate-y-1',
    secondary: 'bg-white/8 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white/12 rounded-lg',
    ghost: 'bg-transparent text-black hover:bg-black/10 rounded-lg',
    destructive: 'bg-error/20 border border-error/40 text-error-700 hover:bg-error/30 rounded-lg backdrop-blur-sm',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2
          className="mr-2 animate-spin"
          size={size === 'sm' ? 16 : size === 'md' ? 18 : 20}
        />
      )}
      {children}
    </button>
  );
};

export default Button;
export { Button };