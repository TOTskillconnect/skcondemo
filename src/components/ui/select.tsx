import { useState, Fragment, useId, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Root Select Component
interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function Select({
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  children,
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const getValue = () => {
    // Find the child with matching value and return its label
    // Using React.Children would be better but for simple implementation:
    const items = Array.isArray(children) ? children : [children];
    const selectedItem = items.find((child: any) => child?.props?.value === value);
    return selectedItem ? selectedItem.props.children : placeholder;
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-between w-full min-h-[40px] px-3 py-2 text-left bg-white border rounded-md shadow-sm ${
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'
        } ${error ? 'border-accent-coral' : 'border-border'} ${
          isOpen ? 'ring-2 ring-accent-blue/20' : ''
        } ${className}`}
        onClick={toggleOpen}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={`${id}-listbox`}
      >
        <span className={value ? 'text-primary' : 'text-secondary'}>
          {getValue()}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-secondary transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-accent-coral">{error}</p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.1 }}
            className="absolute z-10 w-full mt-1 bg-white border border-border rounded-md shadow-lg"
            id={`${id}-listbox`}
            role="listbox"
          >
            <ul className="max-h-60 overflow-auto py-1 text-base">
              {children}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Select Item
interface SelectItemProps {
  value: string;
  onSelect?: (value: string) => void;
  isSelected?: boolean;
  children: ReactNode;
}

export function SelectItem({ value, onSelect, isSelected, children }: SelectItemProps) {
  return (
    <div
      className={`relative cursor-default select-none py-2 pl-10 pr-4 ${isSelected ? 'bg-accent-blue/10 text-primary' : 'text-gray-900 hover:bg-background'}`}
      onClick={() => onSelect?.(value)}
    >
      <span className="block truncate">
        {children}
      </span>
      {isSelected && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-accent-blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </div>
  );
}

// Define additional components for compatibility with common UI patterns

// SelectTrigger
interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
}

export function SelectTrigger({ children, className = '' }: SelectTriggerProps) {
  return (
    <div
      className={`flex items-center justify-between w-full min-h-[40px] px-3 py-2 text-left bg-white border border-border rounded-md shadow-sm cursor-pointer hover:border-accent-blue/50 ${className}`}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-secondary"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

// SelectValue
interface SelectValueProps {
  placeholder?: string;
  children?: ReactNode;
}

export function SelectValue({ placeholder, children }: SelectValueProps) {
  return (
    <span className={children ? 'text-primary' : 'text-secondary'}>
      {children || placeholder}
    </span>
  );
}

// SelectContent
interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

export function SelectContent({ children, className = '' }: SelectContentProps) {
  return (
    <div className={`absolute z-10 w-full mt-1 bg-white border border-border rounded-md shadow-lg ${className}`}>
      <div className="max-h-60 overflow-auto py-1 text-base">
        {children}
      </div>
    </div>
  );
} 