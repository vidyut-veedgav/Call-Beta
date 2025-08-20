# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Call is a prediction market web application where users create and bet on claims/predictions. Built with React frontend, Express backend, and PostgreSQL database using modern TypeScript stack.

## Development Commands

```bash
# Start development server (both frontend and backend)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database operations
npm run db:push  # Push schema changes to database
```

## Architecture Overview

### Full-Stack Setup
- **Monorepo Structure**: Client and server code in same repository
- **Development**: Vite dev server with Express backend integration
- **Production**: Express serves both API and static frontend files
- **Port**: Single port (5000) serves both frontend and API routes

### Frontend (`client/`)
- **React SPA** with TypeScript and Wouter routing
- **UI Components**: shadcn/ui built on Radix UI primitives
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with mobile-first responsive design
- **Pages**: Feed, Profile, Leaderboard, Wallet (+ NotFound)
- **Custom Hooks**: `use-claims`, `use-bets`, `use-user` for API integration

### Backend (`server/`)
- **Express REST API** with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Storage Layer**: Abstracted interface (`storage.ts`) with in-memory dev implementation
- **Routes**: RESTful endpoints in `routes.ts`
- **Development**: Vite integration for hot reloading

### Database Schema (`shared/schema.ts`)
Core entities:
- **Users**: Token balance, accuracy scores, betting stats
- **Claims**: Predictions with expiration, betting pools, resolution status
- **Bets**: User positions (YES/NO) with amounts and odds
- **Resolutions**: Community-driven claim resolution with voting
- **Resolution Votes**: User votes on resolution validity

### Key Development Patterns

1. **Shared Types**: Database schema and validation schemas in `shared/`
2. **Type Safety**: Zod schemas for runtime validation and TypeScript inference
3. **API Layer**: Consistent error handling and structured JSON responses
4. **Component Architecture**: Reusable UI components with consistent patterns
5. **Mobile-First**: Bottom navigation and responsive design throughout

### Database Configuration
- **Drizzle Config**: `drizzle.config.ts` points to PostgreSQL via `DATABASE_URL`
- **Migrations**: Stored in `./migrations` directory
- **Schema**: Single source of truth in `shared/schema.ts`

### Environment Requirements
- `DATABASE_URL`: PostgreSQL connection string (required for production)
- `PORT`: Server port (defaults to 5000)
- `NODE_ENV`: Environment mode (development/production)

### Testing and Quality
- TypeScript strict mode enabled
- Zod validation for all API inputs/outputs
- Error boundaries and consistent error handling
- Development logging middleware for API requests

### Deployment Notes
- Built for Replit environment (see `replit.md`)
- Production build bundles server with esbuild
- Static assets served by Express in production
- Single port deployment model