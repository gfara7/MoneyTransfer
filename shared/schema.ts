import { pgTable, text, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Existing tables remain unchanged
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  accountNumber: text("account_number").notNull().unique(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  fromAccountId: integer("from_account_id").notNull(),
  toAccountId: integer("to_account_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  fromCurrency: text("from_currency").notNull(),
  toCurrency: text("to_currency").notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 6 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  pickupLocation: text("pickup_location"),
  transferMethod: text("transfer_method"),
});

// New schema for bank information
export const bankAccounts = pgTable("bank_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  swiftCode: text("swift_code"),
  iban: text("iban"),
});

// Define pickup locations
export const PICKUP_LOCATIONS = ["Damascus", "Aleppo", "Rif-Dimashk", "Lattakia", "Homs"] as const;
export const pickupLocationSchema = z.enum(PICKUP_LOCATIONS);

// Define transfer methods
export const TRANSFER_METHODS = ["bank_transfer", "credit_card", "cash"] as const;
export const transferMethodSchema = z.enum(TRANSFER_METHODS);

// Update schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAccountSchema = createInsertSchema(accounts).pick({
  userId: true,
  accountNumber: true,
  currency: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  fromAccountId: true,
  toAccountId: true,
  amount: true,
  fromCurrency: true,
  toCurrency: true,
  exchangeRate: true,
  description: true,
  pickupLocation: true,
  transferMethod: true,
});

export const transferSchema = z.object({
  toUsername: z.string(),
  amount: z.string(),
  currency: z.string(),
  description: z.string().optional(),
  pickupLocation: pickupLocationSchema.optional(),
  transferMethod: transferMethodSchema,
});

export const bankAccountSchema = createInsertSchema(bankAccounts);

// Supported currencies
export const SUPPORTED_CURRENCIES = ["USD", "EUR", "SYP"] as const;
export const currencySchema = z.enum(SUPPORTED_CURRENCIES);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Transfer = z.infer<typeof transferSchema>;
export type Currency = z.infer<typeof currencySchema>;
export type BankAccount = typeof bankAccounts.$inferSelect;
export type PickupLocation = z.infer<typeof pickupLocationSchema>;
export type TransferMethod = z.infer<typeof transferMethodSchema>;