import { type User, type InsertUser, type Claim, type InsertClaim, type Bet, type InsertBet, type Resolution, type InsertResolution, type ResolutionVote, type InsertResolutionVote } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getTopUsers(limit: number): Promise<User[]>;

  // Claims
  getClaim(id: string): Promise<Claim | undefined>;
  getAllClaims(): Promise<Claim[]>;
  getActiveClaims(): Promise<Claim[]>;
  getExpiredClaims(): Promise<Claim[]>;
  createClaim(claim: InsertClaim): Promise<Claim>;
  updateClaim(id: string, updates: Partial<Claim>): Promise<Claim | undefined>;

  // Bets
  getBet(id: string): Promise<Bet | undefined>;
  getBetsByUser(userId: string): Promise<Bet[]>;
  getBetsByClaimAndUser(claimId: string, userId: string): Promise<Bet[]>;
  getBetsByClaim(claimId: string): Promise<Bet[]>;
  createBet(bet: InsertBet): Promise<Bet>;
  updateBet(id: string, updates: Partial<Bet>): Promise<Bet | undefined>;

  // Resolutions
  getResolution(id: string): Promise<Resolution | undefined>;
  getResolutionsByClaim(claimId: string): Promise<Resolution[]>;
  createResolution(resolution: InsertResolution): Promise<Resolution>;
  updateResolution(id: string, updates: Partial<Resolution>): Promise<Resolution | undefined>;

  // Resolution Votes
  getResolutionVote(id: string): Promise<ResolutionVote | undefined>;
  getVotesByResolution(resolutionId: string): Promise<ResolutionVote[]>;
  getVoteByResolutionAndUser(resolutionId: string, userId: string): Promise<ResolutionVote | undefined>;
  createResolutionVote(vote: InsertResolutionVote): Promise<ResolutionVote>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private claims: Map<string, Claim> = new Map();
  private bets: Map<string, Bet> = new Map();
  private resolutions: Map<string, Resolution> = new Map();
  private resolutionVotes: Map<string, ResolutionVote> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Create default user
    const defaultUser: User = {
      id: randomUUID(),
      username: "user_" + Math.random().toString(36).substr(2, 8),
      tokenBalance: 1000,
      accuracyScore: "0.00",
      totalBets: 0,
      totalWins: 0,
      totalLosses: 0,
      joinDate: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create sample claims
    const sampleClaims: InsertClaim[] = [
      {
        text: "Bitcoin will reach $80,000 before the end of 2024",
        creatorId: defaultUser.id,
        creatorUsername: "cryptoOracle",
        expiresAt: new Date("2024-12-31"),
        status: "open",
      },
      {
        text: "Apple will announce a foldable iPhone at WWDC 2024",
        creatorId: defaultUser.id,
        creatorUsername: "techPredictor",
        expiresAt: new Date("2024-06-15"),
        status: "open",
      },
      {
        text: "Donald Trump will win the 2024 presidential election",
        creatorId: defaultUser.id,
        creatorUsername: "politicsGuru",
        expiresAt: new Date("2024-11-05"),
        status: "open",
      },
      {
        text: "Netflix subscriber count will exceed 250 million by end of 2024",
        creatorId: defaultUser.id,
        creatorUsername: "streamingAnalyst",
        expiresAt: new Date("2024-12-31"),
        status: "open",
      },
      {
        text: "Tesla stock will hit $300 by October 2024",
        creatorId: defaultUser.id,
        creatorUsername: "marketWatch",
        expiresAt: new Date("2024-10-31"),
        status: "expired",
      },
    ];

    sampleClaims.forEach(claimData => {
      const claim: Claim = {
        ...claimData,
        id: randomUUID(),
        totalYesBets: Math.floor(Math.random() * 200) + 50,
        totalNoBets: Math.floor(Math.random() * 200) + 50,
        totalYesStake: Math.floor(Math.random() * 10000) + 2000,
        totalNoStake: Math.floor(Math.random() * 10000) + 2000,
        totalBettors: Math.floor(Math.random() * 500) + 100,
        resolutionOutcome: null,
        createdAt: new Date(),
      };
      this.claims.set(claim.id, claim);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      joinDate: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getTopUsers(limit: number): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => parseFloat(b.accuracyScore || "0") - parseFloat(a.accuracyScore || "0"))
      .slice(0, limit);
  }

  // Claims
  async getClaim(id: string): Promise<Claim | undefined> {
    return this.claims.get(id);
  }

  async getAllClaims(): Promise<Claim[]> {
    return Array.from(this.claims.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getActiveClaims(): Promise<Claim[]> {
    return Array.from(this.claims.values())
      .filter(claim => claim.status === "open" && claim.expiresAt > new Date())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getExpiredClaims(): Promise<Claim[]> {
    return Array.from(this.claims.values())
      .filter(claim => claim.status === "expired" || claim.expiresAt <= new Date());
  }

  async createClaim(insertClaim: InsertClaim): Promise<Claim> {
    const id = randomUUID();
    const claim: Claim = {
      ...insertClaim,
      id,
      totalYesBets: 0,
      totalNoBets: 0,
      totalYesStake: 0,
      totalNoStake: 0,
      totalBettors: 0,
      resolutionOutcome: null,
      createdAt: new Date(),
    };
    this.claims.set(id, claim);
    return claim;
  }

  async updateClaim(id: string, updates: Partial<Claim>): Promise<Claim | undefined> {
    const claim = this.claims.get(id);
    if (!claim) return undefined;
    
    const updatedClaim = { ...claim, ...updates };
    this.claims.set(id, updatedClaim);
    return updatedClaim;
  }

  // Bets
  async getBet(id: string): Promise<Bet | undefined> {
    return this.bets.get(id);
  }

  async getBetsByUser(userId: string): Promise<Bet[]> {
    return Array.from(this.bets.values())
      .filter(bet => bet.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBetsByClaimAndUser(claimId: string, userId: string): Promise<Bet[]> {
    return Array.from(this.bets.values())
      .filter(bet => bet.claimId === claimId && bet.userId === userId);
  }

  async getBetsByClaim(claimId: string): Promise<Bet[]> {
    return Array.from(this.bets.values())
      .filter(bet => bet.claimId === claimId);
  }

  async createBet(insertBet: InsertBet): Promise<Bet> {
    const id = randomUUID();
    const bet: Bet = {
      ...insertBet,
      id,
      isResolved: false,
      payout: 0,
      createdAt: new Date(),
    };
    this.bets.set(id, bet);
    return bet;
  }

  async updateBet(id: string, updates: Partial<Bet>): Promise<Bet | undefined> {
    const bet = this.bets.get(id);
    if (!bet) return undefined;
    
    const updatedBet = { ...bet, ...updates };
    this.bets.set(id, updatedBet);
    return updatedBet;
  }

  // Resolutions
  async getResolution(id: string): Promise<Resolution | undefined> {
    return this.resolutions.get(id);
  }

  async getResolutionsByClaim(claimId: string): Promise<Resolution[]> {
    return Array.from(this.resolutions.values())
      .filter(resolution => resolution.claimId === claimId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createResolution(insertResolution: InsertResolution): Promise<Resolution> {
    const id = randomUUID();
    const resolution: Resolution = {
      ...insertResolution,
      id,
      votesValid: 0,
      votesInvalid: 0,
      finalDecision: null,
      createdAt: new Date(),
    };
    this.resolutions.set(id, resolution);
    return resolution;
  }

  async updateResolution(id: string, updates: Partial<Resolution>): Promise<Resolution | undefined> {
    const resolution = this.resolutions.get(id);
    if (!resolution) return undefined;
    
    const updatedResolution = { ...resolution, ...updates };
    this.resolutions.set(id, updatedResolution);
    return updatedResolution;
  }

  // Resolution Votes
  async getResolutionVote(id: string): Promise<ResolutionVote | undefined> {
    return this.resolutionVotes.get(id);
  }

  async getVotesByResolution(resolutionId: string): Promise<ResolutionVote[]> {
    return Array.from(this.resolutionVotes.values())
      .filter(vote => vote.resolutionId === resolutionId);
  }

  async getVoteByResolutionAndUser(resolutionId: string, userId: string): Promise<ResolutionVote | undefined> {
    return Array.from(this.resolutionVotes.values())
      .find(vote => vote.resolutionId === resolutionId && vote.userId === userId);
  }

  async createResolutionVote(insertVote: InsertResolutionVote): Promise<ResolutionVote> {
    const id = randomUUID();
    const vote: ResolutionVote = {
      ...insertVote,
      id,
      createdAt: new Date(),
    };
    this.resolutionVotes.set(id, vote);
    return vote;
  }
}

export const storage = new MemStorage();
