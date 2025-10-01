import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

// Context for accordion state
const AccordionContext = createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  type: 'single' | 'multiple';
  collapsible?: boolean;
}>({
  type: 'single',
});

// Accordion Root Component
interface AccordionProps {
  type: 'single' | 'multiple';
  collapsible?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  type,
  collapsible = false,
  value,
  onValueChange,
  children,
  className,
}) => {
  const [internalValue, setInternalValue] = useState<string>('');

  const currentValue = value !== undefined ? value : internalValue;
  const currentOnValueChange = onValueChange || setInternalValue;

  return (
    <AccordionContext.Provider
      value={{
        value: currentValue,
        onValueChange: currentOnValueChange,
        type,
        collapsible,
      }}
    >
      <div className={cn('space-y-0', className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

// Accordion Item Component
interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  value,
  children,
  className,
}) => {
  return (
    <div className={cn('border-b border-gray-200', className)} data-value={value}>
      {children}
    </div>
  );
};

// Accordion Trigger Component
interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  className,
}) => {
  const context = useContext(AccordionContext);
  const item = React.useContext(AccordionItemContext);

  if (!context || !item) {
    throw new Error('AccordionTrigger must be used within Accordion and AccordionItem');
  }

  const isOpen = context.value === item.value;

  const handleClick = () => {
    if (context.onValueChange) {
      if (isOpen && context.collapsible) {
        context.onValueChange('');
      } else {
        context.onValueChange(item.value);
      }
    }
  };

  return (
    <button
      className={cn(
        'flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:underline',
        className
      )}
      onClick={handleClick}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 transition-transform duration-200',
          isOpen ? 'rotate-180' : ''
        )}
      />
    </button>
  );
};

// Accordion Content Component
interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className,
}) => {
  const context = useContext(AccordionContext);
  const item = React.useContext(AccordionItemContext);

  if (!context || !item) {
    throw new Error('AccordionContent must be used within Accordion and AccordionItem');
  }

  const isOpen = context.value === item.value;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className={cn('pb-4 pt-0', className)}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Context for accordion item
const AccordionItemContext = createContext<{ value: string } | null>(null);

// Enhanced AccordionItem with context
const EnhancedAccordionItem: React.FC<AccordionItemProps> = ({ value, children, className }) => {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={cn('border-b border-gray-200', className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

export { Accordion, EnhancedAccordionItem as AccordionItem, AccordionTrigger, AccordionContent };