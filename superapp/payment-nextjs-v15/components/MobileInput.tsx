'use client';

import { formatSingaporeMobile } from '../lib/validation';

interface MobileInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  touched: boolean;
  disabled?: boolean;
}

export default function MobileInput({ 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  disabled = false 
}: MobileInputProps) {
  const hasError = touched && error;
  const isValid = touched && !error && value.trim() !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Allow only numbers, spaces, and + symbol
    inputValue = inputValue.replace(/[^0-9\s+]/g, '');
    
    // Limit input length to reasonable mobile number length
    if (inputValue.length > 15) {
      inputValue = inputValue.slice(0, 15);
    }
    
    onChange(inputValue);
  };

  return (
    <div className="space-y-2">
      <label 
        htmlFor="mobile-input" 
        className="block text-sm font-medium text-foreground"
      >
        Mobile Number
      </label>
      
      <div className="relative">
        <input
          id="mobile-input"
          type="tel"
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder="Enter mobile number"
          className={`
            w-full px-4 py-3 text-lg rounded-lg border-2 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${hasError 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : isValid
              ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            placeholder-gray-400
            min-h-[48px] text-foreground
          `}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? "mobile-error" : undefined}
        />
        
        {/* Validation indicator */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isValid && (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          )}
          {hasError && (
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {/* Helper text */}
      {!hasError && !isValid && (
        <p className="text-sm text-gray-500">
          Format: +65 9123 4567 or 9123 4567
        </p>
      )}
      
      {/* Error message */}
      {hasError && (
        <p id="mobile-error" className="text-sm text-red-600 flex items-center gap-1">
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          {error}
        </p>
      )}
      
      {/* Formatted display for valid numbers */}
      {isValid && (
        <p className="text-sm text-green-600">
          Will send to: {formatSingaporeMobile(value)}
        </p>
      )}
    </div>
  );
}