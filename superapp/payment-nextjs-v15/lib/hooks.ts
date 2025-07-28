'use client';

import { useState, useCallback } from 'react';
import { validateSingaporeMobile, validateDollarAmount, ValidationResult } from './validation';

export interface FormFieldState {
  value: string;
  validation: ValidationResult;
  touched: boolean;
}

export interface PaymentFormState {
  mobileNumber: FormFieldState;
  amount: FormFieldState;
  isSubmitting: boolean;
  submitMessage: string;
  submitSuccess: boolean;
}

/**
 * Custom hook for managing payment form state and validation
 */
export function usePaymentForm() {
  const [formState, setFormState] = useState<PaymentFormState>({
    mobileNumber: {
      value: '',
      validation: { isValid: false },
      touched: false
    },
    amount: {
      value: '',
      validation: { isValid: false },
      touched: false
    },
    isSubmitting: false,
    submitMessage: '',
    submitSuccess: false
  });

  // Update mobile number field
  const updateMobileNumber = useCallback((value: string, touched = true) => {
    const validation = validateSingaporeMobile(value);
    setFormState(prev => ({
      ...prev,
      mobileNumber: {
        value,
        validation,
        touched
      },
      submitMessage: '', // Clear submit message on input change
      submitSuccess: false
    }));
  }, []);

  // Update amount field
  const updateAmount = useCallback((value: string, touched = true) => {
    const validation = validateDollarAmount(value);
    setFormState(prev => ({
      ...prev,
      amount: {
        value,
        validation,
        touched
      },
      submitMessage: '', // Clear submit message on input change
      submitSuccess: false
    }));
  }, []);

  // Set field as touched (for blur events)
  const setFieldTouched = useCallback((field: 'mobileNumber' | 'amount') => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        touched: true
      }
    }));
  }, []);

  // Check if form is valid for submission
  const isFormValid = formState.mobileNumber.validation.isValid && 
                     formState.amount.validation.isValid;

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched to show validation errors
    setFormState(prev => ({
      ...prev,
      mobileNumber: { ...prev.mobileNumber, touched: true },
      amount: { ...prev.amount, touched: true }
    }));

    if (!isFormValid) {
      setFormState(prev => ({
        ...prev,
        submitMessage: 'Please fix the errors above before sending.',
        submitSuccess: false
      }));
      return;
    }

    // Start submission
    setFormState(prev => ({
      ...prev,
      isSubmitting: true,
      submitMessage: '',
      submitSuccess: false
    }));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success - in real app, this would make an API call
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        submitMessage: `Successfully sent ${prev.amount.value} to ${prev.mobileNumber.value}!`,
        submitSuccess: true
      }));

      // Reset form after success
      setTimeout(() => {
        resetForm();
      }, 3000);

    } catch {
      // Handle error
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        submitMessage: 'Failed to send payment. Please try again.',
        submitSuccess: false
      }));
    }
  }, [isFormValid]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormState({
      mobileNumber: {
        value: '',
        validation: { isValid: false },
        touched: false
      },
      amount: {
        value: '',
        validation: { isValid: false },
        touched: false
      },
      isSubmitting: false,
      submitMessage: '',
      submitSuccess: false
    });
  }, []);

  return {
    formState,
    updateMobileNumber,
    updateAmount,
    setFieldTouched,
    handleSubmit,
    resetForm,
    isFormValid
  };
}