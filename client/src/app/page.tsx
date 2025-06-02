"use client";
import AppLayout from "@/components/layout/app-layout";
import UpcomingTasks from "@/components/dashboard/upcoming-tasks";
import ActiveHabits from "@/components/dashboard/active-habits";
import GoalsInProgress from "@/components/dashboard/goals-in-progress";
import FinancialOverview from "@/components/dashboard/financial-overview";
import { useGetUpcomingTasks } from "@/services/task-service";
import { useGetActiveHabits } from "@/services/habit-service";
import { useGetGoalsInProgress } from "@/services/goal-service";
import { useGetFinancialOverview } from "@/services/finance-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DashboardPage() {
  const { data: upcomingTasks = [], isLoading: tasksLoading, error: tasksError } = useGetUpcomingTasks();
  const { data: activeHabits = [], isLoading: habitsLoading, error: habitsError } = useGetActiveHabits();
  const { data: goalsInProgress = [], isLoading: goalsLoading, error: goalsError } = useGetGoalsInProgress();
  const { data: financialOverview, isLoading: financialLoading, error: financialError } = useGetFinancialOverview();

  const hasError = tasksError || habitsError || goalsError || financialError;
  const isLoading = tasksLoading || habitsLoading || goalsLoading || financialLoading;

  if (hasError) {
    return (
      <AppLayout pageTitle="Painel">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar dados do dashboard. Verifique se o servidor está rodando na porta 3001.
          </AlertDescription>
        </Alert>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle="Painel">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FinancialOverview
          overview={financialOverview}
          isLoading={financialLoading}
        />
        <UpcomingTasks
          tasks={upcomingTasks}
          isLoading={tasksLoading}
        />
        <ActiveHabits
          habits={activeHabits}
          isLoading={habitsLoading}
        />
      </div>
      <Separator className="my-8" />
      <div className="grid gap-6">
        <GoalsInProgress
          goals={goalsInProgress}
          isLoading={goalsLoading}
        />
      </div>
    </AppLayout>
  );
}
