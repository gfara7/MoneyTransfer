import { useAuth } from "@/hooks/use-auth";
import AccountCard from "@/components/account-card";
import TransferForm from "@/components/transfer-form";
import TransactionsList from "@/components/transactions-list";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">MoneyTransfer</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Welcome, {user?.username}
            </span>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <AccountCard />
            <TransferForm />
          </div>
          <div>
            <TransactionsList />
          </div>
        </div>
      </main>
    </div>
  );
}
