# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- Lightweight: No heavy UI frameworks - uses only vanilla CSS and React
- Modern UI: Clean, responsive design with Ocean Professional styling
- Fast: Minimal dependencies for quick loading times
- Simple: Easy to understand and modify
- Mock-friendly: Built-in mock API and placeholder OAuth/Stripe flows for local development

## Getting Started

1) Install dependencies
- npm install

2) Configure environment variables
- Copy the example and adjust as needed:
  cp ../.env.example ../.env
  (If running the app from this folder directly, you can also place .env in this folder’s parent workspace root)

3) Start the development server
- npm start
- Open http://localhost:3000

Note: This app uses Create React App. All runtime env variables must be prefixed with REACT_APP_.

## Environment Variables

Place variables in a .env file in the container workspace root (music-streamer-platform-27497-27506/.env) or export them in your shell before starting the app.

- REACT_APP_API_BASE_URL
  Description: Base URL for backend API. In mock mode this is not required; leave empty for same-origin.
  Example: http://localhost:4000

- REACT_APP_OAUTH_PROVIDER_URL
  Description: OAuth authorization endpoint. Leave blank in development to use mock auth.
  Example: https://accounts.example.com/oauth2/authorize

- REACT_APP_OAUTH_CLIENT_ID
  Description: OAuth client ID registered with your provider.
  Example: web_app_local_dev

- REACT_APP_OAUTH_CALLBACK_URL
  Description: Redirect URL after OAuth login. Must be allowed in your provider config.
  Default (example): http://localhost:3000/account

- REACT_APP_STRIPE_PUBLIC_KEY
  Description: Stripe publishable key (test pk_… is fine in development). If unset, UI shows helpful messages and stays functional.
  Example: pk_test_XXXXXXXXXXXXXXXXXXXXXXXX

- REACT_APP_FEATURE_MOCK_API
  Description: Enables built-in mock mode when 'true' or when the variable is missing. In mock mode, API calls are served client-side (no server required).
  Default: true

You can find a ready-to-copy template in: ../.env.example

## Mock Mode

- How it works:
  - src/api/client.js installs an Axios adapter that intercepts requests and serves responses from in-memory handlers when REACT_APP_FEATURE_MOCK_API is true or missing.
  - This prevents network calls and errors during development.

- Provided mock data and endpoints:
  - Auth: POST /auth/exchange, GET /me
  - Search: GET /search?q=…
  - Playlists: CRUD at /playlists and track add/remove
  - Billing: POST /billing/checkout-session returns a fake session id

- Behavior:
  - The UI is fully interactive without a backend.
  - Errors are handled gracefully and return predictable responses for demos.

To disable mock mode and use a real backend, set:
REACT_APP_FEATURE_MOCK_API=false
REACT_APP_API_BASE_URL=http://localhost:4000

## OAuth Placeholder

- The hook src/hooks/useAuth.js supports two behaviors:
  1) Mock auth mode (default when OAuth envs are missing and mock is enabled)
     - Provides a mock token and mock user for development.
  2) Redirect mode (when OAuth envs are set)
     - Composes a generic authorization URL using:
       - REACT_APP_OAUTH_PROVIDER_URL
       - REACT_APP_OAUTH_CLIENT_ID
       - REACT_APP_OAUTH_CALLBACK_URL
     - Uses response_type=token as a placeholder (adjust for your provider, e.g. 'code' for authorization code flow).
     - Expects token in the URL (query/fragment) upon return and saves to localStorage.

- When integrating a real IdP:
  - Set the three OAuth env variables above.
  - Ensure your callback URL is allowed by the provider.
  - Replace the placeholder logic in useAuth to match your provider’s expected parameters and token exchange flow.

## Stripe Placeholder

- The Account page uses @stripe/stripe-js and expects REACT_APP_STRIPE_PUBLIC_KEY.
- In mock mode, createCheckoutSession(type) returns a fake session id ({ id: 'cs_test_mock_123' }).
- If the publishable key is missing:
  - The UI remains functional and shows a friendly inline message.
  - No redirect to Stripe occurs.

- To test Stripe Checkout redirect:
  - Set REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
  - Keep mock mode enabled to get a mock session id, or wire a real backend for session creation.

## Project Structure

- src/
  - api/
    - client.js (Axios instance with mock adapter)
    - endpoints.js (centralized endpoint helpers)
  - components/
    - common/ (Button, Input, Badge)
    - layout/ (Sidebar, TopBar)
    - player/ (PlayerBar)
  - hooks/ (useAuth, useDebounce)
  - pages/ (Home, Search, Library, PlaylistDetail, Account)
  - routes/ (Router.jsx with protected routes)
  - state/ (Redux store and slices)
  - utils/ (theme.js)
  - App.js, App.css, index.js, index.css

## Available Scripts

- npm start
  Starts the dev server on http://localhost:3000.

- npm test
  Launches the test runner.

- npm run build
  Builds the app for production to the build folder.

## Learn More

To learn React, check out the React documentation.

## Payments (Stripe placeholder)

This project wires a placeholder Stripe checkout flow on the Account page:
- Uses @stripe/stripe-js loadStripe with REACT_APP_STRIPE_PUBLIC_KEY.
- Buttons "Subscribe" and "Manage Subscription" call a mock-enabled endpoint helper createCheckoutSession(type) which returns a fake session id in mock mode.
- On success, it calls stripe.redirectToCheckout({ sessionId }).

Notes:
- If REACT_APP_STRIPE_PUBLIC_KEY is not set, the UI remains functional and shows a friendly inline message.
- Mock API mode is enabled by default if REACT_APP_FEATURE_MOCK_API is missing or set to 'true'.

### Code Splitting
See: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size
See: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App
See: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration
See: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment
See: https://facebook.github.io/create-react-app/docs/deployment

### npm run build fails to minify
See: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
