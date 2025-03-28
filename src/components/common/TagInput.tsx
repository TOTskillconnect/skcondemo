'use client';
import { useState, useRef, useEffect } from 'react';
import { KeyboardEvent } from 'react';
import Fuse from 'fuse.js';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  maxTags?: number;
  className?: string;
}

interface FuseResult {
  item: string;
  score?: number;
}

export default function TagInput({
  tags,
  onTagsChange,
  placeholder = 'Add tags...',
  suggestions = [],
  maxTags = 10,
  className = '',
}: TagInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Fuse for fuzzy search
  const fuse = new Fuse(suggestions, {
    threshold: 0.3,
    includeScore: true,
  });

  useEffect(() => {
    if (input.trim()) {
      const results = fuse.search(input);
      const filtered = results
        .map((result: FuseResult) => result.item)
        .filter((suggestion: string) => !tags.includes(suggestion));
      setFilteredSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input, tags]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() && !tags.includes(input.trim())) {
      e.preventDefault();
      if (tags.length < maxTags) {
        onTagsChange([...tags, input.trim()]);
        setInput('');
        setShowSuggestions(false);
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!tags.includes(suggestion) && tags.length < maxTags) {
      onTagsChange([...tags, suggestion]);
      setInput('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2 p-2 border border-border rounded-md bg-white">
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-accent-gold/10 text-accent-gold rounded-full text-sm"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-accent-gold/80"
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={tags.length < maxTags ? placeholder : 'Maximum tags reached'}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
          disabled={tags.length >= maxTags}
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-md shadow-lg">
          <ul className="py-1">
            {filteredSuggestions.map((suggestion) => (
              <li
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 hover:bg-accent-gold/5 cursor-pointer text-sm"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 