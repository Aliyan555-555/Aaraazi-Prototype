/**
 * SmartSearch - Advanced search input with debouncing
 * 
 * Features:
 * - Debounced search (configurable delay)
 * - Search icon
 * - Clear button
 * - Keyboard shortcuts (Esc to clear)
 * - Loading indicator
 * - Auto-focus option
 * 
 * Usage:
 * <SmartSearch
 *   placeholder="Search properties..."
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   onClear={() => setSearchQuery('')}
 *   debounce={300}
 * />
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';

export interface SmartSearchProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  debounce?: number;
  loading?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function SmartSearch({
  placeholder = 'Search...',
  value = '',
  onChange,
  onClear,
  onSearch,
  debounce = 300,
  loading = false,
  autoFocus = false,
  className = '',
}: SmartSearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle input change with debouncing
  const handleChange = (newValue: string) => {
    setLocalValue(newValue);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
      if (onSearch) {
        onSearch(newValue);
      }
    }, debounce);
  };

  // Handle clear
  const handleClear = () => {
    setLocalValue('');
    onChange('');
    if (onClear) {
      onClear();
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    inputRef.current?.focus();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Search className="w-4 h-4" />
        )}
      </div>

      {/* Input */}
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        className="pl-10 pr-10"
        aria-label="Search"
      />

      {/* Clear button */}
      {localValue && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-gray-400" />
        </Button>
      )}
    </div>
  );
}
