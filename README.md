# Call - Prediction Market Web Application

A modern prediction market platform where users can create and bet on claims/predictions. Built with React, Express, and PostgreSQL using TypeScript throughout.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (frontend + backend)
npm run dev

# Visit http://localhost:5000
```

## Features

- 🎯 **Create Predictions**: Users can create claims with expiration dates and betting pools
- 💰 **Place Bets**: Bet YES/NO on predictions with dynamic odds
- 🏆 **Leaderboards**: Track top performers by accuracy and earnings
- 👤 **User Profiles**: Personal stats, betting history, and performance metrics
- 💳 **Wallet System**: Token balance management and transaction history
- 🗳️ **Community Resolution**: Democratic resolution of expired claims

## Tech Stack

### Frontend
- **React** with TypeScript
- **Wouter** for routing
- **TanStack Query** for server state management
- **shadcn/ui** components built on Radix UI
- **Tailwind CSS** for styling
- **Vite** for development and bundling

### Backend
- **Express** REST API with TypeScript
- **PostgreSQL** database
- **Drizzle ORM** for database operations
- **Zod** for runtime validation
- Abstracted storage layer for flexible data persistence

### Architecture
- **Monorepo**: Single repository for frontend and backend
- **Single Port**: Development and production on port 5000
- **Type Safety**: Shared types and validation schemas
- **Mobile-First**: Responsive design with bottom navigation

## Development Commands

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run check        # TypeScript type checking

# Database
npm run db:push      # Push schema changes to database

# Production
npm run build        # Build for production
npm start           # Start production server
```

## Project Structure

```
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages (Feed, Profile, etc.)
│   │   └── hooks/       # Custom hooks for API integration
├── server/          # Express backend API
│   ├── routes.ts    # API route definitions
│   └── storage.ts   # Abstracted storage interface
├── shared/          # Shared types and schemas
│   └── schema.ts    # Database schema and validation
└── migrations/      # Database migration files
```

## Database Schema

### Core Entities
- **Users**: Token balances, accuracy scores, betting statistics
- **Claims**: Predictions with expiration dates and betting pools
- **Bets**: User positions (YES/NO) with amounts and odds
- **Resolutions**: Community-driven claim resolution system
- **Resolution Votes**: User votes on resolution validity

## Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/call_db
PORT=5000
NODE_ENV=development
```

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (defaults to 5000)
- `NODE_ENV`: Environment mode (development/production)

## API Endpoints

The REST API provides endpoints for:
- User management and authentication
- Claim creation and retrieval
- Betting operations
- Resolution voting
- Leaderboard data

## Development Features

- **Hot Reload**: Vite integration for instant frontend updates
- **Type Safety**: Full TypeScript coverage with strict mode
- **Error Handling**: Consistent error boundaries and API responses
- **Development Logging**: Request logging middleware for debugging

## Deployment

The application is designed for single-port deployment:
- Production builds bundle the server with esbuild
- Express serves both API routes and static frontend assets
- Optimized for platforms like Replit

## Contributing

1. Ensure TypeScript compilation passes: `npm run check`
2. Test your changes with `npm run dev`
3. Push database schema changes with `npm run db:push`

## License

[Add your license information here]