# Maintenances.org - Comprehensive Maintenance Service Platform

## Project Overview
A robust web application for streamlining maintenance service requests across various industries.

## Technology Stack
- Frontend: React with TypeScript
- Build Tool: Vite
- Styling: Tailwind CSS + shadcn/ui
- Routing: React Router
- State Management: React Hooks

## Features
- Service Catalog Management
- Appointment Scheduling
- Real-time Service Status Updates
- Contractor Management
- Analytics Dashboard
- Multi-language Support
- Responsive Design

## Project Structure
```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── data/           # Data models and mock data
├── utils/          # Utility functions
├── styles/         # Global styles and theme
└── types/          # TypeScript type definitions
```

## Local Development Setup

### Prerequisites
- Node.js (v18+)
- npm or Yarn

### Installation Steps
```bash
# Clone the repository
git clone https://github.com/goodsmash/Maintenances.git

# Navigate to project directory
cd Maintenances

# Install dependencies
npm install

# Start development server
npm run dev
```

## Available Scripts
```bash
# Development
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run test        # Run tests
```

## Environment Variables
Required environment variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```
Copy `.env.example` to `.env` and configure:
```env
VITE_API_URL=your_api_url
VITE_GOOGLE_MAPS_KEY=your_google_maps_key
```

## Deployment to Namecheap

### Preparation
1. Build the project
```bash
npm run build
```

### Hosting Options
- Static Site Hosting
- GitHub Pages
- Netlify
- Vercel

### Domain Configuration
1. Purchase domain on Namecheap
2. Point DNS to hosting provider
3. Configure SSL certificate

## Continuous Deployment
Configured GitHub Actions workflow for automatic deployment

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the terms specified in [LICENSE](LICENSE).
