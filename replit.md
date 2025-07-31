# Overview

This is a prediction market web application called "Call" where users can create claims, place bets on whether those claims will come true, and participate in resolution voting. The platform features a token-based betting system, user profiles with accuracy tracking, leaderboards, and a mobile-first design built with React, Express, and PostgreSQL.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React SPA**: Single-page application using React with TypeScript
- **UI Framework**: shadcn/ui components built on Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Mobile-First Design**: Responsive layout optimized for mobile devices with bottom navigation

## Backend Architecture
- **Express Server**: RESTful API server with TypeScript
- **Development Mode**: Vite middleware integration for hot reloading in development
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Request Logging**: Custom middleware for API request/response logging
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL connection
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Development Storage**: In-memory storage implementation with seeded data for development/testing

## Core Domain Models
- **Users**: Token balance, accuracy scoring, betting statistics
- **Claims**: Predictions with expiration dates, betting pools, resolution status
- **Bets**: User positions (YES/NO) with amounts and odds tracking
- **Resolutions**: Community-driven claim resolution with source verification
- **Resolution Votes**: User voting on resolution validity

## API Design Patterns
- **RESTful Endpoints**: Standard HTTP methods with resource-based URLs
- **Validation**: Zod schemas for request/response validation and type safety
- **Async Operations**: Promise-based operations with proper error handling
- **Response Format**: Consistent JSON responses with error standardization

## External Dependencies

- **Database**: Neon Database (serverless PostgreSQL)
- **UI Components**: Radix UI primitives for accessibility
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date formatting and manipulation
- **Build Tools**: Vite for development and build processes
- **Development**: Replit-specific tooling for development environment