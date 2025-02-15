import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transferSchema, Transfer, SUPPORTED_CURRENCIES } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SendIcon, RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

type ExchangeRate = {
  rate: number;
  fromCurrency: string;
  toCurrency: string;
};

export default function TransferForm() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<Transfer>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      currency: "USD",
    }
  });

  const { data: exchangeRate, isLoading: isLoadingRate } = useQuery<ExchangeRate>({
    queryKey: ["/api/exchange-rate", form.watch("currency")],
    enabled: !!form.watch("currency"),
  });

  const transferMutation = useMutation({
    mutationFn: async (data: Transfer) => {
      const res = await apiRequest("POST", "/api/transfer", data);
      return res.json();
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/account"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: t("transferSuccess"),
        description: t("transferSuccessMessage"),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("transferFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SendIcon className="h-5 w-5" />
          {t("sendMoney")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((data) => transferMutation.mutate(data))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="toUsername">{t("recipientUsername")}</Label>
            <Input
              id="toUsername"
              {...form.register("toUsername")}
              required
            />
          </div>
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

          {isLoadingRate ? (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 animate-spin" />
              {t("loadingRate")}
            </div>
          ) : exchangeRate && (
            <div className="text-sm text-muted-foreground">
              {t("exchangeRateText", {
                from: exchangeRate.fromCurrency,
                rate: exchangeRate.rate.toFixed(6),
                to: exchangeRate.toCurrency
              })}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              {...form.register("description")}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={transferMutation.isPending}
          >
            {transferMutation.isPending ? t("sending") : t("send")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}