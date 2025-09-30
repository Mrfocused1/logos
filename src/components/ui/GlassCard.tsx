import React from 'react';
import type { ReactNode, HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'strong' | 'subtle';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-3xl transition-all duration-300';

  const variantClasses = {
    default: 'glass',
    strong: 'glass-strong',
    subtle: 'glass-subtle',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hover
    ? 'hover:-translate-y-2 hover:shadow-purple-glow cursor-pointer'
    : '';

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

export default GlassCard;