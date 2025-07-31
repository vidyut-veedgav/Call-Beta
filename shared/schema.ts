import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  tokenBalance: integer("token_balance").notNull().default(1000),
  accuracyScore: decimal("accuracy_score", { precision: 5, scale: 2 }).default("0.00"),
  totalBets: integer("total_bets").default(0),
  totalWins: integer("total_wins").default(0),
  totalLosses: integer("total_losses").default(0),
  joinDate: timestamp("join_date").defaultNow(),
});

export const claims = pgTable("claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  creatorId: varchar("creator_id").references(() => users.id),
  creatorUsername: text("creator_username").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  status: text("status").notNull().default("open"), // open, expired, resolved
  resolutionOutcome: boolean("resolution_outcome"), // true = YES, false = NO
  totalYesBets: integer("total_yes_bets").default(0),
  totalNoBets: integer("total_no_bets").default(0),
  totalYesStake: integer("total_yes_stake").default(0),
  totalNoStake: integer("total_no_stake").default(0),
  totalBettors: integer("total_bettors").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bets = pgTable("bets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  claimId: varchar("claim_id").references(() => claims.id).notNull(),
  position: boolean("position").notNull(), // true = YES, false = NO
  amount: integer("amount").notNull(),
  odds: decimal("odds", { precision: 5, scale: 2 }).notNull(),
  isResolved: boolean("is_resolved").default(false),
  payout: integer("payout").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resolutions = pgTable("resolutions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  claimId: varchar("claim_id").references(() => claims.id).notNull(),
  proposedBy: varchar("proposed_by").references(() => users.id).notNull(),
  sourceLink: text("source_link").notNull(),
  sourceDescription: text("source_description").notNull(),
  votesValid: integer("votes_valid").default(0),
  votesInvalid: integer("votes_invalid").default(0),
  finalDecision: boolean("final_decision"), // true = valid, false = invalid
  outcome: boolean("outcome"), // true = YES, false = NO (what the source says)
  createdAt: timestamp("created_at").defaultNow(),
});

export const resolutionVotes = pgTable("resolution_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resolutionId: varchar("resolution_id").references(() => resolutions.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  isValid: boolean("is_valid").notNull(), // true = vote valid, false = vote invalid
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  joinDate: true,
});

export const insertClaimSchema = createInsertSchema(claims).omit({
  id: true,
  createdAt: true,
  totalYesBets: true,
  totalNoBets: true,
  totalYesStake: true,
  totalNoStake: true,
  totalBettors: true,
});

export const insertBetSchema = createInsertSchema(bets).omit({
  id: true,
  createdAt: true,
  isResolved: true,
  payout: true,
});

export const insertResolutionSchema = createInsertSchema(resolutions).omit({
  id: true,
  createdAt: true,
  votesValid: true,
  votesInvalid: true,
  finalDecision: true,
});

export const insertResolutionVoteSchema = createInsertSchema(resolutionVotes).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Claim = typeof claims.$inferSelect;
export type InsertClaim = z.infer<typeof insertClaimSchema>;
export type Bet = typeof bets.$inferSelect;
export type InsertBet = z.infer<typeof insertBetSchema>;
export type Resolution = typeof resolutions.$inferSelect;
export type InsertResolution = z.infer<typeof insertResolutionSchema>;
export type ResolutionVote = typeof resolutionVotes.$inferSelect;
export type InsertResolutionVote = z.infer<typeof insertResolutionVoteSchema>;
