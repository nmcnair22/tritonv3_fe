# Triton V3

A modern Vue 3 application built with TypeScript, PrimeVue, and other powerful technologies.

## Tech Stack

- **Vue 3**: Progressive JavaScript framework
- **TypeScript**: Static type-checking
- **Vite**: Next generation frontend build tool
- **PrimeVue 4**: UI Component library for Vue
- **PrimeVue UIX Themes**: New theming system with Aura preset
- **Vue Router**: Official router for Vue
- **Pinia**: State management library for Vue
- **VueUse**: Collection of Vue composition utilities
- **Axios**: Promise-based HTTP client
- **Zod**: TypeScript-first schema validation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── public/             # Static assets
├── src/
│   ├── assets/         # Asset files (images, fonts, etc.)
│   ├── components/     # Reusable Vue components
│   ├── composables/    # Vue composition functions
│   ├── layouts/        # Layout components
│   ├── router/         # Vue Router configuration
│   ├── services/       # API services
│   ├── stores/         # Pinia stores
│   ├── types/          # TypeScript types and schemas
│   ├── views/          # Page components
│   ├── App.vue         # Root component
│   ├── main.ts         # Entry point
│   └── style.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Features

- **Type Safety**: Full TypeScript support with proper types
- **Form Validation**: Zod schemas for runtime validation
- **State Management**: Pinia for a clean store pattern
- **Responsive UI**: PrimeVue components with the new UIX theme system
- **API Integration**: Axios for HTTP requests with interceptors
- **Authentication**: JWT-based authentication with localStorage

## Theming

This project uses the new PrimeVue UIX theme system with the Aura preset. The theme is configured in `main.ts`:

```ts
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  }
})
```

You can customize the theme by using the `definePreset` utility:

```ts
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const MyPreset = definePreset(Aura, {
  // Your customizations here
})
```

## License

MIT
