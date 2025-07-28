// Validation utilities for payment form

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Singapore mobile number validation regex
// Supports formats: +65 XXXX XXXX, 65 XXXX XXXX, XXXX XXXX
// Valid prefixes: 6, 8, 9 (Singapore mobile prefixes)
export const SINGAPORE_MOBILE_REGEX = /^(\+65|65)?[689]\d{7}$/;

// Dollar amount validation regex
// Supports: whole numbers and up to 2 decimal places
export const DOLLAR_AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;

// Constants for amount validation
export const MIN_AMOUNT = 0.01;
export const MAX_AMOUNT = 10000.00;

/**
 * Validates Singapore mobile number format
 * @param phoneNumber - The phone number to validate
 * @returns ValidationResult with isValid boolean and optional error message
 */
export function validateSingaporeMobile(phoneNumber: string): ValidationResult {
  if (!phoneNumber.trim()) {
    return {
      isValid: false,
      error: 'Mobile number is required'
    };
  }

  // Remove all spaces and normalize the input
  const cleanNumber = phoneNumber.replace(/\s/g, '');
  
  if (!SINGAPORE_MOBILE_REGEX.test(cleanNumber)) {
    return {
      isValid: false,
      error: 'Please enter a valid Singapore mobile number (e.g., +65 9123 4567)'
    };
  }

  return { isValid: true };
}

/**
 * Validates dollar amount format and range
 * @param amount - The amount string to validate
 * @returns ValidationResult with isValid boolean and optional error message
 */
export function validateDollarAmount(amount: string): ValidationResult {
  if (!amount.trim()) {
    return {
      isValid: false,
      error: 'Amount is required'
    };
  }

  // Remove dollar sign if present
  const cleanAmount = amount.replace(/^\$/, '');
  
  if (!DOLLAR_AMOUNT_REGEX.test(cleanAmount)) {
    return {
      isValid: false,
      error: 'Please enter a valid amount (e.g., 10.50)'
    };
  }

  const numericAmount = parseFloat(cleanAmount);
  
  if (numericAmount < MIN_AMOUNT) {
    return {
      isValid: false,
      error: `Minimum amount is $${MIN_AMOUNT.toFixed(2)}`
    };
  }
  
  if (numericAmount > MAX_AMOUNT) {
    return {
      isValid: false,
      error: `Maximum amount is $${MAX_AMOUNT.toLocaleString()}`
    };
  }

  return { isValid: true };
}

/**
 * Formats a Singapore mobile number for display
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number string
 */
export function formatSingaporeMobile(phoneNumber: string): string {
  const cleanNumber = phoneNumber.replace(/\s/g, '');
  
  // Handle different input formats
  if (cleanNumber.startsWith('+65')) {
    const digits = cleanNumber.slice(3);
    if (digits.length === 8) {
      return `+65 ${digits.slice(0, 4)} ${digits.slice(4)}`;
    }
  } else if (cleanNumber.startsWith('65')) {
    const digits = cleanNumber.slice(2);
    if (digits.length === 8) {
      return `+65 ${digits.slice(0, 4)} ${digits.slice(4)}`;
    }
  } else if (cleanNumber.length === 8) {
    return `+65 ${cleanNumber.slice(0, 4)} ${cleanNumber.slice(4)}`;
  }
  
  return phoneNumber; // Return original if formatting fails
}

/**
 * Formats a dollar amount for display
 * @param amount - The amount to format
 * @returns Formatted amount string with $ symbol
 */
export function formatDollarAmount(amount: string | number): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return '';
  }
  
  return `$${numericAmount.toFixed(2)}`;
}

/**
 * Validates the entire payment form
 * @param mobileNumber - The mobile number input
 * @param amount - The amount input
 * @returns Object with validation results for both fields
 */
export function validatePaymentForm(mobileNumber: string, amount: string) {
  return {
    mobile: validateSingaporeMobile(mobileNumber),
    amount: validateDollarAmount(amount),
    isFormValid: validateSingaporeMobile(mobileNumber).isValid && validateDollarAmount(amount).isValid
  };
}