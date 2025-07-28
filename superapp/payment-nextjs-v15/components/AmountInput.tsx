'use client';

import { formatDollarAmount } from '../lib/validation';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  touched: boolean;
  disabled?: boolean;
}

export default function AmountInput({ 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  disabled = false 
}: AmountInputProps) {
  const hasError = touched && error;
  const isValid = touched && !error && value.trim() !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Remove dollar sign for processing
    inputValue = inputValue.replace(/^\$/, '');
    
    // Allow only numbers and one decimal point
    inputValue = inputValue.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = inputValue.split('.');
    if (parts.length > 2) {
      inputValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      inputValue = parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    // Prevent leading zeros (except for 0.xx)
    if (inputValue.length > 1 && inputValue[0] === '0' && inputValue[1] !== '.') {
      inputValue = inputValue.slice(1);
    }
    
    onChange(inputValue);
  };

  const numericValue = parseFloat(value);
  const formattedAmount = !isNaN(numericValue) ? formatDollarAmount(numericValue) : '';

  return (
    <div className="space-y-2">
      <label 
        htmlFor="amount-input" 
        className="block text-sm font-medium text-foreground"
      >
        Amount
      </label>
      
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500 pointer-events-none">
          $
        </div>
        
        <input
          id="amount-input"
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder="0.00"
          className={`
            w-full pl-8 pr-12 py-3 text-lg rounded-lg border-2 transition-all duration-200
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
          aria-describedby={hasError ? "amount-error" : undefined}
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
          Enter amount between $0.01 and $10,000
        </p>
      )}
      
      {/* Error message */}
      {hasError && (
        <p id="amount-error" className="text-sm text-red-600 flex items-center gap-1">
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
      
      {/* Formatted amount display */}
      {isValid && formattedAmount && (
        <p className="text-sm text-green-600">
          Amount: {formattedAmount}
        </p>
      )}
    </div>
  );
}