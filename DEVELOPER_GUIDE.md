# Developer Guide - Call Prediction Market

Welcome to Call! This is a comprehensive guide to understanding and working with this prediction market application codebase.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (runs both frontend and backend)
npm run dev

# Type checking
npm run check

# Push database schema changes
npm run db:push
```

## 🏗️ Project Architecture

### Monorepo Structure
```
Call-Beta/
├── client/           # React frontend (SPA)
├── server/           # Express backend (API)
├── shared/           # Shared types and schemas
├── assets/           # Static assets and documentation
└── package.json      # Root package file
```

### Development vs Production
- **Development**: Vite dev server + Express backend (hot reloading)
- **Production**: Express serves both API and bundled frontend on single port (5000)

## 🛠️ Tech Stack

### Frontend (React SPA)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (server state)
- **UI Framework**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS (mobile-first)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Animation**: Framer Motion

### Backend (Express API)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express 4
- **Authentication**: Passport.js with local strategy
- **Session Management**: Express session with memory store
- **Build Tool**: esbuild (production bundling)

### Database
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Schema Management**: Drizzle Kit
- **Validation**: Zod schemas (runtime + TypeScript types)

### Development Tools
- **TypeScript**: Strict mode enabled
- **Package Manager**: npm
- **Hot Reloading**: Vite for frontend, tsx for backend
- **Deployment**: Replit-optimized

## 📁 Detailed Structure

### Frontend (`client/`)
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── bet-modal.tsx   # Betting interface
│   │   ├── claim-card.tsx  # Prediction display
│   │   └── ...
│   ├── pages/              # Route components
│   │   ├── feed.tsx        # Main predictions feed
│   │   ├── profile.tsx     # User profile & stats
│   │   ├── leaderboard.tsx # Rankings
│   │   └── wallet.tsx      # Token management
│   ├── hooks/              # Custom React hooks
│   │   ├── use-claims.tsx  # Claims API integration
│   │   ├── use-bets.tsx    # Betting API integration
│   │   └── use-user.tsx    # User data management
│   ├── lib/                # Utilities
│   │   ├── queryClient.ts  # TanStack Query config
│   │   └── utils.ts        # Helper functions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # React app entry point
└── index.html              # HTML template
```

### Backend (`server/`)
```
server/
├── index.ts    # Express server setup & middleware
├── routes.ts   # API routes definition
├── storage.ts  # Database abstraction layer
└── vite.ts     # Vite integration for development
```

### Shared (`shared/`)
```
shared/
└── schema.ts   # Database schema & Zod validation
```

## 🗄️ Database Schema

### Core Entities
- **Users**: `id`, `username`, `password_hash`, `tokens`, `accuracy_score`, `total_winnings`, `total_losses`
- **Claims**: Predictions with `title`, `description`, `expiration_date`, `yes_pool`, `no_pool`, `resolved`, `resolution`
- **Bets**: User positions with `user_id`, `claim_id`, `position` (YES/NO), `amount`, `odds`
- **Resolutions**: Community voting on claim outcomes
- **Resolution Votes**: Individual votes on resolution validity

### Key Relationships
- Users can create multiple Claims
- Users can place multiple Bets on different Claims  
- Claims can have multiple Bets from different users
- Claims can have Resolution entries when expired
- Resolutions can have multiple Resolution Votes

## 🔧 Core Dependencies

### Production Dependencies
- **UI/UX**: `@radix-ui/*` (primitives), `tailwindcss`, `framer-motion`
- **Data Fetching**: `@tanstack/react-query`
- **Forms**: `react-hook-form`, `@hookform/resolvers`
- **Database**: `drizzle-orm`, `@neondatabase/serverless`
- **Validation**: `zod`, `drizzle-zod`
- **Server**: `express`, `passport`, `express-session`
- **Utilities**: `date-fns`, `clsx`, `class-variance-authority`

### Development Dependencies
- **Build Tools**: `vite`, `esbuild`, `tsx`
- **TypeScript**: Full type checking with strict mode
- **Database Tools**: `drizzle-kit` (migrations)
- **Replit Integration**: `@replit/vite-plugin-*`

## 🎯 Key Features

### Prediction Markets
- Users create predictions/claims with expiration dates
- Other users bet YES/NO with tokens
- Automatic odds calculation based on betting pools
- Community-driven resolution system

### User Experience
- Mobile-first responsive design
- Real-time updates via TanStack Query
- Smooth animations and transitions  
- Bottom navigation for mobile users

### Data Flow
1. **Claims Creation**: Users create predictions → stored in database
2. **Betting**: Users place bets → updates pools and odds calculations
3. **Resolution**: Expired claims → community votes → payouts distributed
4. **Profile Stats**: User accuracy and winnings tracked automatically

## 🚦 Development Workflow

### Getting Started
1. Clone repository
2. Install dependencies: `npm install`
3. Set up PostgreSQL database
4. Configure `DATABASE_URL` in environment
5. Push schema: `npm run db:push`
6. Start development: `npm run dev`

### Making Changes
1. Frontend changes: Edit files in `client/src/`
2. Backend changes: Edit files in `server/`
3. Schema changes: Update `shared/schema.ts` → run `npm run db:push`
4. Type checking: `npm run check`

### Code Patterns
- **API Integration**: Use custom hooks (`use-claims`, `use-bets`, etc.)
- **Components**: Follow shadcn/ui patterns with consistent styling
- **Validation**: All API inputs/outputs use Zod schemas
- **Error Handling**: Consistent error boundaries and user feedback
- **Mobile Design**: Bottom navigation, touch-friendly interfaces

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: `development` or `production`
- `PORT`: Server port (defaults to 5000)

## 📱 Deployment

Built for single-port deployment:
- Production build creates `dist/` with bundled server and static assets
- Express serves API routes and static files from same port
- Optimized for Replit hosting environment
- Use `npm run build` → `npm start` for production deployment

This codebase follows modern full-stack TypeScript patterns with strong type safety, mobile-first design, and real-time data synchronization.

## 🔧 Development Guides

### 1. Modifying a Backend Service

Backend services are defined in `server/routes.ts` and use the storage layer in `server/storage.ts`.

**Example: Adding a new API endpoint**

```typescript
// In server/routes.ts
app.get("/api/users/:id/stats", async (req, res) => {
  try {
    const userId = req.params.id;
    const stats = await storage.getUserStats(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user stats" });
  }
});

// In server/storage.ts - add the method
async getUserStats(userId: string) {
  // Database query logic here
  return db.select().from(users).where(eq(users.id, userId));
}
```

**Steps:**
1. Add route handler to `server/routes.ts`
2. Add corresponding method to `server/storage.ts` if needed
3. Use Zod schemas from `shared/schema.ts` for validation
4. Test endpoint: `npm run dev` and call API via browser/Postman
5. Type check: `npm run check`

**Best Practices:**
- Always use try-catch for error handling
- Validate inputs with Zod schemas
- Return consistent JSON structure: `{ error: "message" }` for errors
- Use storage abstraction layer, not direct database calls

### 2. Modifying the Data Schema

Database schema is defined in `shared/schema.ts` using Drizzle ORM.

**Example: Adding a new field to existing table**

```typescript
// In shared/schema.ts
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  // ... existing fields ...
  avatarUrl: text("avatar_url"), // New field
});

// Update Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
```

**Steps:**
1. Edit table definition in `shared/schema.ts`
2. Update related Zod schemas if needed
3. Push schema changes: `npm run db:push`
4. Update TypeScript types throughout codebase
5. Update storage methods in `server/storage.ts`
6. Update frontend hooks and components as needed
7. Type check: `npm run check`

**Adding a new table:**

```typescript
// In shared/schema.ts
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Add schemas
export const insertNotificationSchema = createInsertSchema(notifications);
export const selectNotificationSchema = createSelectSchema(notifications);
export type Notification = z.infer<typeof selectNotificationSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
```

**Best Practices:**
- Use `gen_random_uuid()` for primary keys
- Always include `createdAt` timestamps
- Use proper foreign key references
- Create corresponding Zod schemas for type safety
- Test schema changes thoroughly

### 3. Modifying a Frontend Component

Frontend components follow shadcn/ui patterns with Tailwind CSS and TanStack Query for data.

**Example: Modifying an existing component**

```typescript
// In client/src/components/claim-card.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ClaimCard({ claim }: { claim: Claim }) {
  const queryClient = useQueryClient();
  
  // Add new functionality
  const likeClaim = useMutation({
    mutationFn: async (claimId: string) => {
      const response = await apiRequest("POST", `/api/claims/${claimId}/like`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
    },
  });

  return (
    <div className="border rounded-lg p-4 space-y-3">
      {/* Existing JSX */}
      
      {/* New like button */}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => likeClaim.mutate(claim.id)}
        disabled={likeClaim.isPending}
      >
        👍 Like
      </Button>
    </div>
  );
}
```

**Creating a new component:**

```typescript
// In client/src/components/notification-item.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Notification } from "@shared/schema";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  return (
    <div className={`p-3 border-b ${notification.read ? 'opacity-60' : 'bg-blue-50'}`}>
      <p className="text-sm">{notification.message}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500">
          {new Date(notification.createdAt).toLocaleString()}
        </span>
        {!notification.read && (
          <Button 
            variant="outline" 
            size="xs"
            onClick={() => onMarkRead(notification.id)}
          >
            Mark Read
          </Button>
        )}
      </div>
    </div>
  );
}
```

**Steps:**
1. Create/edit component file in `client/src/components/`
2. Import required UI components from `@/components/ui/`
3. Use TanStack Query hooks for data fetching (`useQuery`, `useMutation`)
4. Import types from `@shared/schema`
5. Use Tailwind CSS for styling (mobile-first)
6. Test in browser: `npm run dev`
7. Type check: `npm run check`

**Best Practices:**
- Follow existing component patterns in the codebase
- Use TypeScript interfaces for props
- Leverage shadcn/ui components for consistency
- Use TanStack Query for server state management
- Implement proper loading and error states
- Follow mobile-first responsive design
- Invalidate relevant queries after mutations
- Use semantic HTML and proper accessibility attributes

**Custom Hooks Pattern:**
```typescript
// In client/src/hooks/use-notifications.tsx
export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await apiRequest("PATCH", `/api/notifications/${notificationId}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });
}
```