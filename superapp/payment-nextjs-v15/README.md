# Payment App - Super App

This is a mobile payment interface for the Super App project, similar to payment features found in Grab, Uber, or GoJek. Built with Next.js 15, TypeScript, and Tailwind CSS v4 with Singapore mobile number validation.

## Features

- 💸 **Mobile Payment Form**: Send money with mobile number and amount inputs
- 🇸🇬 **Singapore Mobile Validation**: Support for +65 XXXX XXXX format validation
- 💰 **Dollar Amount Validation**: Currency input with $0.01-$10,000 range validation
- 📱 **Mobile-First Design**: Touch-friendly interface optimized for mobile devices
- ✅ **Real-Time Validation**: Instant feedback with visual indicators
- 🎨 **Modern UI**: Clean, professional design with animations and transitions
- 🔒 **Form Security**: Comprehensive client-side validation and error handling
- ♿ **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Form Validation Rules

### Mobile Number Validation
- **Format**: +65 XXXX XXXX, 65 XXXX XXXX, or XXXX XXXX
- **Pattern**: `/^(\+65|65)?[689]\d{7}$/`
- **Valid Prefixes**: 6, 8, 9 (Singapore mobile prefixes)
- **Examples**: 
  - ✅ +65 9123 4567
  - ✅ 65 9123 4567  
  - ✅ 9123 4567
  - ❌ +65 1234 5678 (invalid prefix)

### Dollar Amount Validation
- **Range**: $0.01 to $10,000.00
- **Pattern**: `/^\d+(\.\d{1,2})?$/`
- **Format**: Up to 2 decimal places
- **Examples**:
  - ✅ 10.50
  - ✅ 100
  - ✅ 999.99
  - ❌ -5.00 (negative)
  - ❌ 10.555 (too many decimals)

## Project Structure

```
payment-nextjs-v15/
├── app/
│   ├── globals.css          # Global styles with Tailwind imports
│   ├── layout.tsx           # Root layout with payment app metadata
│   └── page.tsx             # Main payment interface page
├── components/              # Payment form components
│   ├── PaymentForm.tsx      # Main payment form container
│   ├── MobileInput.tsx      # Mobile number input with validation
│   ├── AmountInput.tsx      # Amount input with currency formatting
│   └── SendButton.tsx       # Submit button with loading states
├── lib/                     # Utility functions and hooks
│   ├── validation.ts        # Validation patterns and functions
│   └── hooks.ts             # Custom React hooks for form management
├── public/                  # Static assets
├── package.json            # Dependencies and scripts
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## Key Components

- **`PaymentForm.tsx`**: Main payment form with form state management
- **`MobileInput.tsx`**: Singapore mobile number input with real-time validation
- **`AmountInput.tsx`**: Currency amount input with dollar formatting
- **`SendButton.tsx`**: Submit button with loading and disabled states
- **`validation.ts`**: Validation functions for mobile numbers and amounts
- **`hooks.ts`**: Custom React hooks for form state and validation

## Usage Examples

### Singapore Mobile Number Formats
```typescript
// All these formats are valid:
"+65 9123 4567"  // International format
"65 9123 4567"   // Country code without +
"9123 4567"      // Local format
"91234567"       // No spaces
```

### Dollar Amount Formats
```typescript
// Valid amounts:
"10.50"    // With cents
"100"      // Whole dollars
"0.01"     // Minimum amount
"10000"    // Maximum amount

// Invalid amounts:
"-5.00"    // Negative
"10.555"   // Too many decimals
"0"        // Below minimum
"10001"    // Above maximum
```

## Super App Integration

This payment app is designed for integration into the larger Super App architecture:

- **WebView Ready**: Optimized for embedding in native mobile app containers
- **Singapore-Focused**: Built specifically for Singapore market with local mobile formats
- **Component-Based**: Reusable components for other payment flows
- **Scalable Architecture**: Ready for backend integration and real payment processing
- **Security-First**: Comprehensive validation prevents invalid submissions

## Quality Assurance

✅ **Code Quality**: No ESLint warnings or errors  
✅ **Type Safety**: TypeScript compilation passes  
✅ **Build Success**: Production build succeeds  
✅ **Mobile Responsive**: Touch-friendly interface on all devices  
✅ **Form Validation**: Real-time validation with comprehensive error handling  
✅ **Accessibility**: ARIA labels and keyboard navigation support  
✅ **User Experience**: Loading states, animations, and visual feedback  

## Next Steps

This payment app is ready for:
- **Backend Integration**: Connect to payment APIs (Stripe, PayPal, local banks)
- **Authentication**: Add user login and payment authorization
- **Transaction History**: Store and display payment records
- **Security Enhancement**: Add OTP verification and biometric authentication
- **Real Payment Processing**: Integration with Singapore banking infrastructure
- **Super App Integration**: Embed in native iOS/Android app container

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
