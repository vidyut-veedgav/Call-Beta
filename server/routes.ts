import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBetSchema, insertClaimSchema, insertResolutionSchema, insertResolutionVoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (for demo, return first user)
  app.get("/api/user/current", async (req, res) => {
    try {
      const users = await storage.getTopUsers(1);
      if (users.length === 0) {
        return res.status(404).json({ error: "No users found" });
      }
      res.json(users[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Get all claims
  app.get("/api/claims", async (req, res) => {
    try {
      const claims = await storage.getAllClaims();
      res.json(claims);
    } catch (error) {
      res.status(500).json({ error: "Failed to get claims" });
    }
  });

  // Get active claims
  app.get("/api/claims/active", async (req, res) => {
    try {
      const claims = await storage.getActiveClaims();
      res.json(claims);
    } catch (error) {
      res.status(500).json({ error: "Failed to get active claims" });
    }
  });

  // Get specific claim
  app.get("/api/claims/:id", async (req, res) => {
    try {
      const claim = await storage.getClaim(req.params.id);
      if (!claim) {
        return res.status(404).json({ error: "Claim not found" });
      }
      res.json(claim);
    } catch (error) {
      res.status(500).json({ error: "Failed to get claim" });
    }
  });

  // Create a new claim
  app.post("/api/claims", async (req, res) => {
    try {
      const validatedData = insertClaimSchema.parse(req.body);
      const claim = await storage.createClaim(validatedData);
      res.status(201).json(claim);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid claim data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create claim" });
    }
  });

  // Place a bet
  app.post("/api/bets", async (req, res) => {
    try {
      const validatedData = insertBetSchema.parse(req.body);
      
      // Get the claim to update its stats
      const claim = await storage.getClaim(validatedData.claimId);
      if (!claim) {
        return res.status(404).json({ error: "Claim not found" });
      }

      // Check if claim is still active
      if (claim.status !== "open" || claim.expiresAt <= new Date()) {
        return res.status(400).json({ error: "Claim is no longer active" });
      }

      // Get the user to check balance
      const user = await storage.getUser(validatedData.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.tokenBalance < validatedData.amount) {
        return res.status(400).json({ error: "Insufficient token balance" });
      }

      // Calculate current odds before placing bet
      const totalStake = claim.totalYesStake + claim.totalNoStake;
      const yesOdds = totalStake === 0 ? 50 : (claim.totalYesStake / totalStake) * 100;
      
      // Create the bet
      const bet = await storage.createBet({
        ...validatedData,
        odds: yesOdds.toString(),
      });

      // Update user balance
      await storage.updateUser(validatedData.userId, {
        tokenBalance: user.tokenBalance - validatedData.amount,
        totalBets: user.totalBets + 1,
      });

      // Update claim stats
      const existingUserBets = await storage.getBetsByClaimAndUser(validatedData.claimId, validatedData.userId);
      const isNewBettor = existingUserBets.length === 0;

      await storage.updateClaim(validatedData.claimId, {
        totalYesBets: validatedData.position ? claim.totalYesBets + 1 : claim.totalYesBets,
        totalNoBets: !validatedData.position ? claim.totalNoBets + 1 : claim.totalNoBets,
        totalYesStake: validatedData.position ? claim.totalYesStake + validatedData.amount : claim.totalYesStake,
        totalNoStake: !validatedData.position ? claim.totalNoStake + validatedData.amount : claim.totalNoStake,
        totalBettors: isNewBettor ? claim.totalBettors + 1 : claim.totalBettors,
      });

      res.status(201).json(bet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid bet data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to place bet" });
    }
  });

  // Get user's bets
  app.get("/api/users/:userId/bets", async (req, res) => {
    try {
      const bets = await storage.getBetsByUser(req.params.userId);
      res.json(bets);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user bets" });
    }
  });

  // Get bets for a specific claim
  app.get("/api/claims/:claimId/bets", async (req, res) => {
    try {
      const bets = await storage.getBetsByClaim(req.params.claimId);
      res.json(bets);
    } catch (error) {
      res.status(500).json({ error: "Failed to get claim bets" });
    }
  });

  // Get resolutions for a claim
  app.get("/api/claims/:claimId/resolutions", async (req, res) => {
    try {
      const resolutions = await storage.getResolutionsByClaim(req.params.claimId);
      res.json(resolutions);
    } catch (error) {
      res.status(500).json({ error: "Failed to get resolutions" });
    }
  });

  // Create a resolution
  app.post("/api/resolutions", async (req, res) => {
    try {
      const validatedData = insertResolutionSchema.parse(req.body);
      const resolution = await storage.createResolution(validatedData);
      res.status(201).json(resolution);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid resolution data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create resolution" });
    }
  });

  // Vote on a resolution
  app.post("/api/resolutions/:resolutionId/vote", async (req, res) => {
    try {
      const { userId, isValid } = req.body;
      
      // Check if user already voted
      const existingVote = await storage.getVoteByResolutionAndUser(req.params.resolutionId, userId);
      if (existingVote) {
        return res.status(400).json({ error: "User already voted on this resolution" });
      }

      const vote = await storage.createResolutionVote({
        resolutionId: req.params.resolutionId,
        userId,
        isValid,
      });

      // Update resolution vote counts
      const resolution = await storage.getResolution(req.params.resolutionId);
      if (resolution) {
        await storage.updateResolution(req.params.resolutionId, {
          votesValid: isValid ? resolution.votesValid + 1 : resolution.votesValid,
          votesInvalid: !isValid ? resolution.votesInvalid + 1 : resolution.votesInvalid,
        });
      }

      res.status(201).json(vote);
    } catch (error) {
      res.status(500).json({ error: "Failed to vote on resolution" });
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topUsers = await storage.getTopUsers(limit);
      res.json(topUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
