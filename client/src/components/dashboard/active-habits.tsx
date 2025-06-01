
"use client";
import type { Habit } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Repeat, TrendingUp, CheckCircle, XCircle, MinusCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import { format, parseISO } from 'date-fns';

interface ActiveHabitsProps {
  habits: Habit[];
  isLoading?: boolean;
}

const getTodayStatus = (habit: Habit) => {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const progressToday = habit.progress.find(p => p.date === todayStr);
  if (progressToday) {
    switch (progressToday.status) {
      case 'DONE':
        return { text: 'Concluído Hoje', icon: CheckCircle, color: 'text-green-500' };
      case 'SKIPPED':
        return { text: 'Pulado Hoje', icon: MinusCircle, color: 'text-yellow-500' };
      case 'MISSED':
        return { text: 'Perdido Hoje', icon: XCircle, color: 'text-red-500' };
      default:
        return { text: 'Status Desconhecido', icon: HelpCircle, color: 'text-muted-foreground' };
    }
  }
  return { text: 'Não Registrado Hoje', icon: HelpCircle, color: 'text-muted-foreground' };
};

export default function ActiveHabits({ habits, isLoading = false }: ActiveHabitsProps) {
  const activeToDisplay = habits.slice(0, 3); // Mostrar alguns hábitos ativos

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium font-headline flex items-center gap-2">
          <Repeat className="h-5 w-5 text-primary" />
          Hábitos Ativos
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/habits">Ver Todos</Link>
        </Button>      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-3 bg-background rounded-md border">
                <div className="flex justify-between items-center mb-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-32" />
                  <div className="h-3 bg-muted rounded animate-pulse w-20" />
                </div>
                <div className="h-3 bg-muted rounded animate-pulse w-24" />
              </div>
            ))}
          </div>
        ) : activeToDisplay.length > 0 ? (
          <ul className="space-y-3">
            {activeToDisplay.map(habit => {
              const todayStatus = getTodayStatus(habit);
              const IconComponent = todayStatus.icon;
              return (
                <li key={habit.id} className="p-3 bg-background rounded-md border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm">{habit.name}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Sequência: {habit.streak}
                    </div>
                  </div>
                  <div className={`flex items-center text-xs ${todayStatus.color}`}>
                    <IconComponent className="mr-1.5 h-4 w-4" />
                    {todayStatus.text}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum hábito ativo. Hora de construir alguns!</p>
        )}
      </CardContent>
    </Card>
  );
}
