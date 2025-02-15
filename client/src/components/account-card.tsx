import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Account } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletIcon } from "lucide-react";

export default function AccountCard() {
  const { data: account, isLoading } = useQuery<Account>({
    queryKey: ["/api/account"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Account</CardTitle>
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
          Your Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-3xl font-bold">
            ${account?.balance.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            Account Number: {account?.accountNumber}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
