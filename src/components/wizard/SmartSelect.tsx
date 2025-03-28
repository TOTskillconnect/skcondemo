'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  category?: string;
}

interface SmartSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
}

export default function SmartSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  label,
  error,
  className = '',
}: SmartSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const option = options.find(opt => opt.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedOptions = filteredOptions.reduce((acc, option) => {
    if (option.category) {
      if (!acc[option.category]) {
        acc[option.category] = [];
      }
      acc[option.category].push(option);
    } else {
      if (!acc['Other']) {
        acc['Other'] = [];
      }
      acc['Other'].push(option);
    }
    return acc;
  }, {} as Record<string, Option[]>);

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full p-3 border rounded-lg cursor-pointer
          focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue
          transition-colors
          ${error ? 'border-red-500' : 'border-border'}
          ${isOpen ? 'border-accent-blue' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {selectedOption?.icon && (
              <span className="text-lg">{selectedOption.icon}</span>
            )}
            <span className={selectedOption ? 'text-primary' : 'text-gray-400'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400"
          >
            ▼
          </motion.span>
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto"
          >
            <div className="p-2 border-b border-border">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue"
              />
            </div>

            <div className="py-1">
              {Object.entries(groupedOptions).map(([category, categoryOptions]) => (
                <div key={category}>
                  <div className="px-3 py-2 text-sm font-medium text-secondary">
                    {category}
                  </div>
                  {categoryOptions.map((option) => (
                    <motion.div
                      key={option.value}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      className={`
                        px-3 py-2 cursor-pointer
                        ${option.value === value ? 'bg-accent-blue/10' : ''}
                      `}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        {option.icon && (
                          <span className="text-lg">{option.icon}</span>
                        )}
                        <div>
                          <div className="text-primary">{option.label}</div>
                          {option.description && (
                            <div className="text-sm text-secondary">
                              {option.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 