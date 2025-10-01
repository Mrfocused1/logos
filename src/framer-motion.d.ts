// Type augmentation for Framer Motion to fix className type issues
import 'framer-motion';

declare module 'framer-motion' {
  export interface HTMLMotionProps<T> extends React.HTMLAttributes<T> {
    className?: string;
    id?: string;
  }
}