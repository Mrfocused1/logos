import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'skeleton';
  className?: string;
  fullscreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  className = '',
  fullscreen = false,
}) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  if (variant === 'spinner') {
    const spinnerElement = (
      <div className={`flex items-center justify-center ${className}`}>
        <Loader2
          size={sizeMap[size]}
          className="animate-spin text-primary"
        />
      </div>
    );

    if (fullscreen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          {spinnerElement}
        </div>
      );
    }

    return spinnerElement;
  }

  // Skeleton variant
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white/20 rounded-xl h-4 w-full mb-2"></div>
      <div className="bg-white/20 rounded-xl h-4 w-3/4 mb-2"></div>
      <div className="bg-white/20 rounded-xl h-4 w-1/2"></div>
    </div>
  );
};

// Skeleton variants for specific use cases
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`glass-card animate-pulse ${className}`}>
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-white/20 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/20 rounded w-3/4"></div>
        <div className="h-3 bg-white/20 rounded w-1/2"></div>
        <div className="h-3 bg-white/20 rounded w-full"></div>
      </div>
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({
  rows = 3,
  className = '',
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="glass-card animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/20 rounded w-2/3"></div>
            <div className="h-3 bg-white/20 rounded w-1/3"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-white/20 rounded"></div>
            <div className="h-8 w-8 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonForm: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    <div className="space-y-2">
      <div className="h-4 bg-white/20 rounded w-1/4"></div>
      <div className="h-10 bg-white/10 border border-white/20 rounded-lg"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-white/20 rounded w-1/3"></div>
      <div className="h-10 bg-white/10 border border-white/20 rounded-lg"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-white/20 rounded w-1/5"></div>
      <div className="h-20 bg-white/10 border border-white/20 rounded-lg"></div>
    </div>
    <div className="flex gap-3 pt-4">
      <div className="h-10 bg-white/20 rounded-xl w-24"></div>
      <div className="h-10 bg-white/10 border border-white/20 rounded-xl w-20"></div>
    </div>
  </div>
);

export default Loader;