
"use client";
import type { Task, Priority, TaskCategory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListChecks, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils";

interface UpcomingTasksProps {
  tasks: Task[];
  isLoading?: boolean;
}

// Definições de prioridade e categoria replicadas para este componente.
// Idealmente, seriam movidas para um local compartilhado (ex: src/lib/task-utils.ts)
const priorityOrder: Record<Priority, number> = {
  URGENT_IMPORTANT: 1,
  IMPORTANT_NOT_URGENT: 2,
  URGENT_NOT_IMPORTANT: 3,
  NOT_URGENT_NOT_IMPORTANT: 4,
};

const priorityBadgeMap: Record<Priority, { label: string; variant: "default" | "destructive" | "secondary" | "outline" }> = {
  URGENT_IMPORTANT: { label: "Fazer Primeiro", variant: "destructive" },
  IMPORTANT_NOT_URGENT: { label: "Agendar", variant: "default" },
  URGENT_NOT_IMPORTANT: { label: "Delegar", variant: "secondary" },
  NOT_URGENT_NOT_IMPORTANT: { label: "Eliminar", variant: "outline" },
};

const taskCategoryOptions: { value: TaskCategory; label: string }[] = [
  { value: 'FINANCIAL', label: 'Financeiro' },
  { value: 'HEALTH', label: 'Saúde' },
  { value: 'PERSONAL', label: 'Pessoal' },
  { value: 'WORK', label: 'Trabalho' },
  { value: 'LEARNING', label: 'Aprendizado' },
  { value: 'HOME', label: 'Casa' },
  { value: 'OTHER', label: 'Outro' },
];

const translateTaskCategory = (category: TaskCategory): string => {
  return taskCategoryOptions.find(opt => opt.value === category)?.label || category;
};

const taskCategoryColors: Record<TaskCategory, string> = {
  FINANCIAL: "bg-green-500 hover:bg-green-600 text-white",
  HEALTH: "bg-blue-500 hover:bg-blue-600 text-white",
  PERSONAL: "bg-purple-500 hover:bg-purple-600 text-white",
  WORK: "bg-yellow-500 hover:bg-yellow-600 text-black",
  LEARNING: "bg-indigo-500 hover:bg-indigo-600 text-white",
  HOME: "bg-pink-500 hover:bg-pink-600 text-white",
  OTHER: "bg-gray-500 hover:bg-gray-600 text-white",
};


export default function UpcomingTasks({ tasks, isLoading = false }: UpcomingTasksProps) {
  const upcoming = tasks
    .filter(task => task.repetitionsCompleted < task.repetitionsRequired)
    .sort((a, b) => {
      const priorityComparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityComparison !== 0) return priorityComparison;

      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate && !b.dueDate) return -1; // Tarefas com data vêm antes
      if (!a.dueDate && b.dueDate) return 1;  // Tarefas sem data vêm depois

      // Fallback para ordenação por data de criação se prioridade e data de vencimento forem iguais/nulas
      if (a.createdAt && b.createdAt) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    })
    .slice(0, 5);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium font-headline flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          Próximas Tarefas
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tasks">Ver Todas</Link>
        </Button>
      </CardHeader>      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col p-3 bg-background rounded-md border">
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="flex justify-between">
                  <div className="h-3 bg-muted rounded animate-pulse w-20" />
                  <div className="h-3 bg-muted rounded animate-pulse w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : upcoming.length > 0 ? (
          <ul className="space-y-3">
            {upcoming.map(task => (
              <li key={task.id} className="flex flex-col p-3 bg-background rounded-md border hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="font-semibold text-sm flex-1 break-words">{task.name}</span>
                  <Badge variant={priorityBadgeMap[task.priority].variant} className="text-xs whitespace-nowrap h-fit">
                    {priorityBadgeMap[task.priority].label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <Badge className={cn("w-fit text-xs flex items-center gap-1 border-transparent py-0.5 px-1.5", taskCategoryColors[task.category] || "bg-gray-500 text-white")}>
                    <Tag className="h-3 w-3" />
                    {translateTaskCategory(task.category)}
                  </Badge>
                  {task.dueDate && isValid(parseISO(task.dueDate)) && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Vence {formatDistanceToNow(parseISO(task.dueDate), { addSuffix: true, locale: ptBR })}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma tarefa futura. Muito bem!</p>
        )}
      </CardContent>
    </Card>
  );
}
