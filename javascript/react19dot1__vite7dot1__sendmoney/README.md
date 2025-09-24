# Send Money App 💰

A modern, mobile-responsive React 19.1 application for sending money transactions, built with Vite 7.1. This is a proof-of-concept (PoC) application demonstrating a simple payment flow with mock API integration.

## 🚀 Features

- **Mobile-First Design**: Fully responsive design optimized for mobile devices
- **Modern React 19.1**: Built with the latest React features and hooks
- **Vite 7.1 Development**: Lightning-fast development server with HMR
- **Mock API Integration**: Realistic payment flow with random success/failure responses
- **Form Validation**: Client-side validation for phone numbers and amounts
- **Loading States**: Visual feedback during transaction processing
- **Transaction Results**: Success and failure pages with transaction IDs
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## 🛠 Technology Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Styling**: CSS Custom Properties (CSS Variables)
- **Icons**: Unicode symbols (✓, ✗)
- **Development**: ESLint, Hot Module Replacement

## 📦 Project Structure

```
react19dot1__vite7dot1__sendmoney/
├── public/
│   ├── vite.svg
│   └── index.html
├── src/
│   ├── components/
│   │   ├── SendMoneyForm.jsx    # Main form component
│   │   ├── ResultPage.jsx       # Success/failure results
│   │   └── Button.jsx           # Reusable button component
│   ├── services/
│   │   └── mockApi.js          # Mock payment API
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── index.css               # Global styles and design system
│   └── main.jsx                # React application entry point
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd react19dot1__vite7dot1__sendmoney
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to the displayed URL (usually `http://localhost:5173/`)

### Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 🎯 How to Use

### 1. Landing Page
- Enter a **phone number** (exactly 8 digits)
- Enter an **amount** (1-4 digits, greater than 0)
- Click **"Send Money"** to initiate the transaction

### 2. Transaction Processing
- Loading spinner appears during API call (1.5 seconds)
- Form is disabled during processing
- "Processing payment..." message is displayed

### 3. Result Page
- **Success**: Green checkmark, success message, and transaction ID
- **Failure**: Red cross, failure message, and transaction ID
- **"Return to Home"** button to start a new transaction

## 📱 Mobile Testing

### On Your Computer
1. Open browser developer tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Select a mobile device preset or custom dimensions

### On Your Mobile Device
1. Start the development server: `npm run dev`
2. Note the Network URL displayed (e.g., `http://192.168.1.100:5173/`)
3. Open this URL on your mobile device (must be on the same WiFi network)

## 🔧 Configuration

### Vite Configuration
The app is configured for optimal development and mobile testing:
- Network access enabled for mobile device testing
- Auto-import React for JSX
- Fast refresh for development

### Mobile Optimizations
- Viewport meta tag for proper mobile scaling
- Touch-friendly button sizes (minimum 44px)
- Proper input types for mobile keyboards
- Responsive design with CSS custom properties

## 🎨 Design System

The app uses a comprehensive design system with CSS custom properties:

### Colors
- Primary: Blue (`#007bff`)
- Success: Green (`#28a745`)
- Danger: Red (`#dc3545`)
- Neutral: Gray scale (`#f8f9fa` to `#000000`)

### Typography
- Font Family: System UI fonts for optimal performance
- Responsive font sizes (16px base, scaling to 18px on tablet+)
- Clear hierarchy with proper contrast ratios

### Spacing
- Consistent spacing scale (4px, 8px, 12px, 16px, etc.)
- Mobile-first approach with responsive adjustments

## 🧪 Testing

### Manual Testing Checklist

#### Form Validation
- [ ] Phone number accepts only digits
- [ ] Phone number limited to 8 characters
- [ ] Amount accepts only digits
- [ ] Amount limited to 4 characters
- [ ] Form shows validation errors
- [ ] Submit button disabled with invalid data

#### API Integration
- [ ] Loading state appears during API call
- [ ] Success response shows success page
- [ ] Failure response shows failure page
- [ ] Transaction IDs are generated and displayed
- [ ] "Return to Home" navigates back to form

#### Responsive Design
- [ ] Mobile layout (320px - 767px)
- [ ] Tablet layout (768px - 1023px)
- [ ] Desktop layout (1024px+)
- [ ] Touch interactions work properly
- [ ] All text is readable on mobile

## 🚀 Deployment

### Production Build
```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

The production files will be in the `dist/` directory.

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **Server Deployment**: Any web server (Apache, Nginx)
- **CDN Deployment**: AWS CloudFront, Google Cloud CDN

## 🔒 Security Considerations

- **No Real Payment Processing**: This is a mock application only
- **No Sensitive Data**: No real payment information is processed
- **Input Sanitization**: Basic XSS prevention implemented
- **No Backend**: All processing is client-side for demo purposes

## ⚡ Performance

### Build Metrics
- **Bundle Size**: ~192KB (gzipped: ~61KB)
- **CSS Size**: ~7.4KB (gzipped: ~2KB)
- **Build Time**: <500ms

### Performance Features
- Tree shaking for optimal bundle size
- CSS custom properties for efficient styling
- Lazy loading ready architecture
- Minimal external dependencies

## 🛠 Development

### Code Quality
- ESLint configured for React best practices
- Modern ES6+ syntax
- Component-based architecture
- Separation of concerns

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📚 Learning Resources

- [React 19.1 Documentation](https://react.dev/)
- [Vite 7.1 Guide](https://vitejs.dev/guide/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Mobile-First Responsive Design](https://web.dev/responsive-web-design-basics/)

## 🤝 Contributing

This is a proof-of-concept project. For improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and demonstration purposes only.
