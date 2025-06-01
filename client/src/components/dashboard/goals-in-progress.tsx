
"use client";
import type { Goal, GoalCategory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Tag } from "lucide-react"; // Removido Flag, Adicionado Tag
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Importado o Badge oficial
import { cn } from "@/lib/utils";

interface GoalsInProgressProps {
  goals: Goal[];
  isLoading?: boolean;
}

const goalCategoryOptions: { value: GoalCategory; label: string }[] = [
  { value: 'PERSONAL', label: 'Pessoal' },
  { value: 'FINANCIAL', label: 'Financeiro' },
  { value: 'HEALTH', label: 'Saúde' },
  { value: 'CAREER', label: 'Carreira' },
  { value: 'LEARNING', label: 'Aprendizado' },
  { value: 'OTHER', label: 'Outro' },
];

const translateGoalCategory = (category: GoalCategory): string => {
  return goalCategoryOptions.find(opt => opt.value === category)?.label || category;
};

const goalCategoryColors: Record<GoalCategory, string> = {
  PERSONAL: "bg-purple-500 hover:bg-purple-600 text-white",
  FINANCIAL: "bg-green-500 hover:bg-green-600 text-white",
  HEALTH: "bg-blue-500 hover:bg-blue-600 text-white",
  CAREER: "bg-orange-500 hover:bg-orange-600 text-white",
  LEARNING: "bg-indigo-500 hover:bg-indigo-600 text-white",
  OTHER: "bg-gray-500 hover:bg-gray-600 text-white",
};


export default function GoalsInProgress({ goals, isLoading = false }: GoalsInProgressProps) {
  const inProgress = goals.filter(goal => goal.status === 'IN_PROGRESS').slice(0, 4);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium font-headline flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Metas em Progresso
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/goals">Ver Todas</Link>
        </Button>
      </CardHeader>      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-3 bg-background rounded-md border">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-40" />
                  <div className="h-5 bg-muted rounded animate-pulse w-20" />
                </div>
                <div className="h-3 bg-muted rounded animate-pulse w-full mb-2" />
                <div className="h-2 bg-muted rounded animate-pulse w-full mb-1" />
                <div className="h-3 bg-muted rounded animate-pulse w-24 ml-auto" />
              </div>
            ))}
          </div>
        ) : inProgress.length > 0 ? (
          <ul className="space-y-4">
            {inProgress.map(goal => {
              const progressValue = (goal.currentValue != null && goal.targetValue != null && goal.targetValue > 0)
                ? (goal.currentValue / goal.targetValue) * 100
                : 0; // Simplificado: se não tem targetValue ou é 0, progresso é 0 para metas IN_PROGRESS

              return (
                <li key={goal.id} className="p-3 bg-background rounded-md border">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-semibold text-sm flex-1 break-words">{goal.name}</span>
                    <Badge
                      className={cn(
                        "w-fit text-xs flex items-center gap-1 border-transparent py-0.5 px-1.5",
                        goalCategoryColors[goal.category] || "bg-gray-500 text-white"
                      )}
                    >
                      <Tag className="h-3 w-3" />
                      {translateGoalCategory(goal.category)}
                    </Badge>
                  </div>
                  {goal.description && <p className="text-xs text-muted-foreground mb-2 break-words">{goal.description}</p>}
                  {(goal.targetValue !== null && goal.targetValue > 0) && (
                    <>
                      <Progress value={Math.min(progressValue, 100)} className="h-2 w-full" />
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        {goal.currentValue ?? 0} / {goal.targetValue} {goal.category === 'FINANCIAL' ? 'R$' : ''}
                      </p>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma meta em progresso atualmente. Defina novas ambições!</p>
        )}
      </CardContent>
    </Card>
  );
}
