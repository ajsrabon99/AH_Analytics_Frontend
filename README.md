# Amar Hishab — Developer Analytics Dashboard

Production React + Vite analytics dashboard for **Amar Hishab (আমার হিসাব)** developer telemetry.

## Features
- **Strict Privacy Guarantee**: Real-time display of telemetry without sensitive financial or personal data.
- **Key Metrics**: Total Installs, Active Now (5 min heartbeat window), DAU, WAU, MAU, App Opens, Sessions, and Anonymous Errors.
- **Interactive Visualizations**:
  - Daily Active Trends (7d, 30d, 90d filters).
  - Feature Usage breakdown with percentage and unique users.
  - App Version distribution & adoption tracking for v1.2.1.
  - Android OS / API level distribution.
  - Real-time live event stream with configurable auto-refresh rates.
- **Admin Security**: Secure JWT authentication with session timeout handling.

## Deployment to Netlify

1. **Connect Repository to Netlify**:
   - Set Base directory to `analytics-dashboard`.
   - Build command: `npm run build`
   - Publish directory: `dist`
2. **Environment Variables**:
   - `VITE_ANALYTICS_API_URL`: Your deployed backend URL (e.g. `https://analytics.amarhishab.app` or your Render/Fly.io endpoint).
3. **Deploy**:
   - Netlify will automatically build the Vite SPA and route all paths to `index.html` via `netlify.toml`.

## Local Development

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```
