# TritonV3 Frontend

A Vue.js based frontend application for the TritonV3 accounting and finance system.

## Overview

TritonV3 Frontend is a modern Vue 3 application using TypeScript, Pinia for state management, Vue Router for navigation, and PrimeVue for UI components. It provides interfaces for viewing financial reports, managing accounting data, and interacting with the TritonV3 backend API.

## Prerequisites

- Node.js (v16+)
- npm (v8+) or yarn
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/TritonV3_FE.git
cd TritonV3_FE
```

### 2. Install Dependencies

```bash
npm install
# OR
yarn
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following:

```
# Development Environment
NODE_ENV=development
VITE_APP_MODE=development
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_DEBUG=true
```

Adjust the `VITE_API_BASE_URL` to match your backend API endpoint.

### 4. Run Development Server

```bash
npm run dev
# OR
yarn dev
```

This will start the development server at `http://localhost:5173`.

### 5. Build for Production

```bash
npm run build
# OR
yarn build
```

The built assets will be in the `dist` directory.

## Project Structure

```
TritonV3_FE/
├── public/          # Static assets
├── src/
│   ├── assets/      # Application assets (images, global styles)
│   ├── components/  # Vue components
│   │   ├── finance/ # Finance-related components
│   │   └── layout/  # Layout components
│   ├── composables/ # Composable functions 
│   ├── layouts/     # Layout templates
│   ├── router/      # Vue Router configuration
│   ├── services/    # API and other services
│   ├── stores/      # Pinia stores
│   └── views/       # Page components
├── .env             # Environment variables
├── index.html       # Entry HTML file
├── package.json     # Project dependencies and scripts
├── tsconfig.json    # TypeScript configuration
└── vite.config.ts   # Vite configuration
```

## Features

- **Financial Reports**: View balance sheet, income statement, cash flow, and more
- **Company Management**: Select and manage multiple companies
- **Authentication**: Secure login and token-based authentication
- **Responsive Design**: Works across desktop and mobile devices

## Authentication

The application uses JWT token authentication. On login, an auth token is stored in localStorage and used for subsequent API requests.

## Troubleshooting

### API Connection Issues

1. Check if the backend API is running
2. Verify the `VITE_API_BASE_URL` in `.env` matches the backend URL
3. Inspect the browser console for API error messages
4. Verify your auth token is valid

### Blank Pages or Component Load Failures

1. Check browser console for JavaScript errors
2. Ensure all imports are correct (case sensitivity matters)
3. Clear browser cache and reload the page
4. Try restarting the dev server with `npm run dev`

### Report Data Not Loading

1. Verify the API is correctly formatted in kebab-case (e.g., `/api/accounting/reports/balance-sheet`)
2. Check network requests in browser dev tools
3. Ensure company ID and date parameters are properly formatted

## Development Guidelines

- Follow Vue 3 Composition API patterns
- Use Pinia for state management
- Keep components small and focused
- Use TypeScript interfaces for data structures
- Follow the existing naming conventions

## License

[Specify license information here]
