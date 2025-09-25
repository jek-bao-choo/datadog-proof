# Next.js 15.5 + React 19.1 Holiday Planning App

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## Deploying to Cloudflare Pages

This app is configured for static export to deploy on Cloudflare Pages.

### Configuration Changes Made

The `next.config.mjs` has been configured for static export:

```javascript
const nextConfig = {
  output: 'export',           // Enable static export
  trailingSlash: true,        // Add trailing slashes to URLs
  images: {
    unoptimized: true         // Required for static export
  }
};
```

### Build Process

When you run `npm run build`, Next.js will:
1. Create optimized production build
2. Export static files to `out/` folder
3. Generate pure HTML/CSS/JS files (no server required)

### Cloudflare Pages Deployment Steps

**Method 1: Git Integration (Recommended)**
1. Push code to Git repository
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Navigate to **Pages** � **Create a project**
4. Connect your Git repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `javascript/next15dot5__react19dot1__planholiday`

**Method 2: Direct Upload**
1. Run `npm run build` locally
2. Upload the `out/` folder via Cloudflare Pages dashboard

### Important Notes

- **Static Export**: Server-side features (API routes, middleware) won't work
- **Images**: Must use `unoptimized: true` for static export
- **Output**: Build generates `out/` folder with static files
- **URLs**: Trailing slashes added for better compatibility