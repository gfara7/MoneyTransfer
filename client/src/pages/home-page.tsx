import { useAuth } from "@/hooks/use-auth";
import AccountCard from "@/components/account-card";
import TransferForm from "@/components/transfer-form";
import TransactionsList from "@/components/transactions-list";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/language-switcher";
import DepositForm from "@/components/deposit-form";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">MoneyTransfer</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              {t('welcome_user', { username: user?.username })}
            </span>
            <LanguageSwitcher />
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? t('loggingOut') : t('logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <AccountCard />
            <DepositForm />
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