import { Account, InsertUser, Transaction, User } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { randomUUID } from "crypto";

const MemoryStore = createMemoryStore(session);

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private accounts: Map<number, Account>;
  private transactions: Transaction[];
  readonly sessionStore: session.Store;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.accounts = new Map();
    this.transactions = [];
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAccount(userId: number): Promise<Account | undefined> {
    return Array.from(this.accounts.values()).find(
      (account) => account.userId === userId,
    );
  }

  async createAccount(userId: number): Promise<Account> {
    const id = this.currentId++;
    const account: Account = {
      id,
      userId,
      balance: "0",
      accountNumber: randomUUID(),
    };
    this.accounts.set(id, account);
    return account;
  }

  async updateBalance(accountId: number, newBalance: string): Promise<void> {
    const account = this.accounts.get(accountId);
    if (!account) throw new Error("Account not found");
    this.accounts.set(accountId, { ...account, balance: newBalance });
  }

  async createTransaction(transaction: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
    const id = this.currentId++;
    const newTransaction: Transaction = {
      ...transaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  async getTransactions(accountId: number): Promise<Transaction[]> {
    return this.transactions.filter(
      (t) => t.fromAccountId === accountId || t.toAccountId === accountId,
    );
  }
}

export const storage = new MemStorage();