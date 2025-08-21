# QuickGig Frontend

A modern, responsive hyperlocal platform for temporary & part-time work built with React, TypeScript, and TailwindCSS.

## 🚀 Features

### Core Functionality
- **Dual Role System**: Job Seekers and Job Posters with role-specific interfaces
- **Authentication**: Sign up/Login with role selection and profile setup wizard
- **Dashboard**: Role-based views with nearby gigs, filters, and search
- **Gig Management**: Post gigs, view details, apply for jobs
- **Application Tracking**: Manage applications with status updates
- **Payments & Wallet**: Earnings dashboard with transaction history
- **Profile & Ratings**: User profiles with reviews and achievements

### UI/UX Features
- **Mobile-First Design**: Responsive layouts optimized for all devices
- **Modern UI Components**: Built with ShadCN UI, Aceternity UI, and MagicUI
- **Smooth Animations**: Framer Motion animations and micro-interactions
- **Clean Design**: Trust-building color palette and consistent styling
- **Intuitive Navigation**: Easy-to-use sidebar and mobile bottom navigation

## 🛠 Tech Stack

- **Frontend**: React 19+ with TypeScript
- **Styling**: TailwindCSS with custom design system
- **UI Components**: 
  - ShadCN UI (forms, modals, tabs, popovers)
  - Aceternity UI (dashboards, tables, profiles)
  - MagicUI (animations, charts, chat widgets)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Form Handling**: React Hook Form with Zod validation

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   └── Layout.tsx    # Main layout component
├── pages/
│   ├── AuthPage.tsx      # Authentication
│   ├── Dashboard.tsx     # Home dashboard
│   ├── GigDetails.tsx    # Gig details & application
│   ├── PostGig.tsx       # Create new gig
│   ├── Applications.tsx  # Application management
│   ├── Payments.tsx      # Payments & wallet
│   └── Profile.tsx       # User profile
├── types/
│   └── index.ts      # TypeScript type definitions
├── lib/
│   └── utils.ts      # Utility functions
└── App.tsx           # Main app component

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
