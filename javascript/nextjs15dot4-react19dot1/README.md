# Mobile Payment App

A simple Next.js mobile payment application with a 3-page flow.

## Features

- 📱 Mobile-first responsive design
- ✅ Form validation with Zod
- 🎨 shadcn/ui components
- ⚡ Next.js 15 App Router
- 📝 TypeScript for type safety

## Pages

1. **Payment Form** (`/`) - Enter phone number and amount
2. **Review Details** (`/review`) - Confirm payment details
3. **Success/Failure** (`/success`) - Payment result

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
git clone <repository-url>
cd nextjs15dot4-react19dot1
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build
```bash
npm run build
npm run start
```

## Testing

1. Open mobile viewport in browser (375px width)
2. Test complete payment flow
3. Verify form validation
4. Test both success and failure scenarios

### Manual Test Cases

**Test Case 1: Form Validation**
- Try submitting empty form → Should show validation errors
- Enter invalid phone number (e.g., "123") → Should show error
- Enter invalid amount (e.g., "0" or "99999") → Should show error

**Test Case 2: Success Flow**
- Enter valid Singapore phone number (e.g., "+65 9123 4567")
- Enter valid amount (e.g., "25.50")
- Click "Next" → Should navigate to review page
- Verify details are correct
- Click "Confirm Payment" → Should show processing
- Should navigate to success page (80% probability)

**Test Case 3: Failure Flow**
- Follow steps above but payment may fail (20% probability)
- Should show failure message with error details
- Should display transaction ID

**Test Case 4: Navigation**
- From review page, click "Edit Details" → Should return to form
- From success page, click "Make Another Payment" → Should return to clean form

## Technology Stack

- **Framework**: Next.js 15.4 with React 19.1
- **Styling**: Tailwind CSS v4
- **Components**: Custom shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **TypeScript**: Full type safety
- **Routing**: Next.js App Router

## Project Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx           # Payment form
├── review/page.tsx    # Review details  
└── success/page.tsx   # Success/failure

components/
├── forms/             # Form components
│   ├── PaymentForm.tsx
│   ├── ReviewDetails.tsx
│   └── SuccessMessage.tsx
└── ui/               # UI components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── label.tsx

lib/
├── utils.ts          # Utilities
└── validations.ts    # Zod schemas
```

## Mobile Optimizations

- Touch-friendly buttons (44px minimum)
- Large input fields for mobile typing
- Single-column layout
- Mobile viewport configuration
- Optimized font sizes and spacing
- Custom mobile CSS classes

## Key Features Implementation

### Form Validation
- Singapore phone number format validation (`+65 XXXX XXXX`)
- Amount validation (min: $0.01, max: $10,000)
- Real-time form validation with error messages
- TypeScript type safety with Zod schemas

### Payment Simulation
- Mock payment processing with 80% success rate
- 2-second processing delay simulation
- Transaction ID generation
- Success/failure result handling

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Optimal button and input sizes for touch
- Single-column layout for mobile screens
- Consistent spacing and typography

## Deployment

This app can be deployed to Vercel, Netlify, or any Node.js hosting platform.

For Vercel:
```bash
npm run build
vercel --prod
```

## Security Considerations

- No sensitive data persistence
- Client-side validation only (for demo purposes)
- URL-based state management
- No real payment processing
- Form data cleared after completion

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build production version
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Optimized for viewport widths 320px and above

## Cleanup

To remove the project:
```bash
cd ..
rm -rf nextjs15dot4-react19dot1
```

## License

This is a demo application for learning purposes.
