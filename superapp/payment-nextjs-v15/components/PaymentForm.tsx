'use client';

import { usePaymentForm } from '../lib/hooks';
import MobileInput from './MobileInput';
import AmountInput from './AmountInput';
import SendButton from './SendButton';

export default function PaymentForm() {
  const {
    formState,
    updateMobileNumber,
    updateAmount,
    setFieldTouched,
    handleSubmit,
    isFormValid
  } = usePaymentForm();

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Send Money</h1>
          <p className="text-sm text-foreground/70">
            Quick and secure mobile payments
          </p>
        </div>

        {/* Mobile Number Input */}
        <MobileInput
          value={formState.mobileNumber.value}
          onChange={updateMobileNumber}
          onBlur={() => setFieldTouched('mobileNumber')}
          error={formState.mobileNumber.validation.error}
          touched={formState.mobileNumber.touched}
          disabled={formState.isSubmitting}
        />

        {/* Amount Input */}
        <AmountInput
          value={formState.amount.value}
          onChange={updateAmount}
          onBlur={() => setFieldTouched('amount')}
          error={formState.amount.validation.error}
          touched={formState.amount.touched}
          disabled={formState.isSubmitting}
        />

        {/* Send Button */}
        <SendButton
          isLoading={formState.isSubmitting}
          isDisabled={!isFormValid}
          onClick={() => {}}
        />

        {/* Submit Message */}
        {formState.submitMessage && (
          <div className={`
            p-4 rounded-lg border text-sm
            ${formState.submitSuccess 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
            }
            flex items-center gap-2
          `}>
            {formState.submitSuccess ? (
              <svg 
                className="w-5 h-5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            ) : (
              <svg 
                className="w-5 h-5 flex-shrink-0" 
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
            )}
            <span>{formState.submitMessage}</span>
          </div>
        )}

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-foreground/50">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </form>
    </div>
  );
}