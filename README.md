# Maintenances.org - Comprehensive Maintenance Service Platform

## Project Overview
A robust web application for streamlining maintenance service requests across various industries.

## Technology Stack
- Frontend: React with TypeScript
- Build Tool: Vite
- Styling: Tailwind CSS + shadcn/ui
- Routing: React Router
- State Management: React Hooks

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

## Environment Variables
Required environment variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## Continuous Deployment
Configured GitHub Actions workflow for automatic deployment

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License
[Specify your license]
