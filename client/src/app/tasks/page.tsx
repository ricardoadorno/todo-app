"use client";

import AppLayout from "@/components/layout/app-layout";
import { useState, useEffect, useMemo } from "react";
import type { Task, Priority, Recurrence, TaskCategory } from "@/types";
import { useGetTasks, useAddTask, useUpdateTask, useDeleteTask } from "@/services/task-service";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, ListChecks, ChevronLeft, ChevronRight, Tag, Check, CalendarDays, Archive, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format, parseISO, isValid, startOfDay, compareAsc, isAfter, isSameDay, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'URGENT_IMPORTANT', label: 'Fazer Primeiro (Urgente, Importante)' },
  { value: 'IMPORTANT_NOT_URGENT', label: 'Agendar (Importante, Não Urgente)' },
  { value: 'URGENT_NOT_IMPORTANT', label: 'Delegar (Urgente, Não Importante)' },
  { value: 'NOT_URGENT_NOT_IMPORTANT', label: 'Eliminar (Não Urgente, Não Importante)' },
];

const recurrenceOptions: { value: Recurrence; label: string }[] = [
  { value: 'NONE', label: 'Nenhuma' },
  { value: 'DAILY', label: 'Diariamente' },
  { value: 'WEEKLY', label: 'Semanalmente' },
  { value: 'MONTHLY', label: 'Mensalmente' },
  { value: 'YEARLY', label: 'Anualmente' },
];

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
  FINANCIAL: "bg-green-500 hover:bg-green-600 text-white border-transparent",
  HEALTH: "bg-blue-500 hover:bg-blue-600 text-white border-transparent",
  PERSONAL: "bg-purple-500 hover:bg-purple-600 text-white border-transparent",
  WORK: "bg-yellow-500 hover:bg-yellow-600 text-black border-transparent",
  LEARNING: "bg-indigo-500 hover:bg-indigo-600 text-white border-transparent",
  HOME: "bg-pink-500 hover:bg-pink-600 text-white border-transparent",
  OTHER: "bg-gray-500 hover:bg-gray-600 text-white border-transparent",
};

const priorityBadgeMap: Record<Priority, { label: string; variant: "default" | "destructive" | "secondary" | "outline" }> = {
  URGENT_IMPORTANT: { label: "Fazer Primeiro", variant: "destructive" },
  IMPORTANT_NOT_URGENT: { label: "Agendar", variant: "default" },
  URGENT_NOT_IMPORTANT: { label: "Delegar", variant: "secondary" },
  NOT_URGENT_NOT_IMPORTANT: { label: "Eliminar", variant: "outline" },
};

const TaskForm = ({ task, onSubmit, onCancel }: { task?: Task | null, onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void, onCancel: () => void }) => {
  const [name, setName] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState<Priority>(task?.priority || 'IMPORTANT_NOT_URGENT');
  const [dueDate, setDueDate] = useState(task?.dueDate ? format(parseISO(task.dueDate), "yyyy-MM-dd") : "");
  const [recurrence, setRecurrence] = useState<Recurrence>(task?.recurrence || 'NONE');
  const [repetitionsRequired, setRepetitionsRequired] = useState<string>(task?.repetitionsRequired?.toString() || "1");
  const [category, setCategory] = useState<TaskCategory>(task?.category || 'PERSONAL');
  const { toast } = useToast();

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description || "");
      setPriority(task.priority);
      setDueDate(task.dueDate ? format(parseISO(task.dueDate), "yyyy-MM-dd") : "");
      setRecurrence(task.recurrence);
      setRepetitionsRequired(task.repetitionsRequired.toString());
      setCategory(task.category);
    } else {
      setName("");
      setDescription("");
      setPriority('IMPORTANT_NOT_URGENT');
      setDueDate("");
      setRecurrence('NONE');
      setRepetitionsRequired("1");
      setCategory('PERSONAL');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedRepetitions = parseInt(repetitionsRequired, 10);
    if (isNaN(parsedRepetitions) || parsedRepetitions <= 0) {
      toast({ title: "Repetições Inválidas", description: "Por favor, insira um número positivo para as repetições necessárias.", variant: "destructive" });
      return;
    }
    if (!name.trim()) {
      toast({ title: "Nome Obrigatório", description: "Por favor, forneça um nome para a tarefa.", variant: "destructive" });
      return;
    }

    const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'repetitionsCompleted'> & { repetitionsCompleted?: number } = {
      name: name.trim(),
      description,
      priority,
      dueDate: dueDate ? startOfDay(new Date(dueDate)).toISOString() : null,
      recurrence,
      repetitionsRequired: parsedRepetitions,
      category,
      // Conditionally add repetitionsCompleted only if it's an existing task and task.repetitionsCompleted is a number
      ...(task && typeof task.repetitionsCompleted === 'number' && { repetitionsCompleted: task.repetitionsCompleted }),
    };

    onSubmit(taskData as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="task-name">Nome da Tarefa</Label>
        <Input id="task-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="task-description">Descrição (Opcional)</Label>
        <Textarea id="task-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="task-priority">Prioridade</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
            <SelectTrigger id="task-priority">
              {priority ? (
                <div className="flex items-center gap-2 w-full overflow-hidden">
                  <Badge
                    variant={priorityBadgeMap[priority].variant}
                    className="text-xs px-1.5 py-0.5 leading-tight whitespace-nowrap"
                  >
                    {priorityBadgeMap[priority].label}
                  </Badge>
                  <span className="truncate flex-1 text-left text-sm">
                    {priorityOptions.find(o => o.value === priority)?.label.split('(')[0].trim()}
                  </span>
                </div>
              ) : (
                <SelectValue placeholder="Selecione a prioridade" />
              )}
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  <div className="flex items-center gap-2 w-full">
                    <Badge
                      variant={priorityBadgeMap[opt.value].variant}
                      className="text-xs px-1.5 py-0.5 leading-tight whitespace-nowrap"
                    >
                      {priorityBadgeMap[opt.value].label}
                    </Badge>
                    <span className="flex-1">{opt.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="task-category">Categoria</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as TaskCategory)}>
            <SelectTrigger id="task-category">
              <div className="flex items-center gap-2 w-full text-sm">
                {category && <span className={cn("h-2.5 w-2.5 rounded-full", taskCategoryColors[category]?.split(' ')[0])}></span>}
                <SelectValue placeholder="Selecione a categoria" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {taskCategoryOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2.5 w-2.5 rounded-full", taskCategoryColors[opt.value]?.split(' ')[0])}></span>
                    {opt.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="task-duedate">Data de Conclusão (Opcional)</Label>
          <Input id="task-duedate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="task-recurrence">Recorrência</Label>
          <Select value={recurrence} onValueChange={(v) => setRecurrence(v as Recurrence)}>
            <SelectTrigger id="task-recurrence"><SelectValue placeholder="Selecione a recorrência" /></SelectTrigger>
            <SelectContent>
              {recurrenceOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="task-repetitions">Repetições Necessárias (mínimo 1)</Label>
        <Input id="task-repetitions" type="number" min="1" value={repetitionsRequired} onChange={(e) => setRepetitionsRequired(e.target.value)} required />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{task ? 'Salvar Alterações' : 'Adicionar Tarefa'}</Button>
      </DialogFooter>
    </form>
  );
};

const TaskCardDisplay = ({ task, onRepetitionChange, onToggleCheckboxCompletion, onEdit, onDelete }: {
  task: Task;
  onRepetitionChange: (taskId: string, change: number) => void;
  onToggleCheckboxCompletion: (taskId: string, checked: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}) => {
  const isCompleted = task.repetitionsCompleted >= task.repetitionsRequired;
  const progressPercent = task.repetitionsRequired > 0 ? (task.repetitionsCompleted / task.repetitionsRequired) * 100 : 0;

  return (
    <Card className={cn("transition-all duration-300 flex flex-col", isCompleted ? 'opacity-60 bg-muted/30' : 'bg-card hover:shadow-lg')}>
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className={cn("text-base font-semibold", isCompleted && task.repetitionsRequired === 1 ? 'line-through' : '')}>{task.name}</CardTitle>
          <Badge variant={priorityBadgeMap[task.priority].variant} className="w-fit text-xs whitespace-nowrap">
            {priorityBadgeMap[task.priority].label}
          </Badge>
        </div>
        <Badge className={cn("w-fit mt-1 text-xs flex items-center gap-1", taskCategoryColors[task.category] || "bg-gray-500 text-white")}>
          <Tag className="h-3 w-3" />
          {translateTaskCategory(task.category)}
        </Badge>
        {task.dueDate && (
          <CardDescription className="text-xs mt-1">
            Vence: {isValid(parseISO(task.dueDate)) ? format(parseISO(task.dueDate), "dd MMM, yyyy", { locale: ptBR }) : 'Data inválida'}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        {task.description && <p className="text-sm text-muted-foreground break-words">{task.description}</p>}

        <div>
          {task.repetitionsRequired === 1 ? (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`task-${task.id}-completed`}
                checked={isCompleted}
                onCheckedChange={(checked) => onToggleCheckboxCompletion(task.id, !!checked)}
              />
              <Label htmlFor={`task-${task.id}-completed`} className={cn("text-sm", isCompleted ? "line-through text-muted-foreground" : "text-foreground")}>
                {isCompleted ? "Concluída" : "Marcar como concluída"}
              </Label>
            </div>
          ) : (
            <>
              <Label className="text-xs text-muted-foreground">Progresso de Repetições</Label>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onRepetitionChange(task.id, -1)}
                  disabled={task.repetitionsCompleted <= 0}
                  aria-label="Diminuir repetição"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium tabular-nums w-16 text-center" title={`${task.repetitionsCompleted} de ${task.repetitionsRequired} repetições concluídas`}>
                  {task.repetitionsCompleted} / {task.repetitionsRequired}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onRepetitionChange(task.id, 1)}
                  disabled={isCompleted}
                  aria-label="Aumentar repetição"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Progress value={progressPercent} className="h-1.5 mt-2" />
            </>
          )}
        </div>

        <div className="text-xs text-muted-foreground">Recorrência: {recurrenceOptions.find(r => r.value === task.recurrence)?.label || task.recurrence}</div>
      </CardContent>
      <CardFooter className="p-4 border-t mt-auto flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
          <Edit className="mr-1 h-3 w-3" /> Editar
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="mr-1 h-3 w-3" /> Excluir
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
            </DialogHeader>
            <p>Tem certeza que deseja excluir a tarefa "{task.name}"?</p>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
              <Button variant="destructive" onClick={() => onDelete(task.id)}>Excluir Tarefa</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

type GroupedTasks = Record<string, Task[]>;

const priorityOrder: Record<Priority, number> = {
  URGENT_IMPORTANT: 1,
  IMPORTANT_NOT_URGENT: 2,
  URGENT_NOT_IMPORTANT: 3,
  NOT_URGENT_NOT_IMPORTANT: 4,
};

const sortTasksWithinGroup = (tasksToSort: Task[]): Task[] => {
  return [...tasksToSort].sort((a, b) => {
    const aIsCompleted = a.repetitionsCompleted >= a.repetitionsRequired;
    const bIsCompleted = b.repetitionsCompleted >= b.repetitionsRequired;

    if (aIsCompleted !== bIsCompleted) {
      return aIsCompleted ? 1 : -1;
    }

    const priorityComparison = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityComparison !== 0) return priorityComparison;

    const aDueDate = a.dueDate ? parseISO(a.dueDate) : null;
    const bDueDate = b.dueDate ? parseISO(b.dueDate) : null;

    if (aDueDate && bDueDate) {
      return compareAsc(aDueDate, bDueDate);
    }
    if (aDueDate && !bDueDate) return -1;
    if (!aDueDate && bDueDate) return 1;

    const aCreatedAt = a.createdAt ? parseISO(a.createdAt) : null;
    const bCreatedAt = b.createdAt ? parseISO(b.createdAt) : null;

    if (aCreatedAt && bCreatedAt) {
      return compareAsc(aCreatedAt, bCreatedAt);
    }
    return 0;
  });
};

export default function TasksPage() {
  // React Query hooks
  const { data: tasks = [], isLoading, error } = useGetTasks();
  const addTaskMutation = useAddTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // Local state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const [visibleNowTasks, setVisibleNowTasks] = useState<Task[]>([]);
  const [accordionTaskGroups, setAccordionTaskGroups] = useState<GroupedTasks>({});

  // Ensure tasks is always an array
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Process tasks when data changes
  useEffect(() => {
    if (safeTasks.length > 0) {
      const today = startOfDay(new Date());
      const currentVisible: Task[] = [];
      const forAccordion: Task[] = [];

      safeTasks.forEach(task => {
        const isCompleted = task.repetitionsCompleted >= task.repetitionsRequired;
        const taskDueDate = task.dueDate ? startOfDay(parseISO(task.dueDate)) : null;
        let belongsToVisibleNow = false;

        if (!isCompleted) {
          if (!taskDueDate || isSameDay(taskDueDate, today) || isAfter(taskDueDate, today)) {
            belongsToVisibleNow = true;
          }
        } else { // Tarefa concluída
          if (taskDueDate && isSameDay(taskDueDate, today)) {
            belongsToVisibleNow = true;
          }
        }

        if (belongsToVisibleNow) {
          currentVisible.push(task);
        } else {
          forAccordion.push(task);
        }
      });

      setVisibleNowTasks(sortTasksWithinGroup(currentVisible));

      const newAccordionGroups: GroupedTasks = {
        'Atrasadas (Não Concluídas)': [],
        'Concluídas (Outros Dias)': [],
      };

      forAccordion.forEach(task => {
        const isCompleted = task.repetitionsCompleted >= task.repetitionsRequired;
        const taskDueDate = task.dueDate ? startOfDay(parseISO(task.dueDate)) : null;

        if (!isCompleted && taskDueDate && isBefore(taskDueDate, today)) {
          newAccordionGroups['Atrasadas (Não Concluídas)'].push(task);
        } else if (isCompleted && (!taskDueDate || !isSameDay(taskDueDate, today))) {
          // Concluída, e (não tem prazo OU o prazo não é hoje)
          newAccordionGroups['Concluídas (Outros Dias)'].push(task);
        }
      }); newAccordionGroups['Atrasadas (Não Concluídas)'] = sortTasksWithinGroup(newAccordionGroups['Atrasadas (Não Concluídas)']);
      newAccordionGroups['Concluídas (Outros Dias)'] = sortTasksWithinGroup(newAccordionGroups['Concluídas (Outros Dias)']);
      setAccordionTaskGroups(newAccordionGroups);
    }
  }, [safeTasks]);

  // Updated handler functions to use React Query
  const handleAddTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addTaskMutation.mutateAsync(taskData);
      setIsFormOpen(false);
      toast({ title: "Tarefa Adicionada", description: `"${taskData.name}" foi adicionada.` });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível adicionar a tarefa.", variant: "destructive" });
    }
  };

  const handleEditTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return;
    try {
      const updatedTask: Task = { ...editingTask, ...taskData, updatedAt: new Date().toISOString() };
      await updateTaskMutation.mutateAsync(updatedTask);
      setEditingTask(null);
      setIsFormOpen(false);
      toast({ title: "Tarefa Atualizada", description: `"${updatedTask.name}" foi atualizada.` });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível atualizar a tarefa.", variant: "destructive" });
    }
  };

  const handleRepetitionChange = async (taskId: string, change: number) => {
    const task = safeTasks.find(t => t.id === taskId);
    if (!task) return;

    const newRepetitionsCompleted = Math.max(0, Math.min(task.repetitionsRequired, task.repetitionsCompleted + change));
    const taskJustCompleted = newRepetitionsCompleted >= task.repetitionsRequired && task.repetitionsCompleted < task.repetitionsRequired;
    const wasCompleted = task.repetitionsCompleted >= task.repetitionsRequired;

    if (taskJustCompleted && !wasCompleted) {
      toast({ title: "Tarefa Concluída!", description: `"${task.name}" foi concluída.` });
    } else if (change > 0 && newRepetitionsCompleted < task.repetitionsRequired) {
      toast({ title: "Repetição Registrada", description: `Progresso em "${task.name}": ${newRepetitionsCompleted}/${task.repetitionsRequired}.` });
    } else if (change < 0) {
      toast({ title: "Repetição Removida", description: `Progresso em "${task.name}": ${newRepetitionsCompleted}/${task.repetitionsRequired}.` });
    }

    try {
      const updatedTask: Task = { ...task, repetitionsCompleted: newRepetitionsCompleted, updatedAt: new Date().toISOString() };
      await updateTaskMutation.mutateAsync(updatedTask);
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível atualizar a tarefa.", variant: "destructive" });
    }
  };
  const handleToggleCheckboxCompletion = async (taskId: string, checked: boolean) => {
    const task = safeTasks.find(t => t.id === taskId);
    if (!task || task.repetitionsRequired !== 1) return;

    const newRepetitionsCompleted = checked ? 1 : 0;
    if (checked) {
      toast({ title: "Tarefa Concluída!", description: `"${task.name}" foi marcada como concluída.` });
    } else {
      toast({ title: "Tarefa Pendente", description: `"${task.name}" foi marcada como pendente.` });
    }

    try {
      const updatedTask: Task = { ...task, repetitionsCompleted: newRepetitionsCompleted, updatedAt: new Date().toISOString() };
      await updateTaskMutation.mutateAsync(updatedTask);
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível atualizar a tarefa.", variant: "destructive" });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const task = safeTasks.find(t => t.id === taskId);
      await deleteTaskMutation.mutateAsync(taskId);
      if (task) {
        toast({ title: "Tarefa Excluída", description: `"${task.name}" foi excluída.`, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível excluir a tarefa.", variant: "destructive" });
    }
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const orderedAccordionGroupKeys = useMemo(() => {
    const order = ['Atrasadas (Não Concluídas)', 'Concluídas (Outros Dias)'];
    return order.filter(key => accordionTaskGroups[key] && accordionTaskGroups[key].length > 0);
  }, [accordionTaskGroups]);
  const noTasksAtAll = safeTasks.length === 0;
  const noVisibleNowTasks = visibleNowTasks.length === 0;
  const noAccordionTasks = orderedAccordionGroupKeys.length === 0;

  // Loading state
  if (isLoading) {
    return (
      <AppLayout pageTitle="Gerenciar Tarefas">
        <div className="space-y-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Carregando tarefas...</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AppLayout pageTitle="Gerenciar Tarefas">
        <div className="space-y-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">Erro ao carregar tarefas: {error.message}</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle="Gerenciar Tarefas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-headline font-semibold">Suas Tarefas</h2>
          <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
            setIsFormOpen(isOpen);
            if (!isOpen) setEditingTask(null);
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingTask(null); setIsFormOpen(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-headline">{editingTask ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}</DialogTitle>
              </DialogHeader>
              <TaskForm
                task={editingTask}
                onSubmit={editingTask ? handleEditTask : handleAddTask}
                onCancel={() => { setIsFormOpen(false); setEditingTask(null); }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {noTasksAtAll && (
          <Card className="text-center py-10">
            <CardContent>
              <ListChecks className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma tarefa ainda. Adicione sua primeira tarefa para começar!</p>
            </CardContent>
          </Card>
        )}

        {!noTasksAtAll && visibleNowTasks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              Foco Atual
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visibleNowTasks.map(task => (
                <TaskCardDisplay
                  key={task.id}
                  task={task}
                  onRepetitionChange={handleRepetitionChange}
                  onToggleCheckboxCompletion={handleToggleCheckboxCompletion}
                  onEdit={openEditForm}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </div>
        )}

        {!noTasksAtAll && noVisibleNowTasks && noAccordionTasks && (
          <Card className="text-center py-10">
            <CardContent>
              <Check className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <p className="text-muted-foreground">Todas as tarefas foram concluídas ou não há tarefas urgentes!</p>
            </CardContent>
          </Card>
        )}

        {!noTasksAtAll && orderedAccordionGroupKeys.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
              <Archive className="h-5 w-5" />
              Histórico e Pendências Anteriores
            </h3>
            <Accordion type="multiple" className="w-full space-y-1">
              {orderedAccordionGroupKeys.map(groupTitle => (
                <AccordionItem value={groupTitle} key={groupTitle} className="border bg-card rounded-lg shadow-sm">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium text-base">{groupTitle}</span>
                      <Badge variant="secondary" className="h-6">{accordionTaskGroups[groupTitle].length}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-4 px-4">
                    {accordionTaskGroups[groupTitle].length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-3 border-t">
                        {accordionTaskGroups[groupTitle].map(task => (
                          <TaskCardDisplay
                            key={task.id}
                            task={task}
                            onRepetitionChange={handleRepetitionChange}
                            onToggleCheckboxCompletion={handleToggleCheckboxCompletion}
                            onEdit={openEditForm}
                            onDelete={handleDeleteTask}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground pt-3 border-t">Nenhuma tarefa nesta seção.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
