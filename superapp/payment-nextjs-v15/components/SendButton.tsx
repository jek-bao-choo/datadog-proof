'use client';

interface SendButtonProps {
  isLoading: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export default function SendButton({ isLoading, isDisabled, onClick }: SendButtonProps) {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={`
        w-full min-h-[48px] py-3 px-6 text-lg font-semibold rounded-lg
        transition-all duration-200 transform
        focus:outline-none focus:ring-4 focus:ring-offset-2
        ${isDisabled || isLoading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 focus:ring-blue-500'
        }
        flex items-center justify-center gap-2
        shadow-lg hover:shadow-xl
      `}
      aria-label={isLoading ? "Sending payment..." : "Send payment"}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Sending...</span>
        </>
      ) : (
        <>
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
            />
          </svg>
          <span>Send</span>
        </>
      )}
    </button>
  );
}