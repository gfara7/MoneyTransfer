import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SUPPORTED_CURRENCIES } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

const depositSchema = z.object({
  amount: z.string(),
  currency: z.string(),
});

type DepositData = z.infer<typeof depositSchema>;

export default function DepositForm() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<DepositData>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      currency: "USD",
    }
  });

  const depositMutation = useMutation({
    mutationFn: async (data: DepositData) => {
      const res = await apiRequest("POST", "/api/deposit", data);
      return res.json();
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/account"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: t("depositSuccess"),
        description: t("depositSuccessMessage"),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("depositFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          {t("deposit")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((data) => depositMutation.mutate(data))}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">{t("amount")}</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                {...form.register("amount")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">{t("currency")}</Label>
              <Select
                onValueChange={(value) => form.setValue("currency", value)}
                defaultValue={form.watch("currency")}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCurrency")} />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={depositMutation.isPending}
          >
            {depositMutation.isPending ? t("depositing") : t("deposit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
