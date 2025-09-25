# 💰 Trading Stocks PoC - Vue 3.5.x + Vite 7.1.x

A mobile-responsive proof-of-concept trading application built with Vue.js 3.5.x and Vite 7.1.x. This project demonstrates modern Vue.js development patterns including the Composition API, reactive state management, and component-based architecture.

## ✨ Features

- **Mobile-First Responsive Design**: Optimized for mobile devices with touch-friendly interfaces
- **Stock & ETF Trading**: Support for 9 predefined stocks and ETFs with real-time pricing display
- **Quantity Validation**: Input validation for quantities between 100-9000 shares
- **Mock Trading API**: Simulated trading with random success/failure responses
- **Transaction Management**: Unique transaction IDs and detailed result pages
- **Gold Theme**: Rich, gold-themed UI design for a premium trading experience
- **Loading States**: Smooth loading animations and user feedback
- **Error Handling**: Comprehensive error states and user-friendly messages

## 🏗️ Architecture

### Tech Stack
- **Vue.js 3.5.21**: Latest stable Vue with Composition API and `<script setup>`
- **Vite 7.1.7**: Ultra-fast build tool and development server
- **Modern CSS**: CSS Custom Properties, Grid, Flexbox
- **Mobile-First**: Responsive design starting from 320px viewports

### Project Structure
```
src/
├── components/           # Vue components
│   ├── TradingForm.vue  # Main trading form
│   ├── StockDropdown.vue # Stock selection dropdown
│   ├── QuantityInput.vue # Quantity input with validation
│   ├── BuyButton.vue    # Purchase button with loading states
│   ├── ResultPage.vue   # Success/failure results display
│   └── BackButton.vue   # Navigation back to home
├── composables/         # Vue composables (business logic)
│   ├── useStockData.js  # Stock data management
│   └── useTradingAPI.js # Mock trading API
├── App.vue             # Root component
├── main.js            # Application entry point
└── style.css          # Global styles and CSS variables
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Installation & Development

1. **Navigate to project directory**
   ```bash
   cd vue3dot5__vite7dot1__tradestocks
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173/`
   - The app will automatically reload when you make changes

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 📱 Usage

### Trading Flow
1. **Select Stock/ETF**: Choose from 9 available options in the dropdown
2. **Enter Quantity**: Input desired quantity (100-9000 shares)
3. **Review**: See real-time validation and pricing information
4. **Execute Trade**: Click "Buy Stocks / ETFs" to initiate mock trade
5. **View Results**: See success/failure status with transaction ID
6. **Return Home**: Navigate back to start a new trade

### Available Stocks & ETFs
| Ticker | Exchange    | Price   | Type |
|--------|-------------|---------|------|
| DDOG   | NASDAQ.NMS  | $136.44 | Stock |
| GOOG   | NASDAQ.NMS  | $248.50 | Stock |
| MSFT   | NASDAQ.NMS  | $510.63 | Stock |
| META   | NASDAQ.NMS  | $761.80 | Stock |
| CSPX   | LSEETF      | $710.60 | ETF |
| VUAA   | LSEETF      | $127.44 | ETF |
| VWRA   | LSEETF      | $163.54 | ETF |
| FWRA   | LSEETF      | $8.05   | ETF |
| AGED   | LSEETF      | $33.10  | ETF |

## 🎨 Design System

### Color Palette
- **Primary Gold**: `#FFD700` - Main accent color
- **Dark Gold**: `#B8860B` - Headers and important text
- **Light Gold**: `#FFF8DC` - Background highlights
- **Gold Accent**: `#DAA520` - Borders and secondary elements
- **Success Green**: `#4CAF50` - Success states
- **Error Red**: `#F44336` - Error states

### Typography
- **Font Family**: Segoe UI system font stack
- **Headings**: Bold, dark gold (#B8860B)
- **Body Text**: Dark brown (#2C1810) for readability
- **Secondary Text**: Medium brown (#8B4513)

### Responsive Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 🧪 Testing

The application includes:
- Form validation testing
- API response simulation
- Mobile responsiveness validation
- Cross-browser compatibility
- Loading state management
- Error boundary handling

### Manual Testing Checklist
- [ ] All 9 stock options selectable
- [ ] Quantity validation (100-9000 range)
- [ ] Mock API returns success/failure randomly
- [ ] Transaction IDs generated correctly
- [ ] Mobile responsiveness (320px+)
- [ ] Touch-friendly interactions
- [ ] Loading states work properly
- [ ] Navigation flow functions
- [ ] Error handling works

## 🏢 Mock API Behavior

The trading API simulation:
- **Random Results**: 50/50 chance of success/failure
- **Processing Delay**: 1-second simulation
- **Transaction IDs**: Format `TXN{timestamp}`
- **Response Structure**: Status, message, transaction details
- **Error Handling**: Network simulation and validation

## 📈 Performance Features

- **Instant Server Start**: Vite's lightning-fast dev server
- **Hot Module Replacement**: Real-time updates during development
- **Optimized Production Build**: Minified and tree-shaken bundles
- **CSS Optimization**: Efficient styling with custom properties
- **Mobile Optimization**: Touch-friendly UI components

## 🛡️ Security Considerations

- No sensitive data exposure
- Form validation and sanitization
- Safe mock API implementation
- HTTPS-ready for production deployment
- No external API dependencies

## 📄 Browser Support

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions
- **Mobile Browsers**: iOS Safari, Chrome Mobile

## 🤝 Contributing

This is a proof-of-concept project. For production use:
1. Replace mock API with real trading backend
2. Add authentication and authorization
3. Implement proper error logging
4. Add comprehensive test suite
5. Add accessibility improvements
6. Implement proper state management for larger scale

## 📝 License

This project is a proof-of-concept for educational purposes.

---

**Built with ❤️ using Vue.js 3.5.x and Vite 7.1.x**
