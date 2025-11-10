![](meter-reading-1.png)
![](meter-reading-2.png)
![](meter-reading-3.png)

# Meter Reading Submission App

A mobile-responsive web application for submitting utility meter readings, built with Vite 7.2.2 and vanilla JavaScript.

## Features

- **3-Page Flow**: Landing page → Enter meter reading → Confirmation
- **Client-Side Routing**: Smooth navigation without page reloads using the History API
- **Form Validation**: HTML5 and JavaScript validation for meter data
- **API Integration**: Submits readings to a mock backend endpoint (JSONPlaceholder)
- **Utility Theme**: Professional color scheme (electric blue, energy yellow, success green)
- **Mobile-First Design**: Fully responsive from 320px to desktop widths
- **Touch-Friendly**: All interactive elements meet 44px minimum touch target size
- **Animated Success**: Checkmark animation on successful submission

## Technology Stack

- **Build Tool**: Vite 7.2.2
- **Language**: Vanilla JavaScript (ES6+)
- **Styling**: Plain CSS with custom properties
- **Routing**: History API (no framework)
- **API Calls**: Native Fetch API
- **No Dependencies**: Pure vanilla implementation

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Getting Started

### Installation

1. Clone or navigate to the project directory:
```bash
cd vanilla__vite7dot2__submitmeterreading
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

## Project Structure

```
vanilla__vite7dot2__submitmeterreading/
├── index.html              # Main HTML entry point
├── src/
│   ├── main.js             # App initialization & router setup
│   ├── router.js           # Client-side routing logic
│   ├── style.css           # Global styles & utility theme
│   ├── views/
│   │   ├── landing.js      # Landing page view
│   │   ├── enterMeter.js   # Enter meter form view
│   │   └── confirmation.js # Success confirmation view
│   └── utils/
│       └── api.js          # API service for submissions
├── package.json
└── README.md
```

## Application Flow

1. **Landing Page** (`/`)
   - Displays app title and description
   - "Submit Meter Reading" button navigates to form

2. **Enter Meter Page** (`/enter-meter`)
   - Form fields:
     - Meter Number (text, required)
     - Current Reading (number, required)
     - Reading Date (date, defaults to today, required)
   - Client-side validation
   - Submits to mock API endpoint
   - Shows loading state during submission
   - Error handling with user-friendly messages

3. **Confirmation Page** (`/reading-submitted`)
   - Success message with animated checkmark
   - "Submit Another Reading" button returns to landing page

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Design Notes

### Color Theme
- **Primary Blue**: `#1e40af` (trust, reliability)
- **Secondary Yellow**: `#fbbf24` (energy, warmth)
- **Success Green**: `#10b981` (confirmation)
- **Background**: White and light gray

### Responsive Breakpoints
- **Mobile**: 320px - 767px (base styles)
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px and above

### Accessibility
- Touch-friendly button sizes (min 44px height)
- High contrast text for readability
- Semantic HTML structure
- Focus states for keyboard navigation

## API Details

The app uses JSONPlaceholder as a mock backend:
- **Endpoint**: `https://jsonplaceholder.typicode.com/posts`
- **Method**: POST
- **Response**: JSON with 201 status
- **No authentication required**

## Development Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Deployment

The app is a static site and can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

Simply upload the contents of the `dist/` folder after running `npm run build`.

## License

This is a demonstration project for educational purposes.
