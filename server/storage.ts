import { accounts, transactions, users } from "@shared/schema";
import type { Account, InsertUser, Transaction, User } from "@shared/schema";
import { db } from "./db";
import { eq, or } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import crypto from 'crypto';

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAccount(userId: number): Promise<Account | undefined>;
  createAccount(userId: number): Promise<Account>;
  updateBalance(accountId: number, newBalance: string): Promise<void>;

  createTransaction(transaction: Omit<Transaction, "id" | "createdAt">): Promise<Transaction>;
  getTransactions(accountId: number): Promise<Transaction[]>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  readonly sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAccount(userId: number): Promise<Account | undefined> {
    const [account] = await db.select().from(accounts).where(eq(accounts.userId, userId));
    return account;
  }

  async createAccount(userId: number): Promise<Account> {
    const [account] = await db.insert(accounts)
      .values({
        userId,
        balance: "0",
        currency: "USD",
        accountNumber: crypto.randomUUID(),
      })
      .returning();
    return account;
  }

  async updateBalance(accountId: number, newBalance: string): Promise<void> {
    await db.update(accounts)
      .set({ balance: newBalance })
      .where(eq(accounts.id, accountId));
  }

  async createTransaction(transaction: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async getTransactions(accountId: number): Promise<Transaction[]> {
    return db.select()
      .from(transactions)
      .where(
        or(
          eq(transactions.fromAccountId, accountId),
          eq(transactions.toAccountId, accountId)
        )
      )
      .orderBy(transactions.createdAt);
  }
}

export const storage = new DatabaseStorage();