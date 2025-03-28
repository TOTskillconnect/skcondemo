'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tag {
  id: string;
  label: string;
  category?: string;
  icon?: string;
}

interface InteractiveTagInputProps {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  suggestions: Tag[];
  placeholder?: string;
  label?: string;
  maxTags?: number;
  error?: string;
  className?: string;
  allowCustom?: boolean;
}

export default function InteractiveTagInput({
  tags,
  onTagsChange,
  suggestions,
  placeholder = 'Add tags...',
  label,
  maxTags = 10,
  error,
  className = '',
  allowCustom = true,
}: InteractiveTagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Tag[]>([]);
  const [noMatchFound, setNoMatchFound] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions.filter(
        suggestion =>
          suggestion.label.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.some(tag => tag.id === suggestion.id)
      );
      
      setFilteredSuggestions(filtered);
      setNoMatchFound(filtered.length === 0);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setNoMatchFound(false);
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions, tags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (tags.length < maxTags) {
        if (filteredSuggestions.length > 0) {
          // If there are suggestions, use the first one
          const selectedSuggestion = filteredSuggestions[0];
          onTagsChange([...tags, selectedSuggestion]);
        } else if (allowCustom) {
          // If no suggestions and custom input is allowed, create a new tag
          const newTag: Tag = {
            id: inputValue.trim().toLowerCase().replace(/\s+/g, '-'),
            label: inputValue.trim(),
          };
          onTagsChange([...tags, newTag]);
        }
        setInputValue('');
        setShowSuggestions(false);
        setNoMatchFound(false);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  };

  const handleSuggestionClick = (suggestion: Tag) => {
    if (tags.length < maxTags) {
      onTagsChange([...tags, suggestion]);
      setInputValue('');
      setShowSuggestions(false);
      setNoMatchFound(false);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(tags.filter(tag => tag.id !== tagId));
  };

  // Group suggestions by category if available
  const groupedSuggestions: { [category: string]: Tag[] } = {};
  
  filteredSuggestions.forEach(suggestion => {
    const category = suggestion.category || 'Other';
    if (!groupedSuggestions[category]) {
      groupedSuggestions[category] = [];
    }
    groupedSuggestions[category].push(suggestion);
  });

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
        </label>
      )}
      <div
        className={`flex items-center border border-border rounded-md p-1 transition-all 
         ${
          tags.length >= maxTags
            ? 'bg-gray-50'
            : 'focus-within:ring-2 focus-within:ring-accent-green/20 focus-within:border-accent-green'
        }`}
      >
        <div className="flex flex-wrap gap-1 p-1">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-1 px-2 py-1 bg-accent-green/10 border border-accent-green/20 rounded-md"
            >
              <span className="text-sm text-primary">{tag.label}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="text-gray-400 hover:text-accent-green transition-colors ml-1"
                aria-label={`Remove ${tag.label}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
          
          {tags.length < maxTags && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              placeholder={placeholder || `Add ${tags.length === 0 ? 'tags' : 'more'}...`}
              className={`${tags.length === 0 ? 'w-full' : 'w-auto'} py-1 px-2 flex-grow min-w-[100px] bg-transparent border-none outline-none text-sm text-primary placeholder-secondary`}
            />
          )}
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-96 overflow-y-auto"
          >
            {filteredSuggestions.length > 0 ? (
              Object.keys(groupedSuggestions).length > 1 ? (
                // If we have categories, group suggestions by category
                Object.entries(groupedSuggestions).map(([category, categoryItems]) => (
                  <div key={category}>
                    <div className="px-3 py-1 bg-gray-50 text-sm font-medium text-secondary">
                      {category}
                    </div>
                    {categoryItems.map((suggestion) => (
                      <motion.div
                        key={suggestion.id}
                        whileHover={{ backgroundColor: '#f3f4f6' }}
                        className="px-3 py-2 cursor-pointer hover:bg-accent-green/10"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center space-x-2">
                          {suggestion.icon && (
                            <span className="text-lg">{suggestion.icon}</span>
                          )}
                          <div>
                            <div className="text-primary">{suggestion.label}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))
              ) : (
                // If no categories or just one category, show flat list
                filteredSuggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    className="px-3 py-2 cursor-pointer hover:bg-accent-green/10"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center space-x-2">
                      {suggestion.icon && (
                        <span className="text-lg">{suggestion.icon}</span>
                      )}
                      <div>
                        <div className="text-primary">{suggestion.label}</div>
                        {suggestion.category && (
                          <div className="text-sm text-secondary">
                            {suggestion.category}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )
            ) : (
              <div className="px-3 py-4 text-center text-secondary">
                {noMatchFound && inputValue.trim() ? (
                  <>
                    <p>No matching suggestions found.</p>
                    {allowCustom && (
                      <p className="text-sm mt-1">Press Enter to create a custom tag.</p>
                    )}
                  </>
                ) : (
                  <p>Type to see suggestions</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 