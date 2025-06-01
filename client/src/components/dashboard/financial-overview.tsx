
"use client";
import type { Transaction } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FinancialOverviewProps {
  overview?: any;
  isLoading?: boolean;
}

export default function FinancialOverview({ overview, isLoading = false }: FinancialOverviewProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium font-headline flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Visão Geral Financeira
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/finances">Ver Tudo</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted rounded animate-pulse mb-1" />
          <div className="h-3 bg-muted rounded animate-pulse w-24 mb-4" />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center p-2 rounded-md bg-green-500/10">
              <div className="h-5 w-5 bg-muted rounded animate-pulse mr-2" />
              <div className="flex-1">
                <div className="h-3 bg-muted rounded animate-pulse mb-1" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center p-2 rounded-md bg-red-500/10">
              <div className="h-5 w-5 bg-muted rounded animate-pulse mr-2" />
              <div className="flex-1">
                <div className="h-3 bg-muted rounded animate-pulse mb-1" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalIncome = overview?.totalIncome || 0;
  const totalExpenses = overview?.totalExpenses || 0; const balance = totalIncome - totalExpenses;

  // Get recent transactions for display (e.g., last 3)
  const recentTransactions = overview?.recentTransactions || [];

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium font-headline flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Visão Geral Financeira
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/finances">Ver Tudo</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">R${balance.toFixed(2)}</div>
        <p className="text-xs text-muted-foreground mb-4">Saldo Atual</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center p-2 rounded-md bg-green-500/10">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="text-xs text-green-700">Receita Total</p>
              <p className="text-sm font-semibold text-green-600">R${totalIncome.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center p-2 rounded-md bg-red-500/10">
            <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <p className="text-xs text-red-700">Despesa Total</p>
              <p className="text-sm font-semibold text-red-600">R${totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <h3 className="text-sm font-medium mb-2">Transações Recentes</h3>
        {recentTransactions.length > 0 ? (
          <ul className="space-y-2">
            {recentTransactions.map(t => (
              <li key={t.id} className="flex justify-between items-center text-xs p-2 rounded bg-muted/50">
                <span>{t.description}</span>
                <span className={t.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                  {t.type === 'income' ? '+' : '-'}R${t.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">Nenhuma transação recente.</p>
        )}
      </CardContent>
    </Card>
  );
}
