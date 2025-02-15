import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { transferSchema } from "@shared/schema";
import { ZodError } from "zod";

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

      await storage.updateBalance(fromAccount.id, (fromBalance - amount).toFixed(2));
      await storage.updateBalance(toAccount.id, (parseFloat(toAccount.balance) + amount).toFixed(2));

      const transaction = await storage.createTransaction({
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        amount: amount.toFixed(2),
        description: transfer.description || "Transfer",
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