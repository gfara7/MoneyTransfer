import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { transferSchema } from "@shared/schema";
import { ZodError } from "zod";

// Mock exchange rates (in production, this would come from an external API)
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.93,
  SYP: 2500,
};

function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  const fromRate = EXCHANGE_RATES[fromCurrency as keyof typeof EXCHANGE_RATES];
  const toRate = EXCHANGE_RATES[toCurrency as keyof typeof EXCHANGE_RATES];
  return (amount * toRate) / fromRate;
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/account", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    let account = await storage.getAccount(req.user.id);
    if (!account) {
      account = await storage.createAccount(req.user.id);
    }
    res.json(account);
  });

  app.get("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const account = await storage.getAccount(req.user.id);
    if (!account) return res.sendStatus(404);

    const transactions = await storage.getTransactions(account.id);
    res.json(transactions);
  });

  app.get("/api/exchange-rate", async (req, res) => {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).send("Missing currency parameters");
    }

    const rate = convertCurrency(1, from as string, to as string);
    res.json({
      fromCurrency: from,
      toCurrency: to,
      rate,
    });
  });

  app.post("/api/transfer", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const transfer = transferSchema.parse(req.body);
      const fromAccount = await storage.getAccount(req.user.id);
      if (!fromAccount) return res.status(404).send("Source account not found");

      const toUser = await storage.getUserByUsername(transfer.toUsername);
      if (!toUser) return res.status(404).send("Recipient not found");

      const toAccount = await storage.getAccount(toUser.id);
      if (!toAccount) return res.status(404).send("Recipient account not found");

      const amount = parseFloat(transfer.amount);
      if (amount <= 0) return res.status(400).send("Invalid amount");

      const fromBalance = parseFloat(fromAccount.balance);
      if (fromBalance < amount) {
        return res.status(400).send("Insufficient funds");
      }

      // Convert amount to recipient's currency
      const exchangeRate = convertCurrency(1, fromAccount.currency, toAccount.currency);
      const convertedAmount = amount * exchangeRate;

      await storage.updateBalance(fromAccount.id, (fromBalance - amount).toFixed(2));
      await storage.updateBalance(
        toAccount.id,
        (parseFloat(toAccount.balance) + convertedAmount).toFixed(2)
      );

      const transaction = await storage.createTransaction({
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        amount: amount.toFixed(2),
        fromCurrency: fromAccount.currency,
        toCurrency: toAccount.currency,
        exchangeRate: exchangeRate.toString(),
        description: transfer.description || "Transfer",
        pickupLocation: transfer.pickupLocation || null,
        transferMethod: transfer.transferMethod,
      });

      res.json(transaction);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(error.errors);
      } else {
        throw error;
      }
    }
  });

  app.post("/api/deposit", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { amount, currency, transferMethod, cardNumber, bankName } = req.body;
      const parsedAmount = parseFloat(amount);

      if (parsedAmount <= 0) {
        return res.status(400).send("Invalid amount");
      }

      const account = await storage.getAccount(req.user.id);
      if (!account) return res.status(404).send("Account not found");

      // Convert amount to account's currency if needed
      const convertedAmount = convertCurrency(parsedAmount, currency, account.currency);

      const newBalance = (parseFloat(account.balance) + convertedAmount).toFixed(2);
      await storage.updateBalance(account.id, newBalance);

      // Create a deposit transaction
      const transaction = await storage.createTransaction({
        fromAccountId: account.id,
        toAccountId: account.id,
        amount: parsedAmount.toFixed(2),
        fromCurrency: currency,
        toCurrency: account.currency,
        exchangeRate: (convertedAmount / parsedAmount).toString(),
        description: `Deposit via ${transferMethod}${
          cardNumber ? ` (Card: ${cardNumber.slice(-4)})` : ""
        }${bankName ? ` (Bank: ${bankName})` : ""}`,
        transferMethod,
        pickupLocation: null,
      });

      res.json(transaction);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(error.errors);
      } else {
        throw error;
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}