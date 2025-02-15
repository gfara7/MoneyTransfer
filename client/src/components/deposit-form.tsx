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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SUPPORTED_CURRENCIES, TRANSFER_METHODS } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Wallet, CreditCard, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const depositSchema = z.object({
  amount: z.string(),
  currency: z.string(),
  transferMethod: z.enum(TRANSFER_METHODS),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  swiftCode: z.string().optional(),
});

type DepositData = z.infer<typeof depositSchema>;

export default function DepositForm() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<DepositData>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      currency: "USD",
      transferMethod: "cash",
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
        <Tabs defaultValue="cash" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cash" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              {t("cash")}
            </TabsTrigger>
            <TabsTrigger value="credit_card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {t("creditCard")}
            </TabsTrigger>
            <TabsTrigger value="bank_transfer" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {t("bankTransfer")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cash">
            <form
              onSubmit={form.handleSubmit((data) => {
                data.transferMethod = "cash";
                depositMutation.mutate(data);
              })}
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
          </TabsContent>

          <TabsContent value="credit_card">
            <form
              onSubmit={form.handleSubmit((data) => {
                data.transferMethod = "credit_card";
                depositMutation.mutate(data);
              })}
              className="space-y-4"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">{t("cardNumber")}</Label>
                  <Input
                    id="cardNumber"
                    {...form.register("cardNumber")}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">{t("expiryDate")}</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      {...form.register("expiryDate")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      maxLength={4}
                      {...form.register("cvv")}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cc-amount">{t("amount")}</Label>
                    <Input
                      id="cc-amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      {...form.register("amount")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cc-currency">{t("currency")}</Label>
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
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={depositMutation.isPending}
              >
                {depositMutation.isPending ? t("depositing") : t("deposit")}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="bank_transfer">
            <form
              onSubmit={form.handleSubmit((data) => {
                data.transferMethod = "bank_transfer";
                depositMutation.mutate(data);
              })}
              className="space-y-4"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">{t("bankName")}</Label>
                  <Input
                    id="bankName"
                    {...form.register("bankName")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">{t("accountNumber")}</Label>
                  <Input
                    id="accountNumber"
                    {...form.register("accountNumber")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="swiftCode">{t("swiftCode")}</Label>
                  <Input
                    id="swiftCode"
                    {...form.register("swiftCode")}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank-amount">{t("amount")}</Label>
                    <Input
                      id="bank-amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      {...form.register("amount")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank-currency">{t("currency")}</Label>
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
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={depositMutation.isPending}
              >
                {depositMutation.isPending ? t("depositing") : t("deposit")}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}