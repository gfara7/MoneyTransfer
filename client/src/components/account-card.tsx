import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Account } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AccountCard() {
  const { t } = useTranslation();
  const { data: account, isLoading } = useQuery<Account>({
    queryKey: ["/api/account"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("yourAccount")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WalletIcon className="h-5 w-5" />
          {t("yourAccount")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t("currentBalance")}</p>
          <p className="text-3xl font-bold">
            {account?.currency} ${parseFloat(account?.balance || "0").toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("accountNumber")}: {account?.accountNumber}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}