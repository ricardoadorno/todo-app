"use client";

import AppLayout from "@/components/layout/app-layout";
import { useState, useEffect } from "react";
import type { Goal, GoalCategory, GoalStatus, SubTask } from "@/types";
import { useGetGoals, useAddGoal, useUpdateGoal, useDeleteGoal } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, CheckCircle, Circle, ListChecks, ChevronDown, ChevronUp, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Separator } from "@/components/ui/separator";

const goalCategoryOptions: { value: GoalCategory; label: string }[] = [
  { value: 'PERSONAL', label: 'Pessoal' },
  { value: 'FINANCIAL', label: 'Financeiro' },
  { value: 'HEALTH', label: 'Saúde' },
  { value: 'CAREER', label: 'Carreira' },
  { value: 'LEARNING', label: 'Aprendizado' },
  { value: 'OTHER', label: 'Outro' },
];

const goalStatusOptions: { value: GoalStatus; label: string }[] = [
  { value: 'NOT_STARTED', label: 'Não Iniciada' },
  { value: 'IN_PROGRESS', label: 'Em Progresso' },
  { value: 'COMPLETED', label: 'Completa' },
  { value: 'ON_HOLD', label: 'Em Espera' },
  { value: 'CANCELLED', label: 'Cancelada' },
];

const translateGoalCategory = (category: GoalCategory): string => {
  return goalCategoryOptions.find(opt => opt.value === category)?.label || category;
};

const GoalForm = ({ goal, onSubmit, onCancel }: { goal?: Goal | null, onSubmit: (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void, onCancel: () => void }) => {
  const [name, setName] = useState(goal?.name || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [category, setCategory] = useState<GoalCategory>(goal?.category || 'PERSONAL');
  const [targetDate, setTargetDate] = useState(goal?.targetDate ? format(parseISO(goal.targetDate), "yyyy-MM-dd") : "");
  const [status, setStatus] = useState<GoalStatus>(goal?.status || 'NOT_STARTED');
  const [currentValue, setCurrentValue] = useState<string>(goal?.currentValue?.toString() || "");
  const [targetValue, setTargetValue] = useState<string>(goal?.targetValue?.toString() || "");
  const [subTasks, setSubTasks] = useState<SubTask[]>(goal?.subTasks ? [...goal.subTasks] : []);
  const [newSubTaskName, setNewSubTaskName] = useState("");

  const handleAddSubTask = () => {
    if (newSubTaskName.trim() === "") return;
    const newSub: SubTask = {
      id: `subtask-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: newSubTaskName.trim(),
      completed: false,
    };
    setSubTasks(prev => [...prev, newSub]);
    setNewSubTaskName("");
  };

  const handleRemoveSubTask = (subTaskId: string) => {
    setSubTasks(prev => prev.filter(st => st.id !== subTaskId));
  };

  const handleToggleSubTaskInForm = (subTaskId: string) => {
    setSubTasks(prev => prev.map(st => st.id === subTaskId ? { ...st, completed: !st.completed } : st));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      category,
      targetDate: targetDate ? new Date(targetDate).toISOString() : null,
      status,
      currentValue: currentValue !== "" ? parseFloat(currentValue) : null,
      targetValue: targetValue !== "" ? parseFloat(targetValue) : null,
      subTasks: subTasks,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="goal-name">Nome da Meta</Label>
        <Input id="goal-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="goal-description">Descrição (Opcional)</Label>
        <Textarea id="goal-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="goal-category">Categoria</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as GoalCategory)}>
            <SelectTrigger id="goal-category"><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
            <SelectContent>
              {goalCategoryOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="goal-status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as GoalStatus)}>
            <SelectTrigger id="goal-status"><SelectValue placeholder="Selecione o status" /></SelectTrigger>
            <SelectContent>
              {goalStatusOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="goal-targetdate">Data Alvo (Opcional)</Label>
          <Input id="goal-targetdate" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="goal-currentvalue">Valor Atual (Opcional)</Label>
          <Input id="goal-currentvalue" type="number" placeholder="Ex: 50" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="goal-targetvalue">Valor Alvo (Opcional)</Label>
          <Input id="goal-targetvalue" type="number" placeholder="Ex: 100" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} />
        </div>
      </div>

      <Separator />

      <div>
        <Label>Sub-tarefas / Passos</Label>
        <div className="mt-2 space-y-2">
          {subTasks.map((st, index) => (
            <div key={st.id} className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
              <Checkbox
                id={`form-subtask-${st.id}`}
                checked={st.completed}
                onCheckedChange={() => handleToggleSubTaskInForm(st.id)}
              />
              <Label htmlFor={`form-subtask-${st.id}`} className="flex-1 text-sm font-normal">{st.name}</Label>
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleRemoveSubTask(st.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Input
            id="new-subtask-name"
            placeholder="Nome da nova sub-tarefa"
            value={newSubTaskName}
            onChange={(e) => setNewSubTaskName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubTask(); } }}
          />
          <Button type="button" variant="outline" onClick={handleAddSubTask}>Adicionar</Button>
        </div>
      </div>


      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{goal ? 'Salvar Alterações' : 'Adicionar Meta'}</Button>
      </DialogFooter>
    </form>
  );
};


export default function GoalsPage() {
  const { data: goalsData = [], isLoading, error } = useGetGoals();
  const addGoalMutation = useAddGoal();
  const updateGoalMutation = useUpdateGoal();
  const deleteGoalMutation = useDeleteGoal();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Sort goals by status
  const goals = goalsData.sort((a, b) => {
    const statusOrder: Record<GoalStatus, number> = { 'IN_PROGRESS': 1, 'NOT_STARTED': 2, 'ON_HOLD': 3, 'COMPLETED': 4, 'CANCELLED': 5 };
    return statusOrder[a.status] - statusOrder[b.status];
  });
  const handleAddGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addGoalMutation.mutateAsync(goalData);
      setIsFormOpen(false);
      toast({ title: "Meta Criada", description: `"${goalData.name}" foi adicionada.` });
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao criar meta.", variant: "destructive" });
    }
  };

  const handleEditGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingGoal) return;
    try {
      await updateGoalMutation.mutateAsync({ ...editingGoal, ...goalData });
      setEditingGoal(null);
      setIsFormOpen(false);
      toast({ title: "Meta Atualizada", description: `"${goalData.name}" foi atualizada.` });
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao atualizar meta.", variant: "destructive" });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    try {
      await deleteGoalMutation.mutateAsync(goalId);
      if (goal) {
        toast({ title: "Meta Excluída", description: `"${goal.name}" foi excluída.`, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao excluir meta.", variant: "destructive" });
    }
  };

  const openEditForm = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoals(prev => ({ ...prev, [goalId]: !prev[goalId] }));
  };
  const handleToggleSubTaskCompletion = async (goalId: string, subTaskId: string) => {
    const goal = goals.find((g: Goal) => g.id === goalId);
    const subTask = goal?.subTasks?.find((st: SubTask) => st.id === subTaskId);

    if (!goal || !subTask) return;

    try {
      // Update the goal with modified subtask
      const updatedSubTasks = (goal.subTasks || []).map((st: SubTask) =>
        st.id === subTaskId ? { ...st, completed: !st.completed } : st
      );

      await updateGoalMutation.mutateAsync({
        ...goal,
        subTasks: updatedSubTasks,
      });

      toast({
        title: "Sub-tarefa Atualizada",
        description: `Sub-tarefa "${subTask.name}" da meta "${goal.name}" marcada como ${!subTask.completed ? 'completa' : 'incompleta'}.`
      });
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao atualizar sub-tarefa.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <AppLayout pageTitle="Gerenciar Metas">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-headline font-semibold">Suas Metas</h2>
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="shadow-md">
                <CardContent className="pt-6">
                  <div className="h-6 bg-muted rounded animate-pulse mb-4" />
                  <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-2 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout pageTitle="Gerenciar Metas">
        <div className="space-y-6">
          <div className="text-center text-red-500">
            Erro ao carregar metas. Verifique se o servidor está rodando.
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle="Gerenciar Metas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-headline font-semibold">Suas Metas</h2>
          <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
            setIsFormOpen(isOpen);
            if (!isOpen) setEditingGoal(null);
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingGoal(null); setIsFormOpen(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-headline">{editingGoal ? 'Editar Meta' : 'Adicionar Nova Meta'}</DialogTitle>
              </DialogHeader>
              <GoalForm
                goal={editingGoal}
                onSubmit={editingGoal ? handleEditGoal : handleAddGoal}
                onCancel={() => { setIsFormOpen(false); setEditingGoal(null); }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {goals.length === 0 ? (
          <Card className="text-center py-10">
            <CardContent>
              <ListChecks className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma meta ainda. Adicione sua primeira meta para começar!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {goals.map(goal => {
              const progressValue = (goal.currentValue != null && goal.targetValue != null && goal.targetValue > 0)
                ? Math.min((goal.currentValue / goal.targetValue) * 100, 100)
                : goal.status === 'COMPLETED' ? 100 : 0;
              const isExpanded = !!expandedGoals[goal.id];

              const completedSubTasks = goal.subTasks?.filter(st => st.completed).length || 0;
              const totalSubTasks = goal.subTasks?.length || 0;
              const subTaskProgress = totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0;

              return (
                <Card key={goal.id} className={`transition-all duration-300 ${goal.status === 'COMPLETED' ? 'opacity-70 bg-muted/30' : 'bg-card hover:shadow-lg'}`}>
                  <CardHeader className="cursor-pointer" onClick={() => toggleGoalExpansion(goal.id)}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-base font-semibold flex items-center">
                          {goal.name}
                          {isExpanded ? <ChevronUp className="ml-2 h-4 w-4 text-muted-foreground" /> : <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1 text-xs">{translateGoalCategory(goal.category)}</Badge>
                        <Badge variant={goal.status === 'COMPLETED' ? "default" : goal.status === 'IN_PROGRESS' ? "outline" : "secondary"} className="ml-2 mt-1 text-xs">
                          {goalStatusOptions.find(s => s.value === goal.status)?.label || goal.status}
                        </Badge>
                      </div>
                      <div className="flex flex-col items-end">
                        {goal.targetDate && (
                          <CardDescription className="text-xs mb-1">
                            Data Alvo: {format(parseISO(goal.targetDate), "dd MMM, yyyy", { locale: ptBR })}
                          </CardDescription>
                        )}
                        {(goal.targetValue != null && goal.targetValue > 0) && (
                          <div className="w-24">
                            <Progress value={progressValue} className="h-2" title={`${progressValue.toFixed(0)}% concluído`} />
                            <p className="text-xs text-muted-foreground mt-1 text-right">
                              {goal.currentValue ?? 0} / {goal.targetValue} {goal.category === 'FINANCIAL' ? 'R$' : ''}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {isExpanded && (
                    <CardContent className="pt-0">
                      <Separator className="my-3" />
                      {goal.description && <p className="text-sm text-muted-foreground mb-3 break-words">{goal.description}</p>}

                      {goal.subTasks && goal.subTasks.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Passos / Sub-tarefas ({completedSubTasks}/{totalSubTasks})</h4>
                          {totalSubTasks > 0 && <Progress value={subTaskProgress} className="h-1.5 mb-2" />}
                          <ul className="space-y-1.5">
                            {goal.subTasks.map(subTask => (
                              <li key={subTask.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 hover:bg-muted/70 transition-colors">
                                <Checkbox
                                  id={`subtask-${goal.id}-${subTask.id}`}
                                  checked={subTask.completed}
                                  onCheckedChange={() => handleToggleSubTaskCompletion(goal.id, subTask.id)}
                                  aria-label={subTask.completed ? "Marcar sub-tarefa como incompleta" : "Marcar sub-tarefa como completa"}
                                />
                                <Label htmlFor={`subtask-${goal.id}-${subTask.id}`} className={`text-sm ${subTask.completed ? 'line-through text-muted-foreground' : ''}`}>
                                  {subTask.name}
                                </Label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {(goal.subTasks === undefined || goal.subTasks.length === 0) && goal.description && <Separator className="my-3" />}

                    </CardContent>
                  )}
                  <CardFooter className="border-t flex justify-end gap-2 py-3 px-4">
                    <Button variant="ghost" size="sm" onClick={() => openEditForm(goal)}>
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
                        <p>Tem certeza que deseja excluir a meta "{goal.name}"?</p>
                        <DialogFooter>
                          <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                          <Button variant="destructive" onClick={() => handleDeleteGoal(goal.id)}>Excluir Meta</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

