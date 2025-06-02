
"use client";

import AppLayout from "@/components/layout/app-layout";
import { useState, useEffect, useMemo } from "react";
import type { Habit, HabitDayProgress, HabitProgressStatus } from "@/types";
import { useGetHabits, useAddHabit, useUpdateHabit, useDeleteHabit, useUpdateHabitProgress } from "@/services/habit-service";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Import Button
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog"; // For future interaction
import { Input } from "@/components/ui/input"; // For future interaction
import { Textarea } from "@/components/ui/textarea"; // For future interaction
import { useToast } from "@/hooks/use-toast"; // For future interaction
import { PlusCircle, Edit, Trash2, CheckCircle, XCircle, MinusCircle, CalendarDays } from "lucide-react"; // Added icons
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusMap: Record<HabitProgressStatus, { label: string; color: string; icon: React.ElementType }> = {
  DONE: { label: 'Concluído', color: 'bg-green-500', icon: CheckCircle },
  SKIPPED: { label: 'Pulado', color: 'bg-yellow-500', icon: MinusCircle },
  MISSED: { label: 'Perdido', color: 'bg-red-500', icon: XCircle },
};

// Simplified HabitForm for future use (placeholder for now)
const HabitForm = ({ habit, onSubmit, onCancel }: { habit?: Habit | null, onSubmit: (data: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => void, onCancel: () => void }) => {
  const [name, setName] = useState(habit?.name || "");
  const [description, setDescription] = useState(habit?.description || "");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      progress: [],
      streak: 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="habit-name">Nome do Hábito</Label>
        <Input id="habit-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="habit-description">Descrição (Opcional)</Label>
        <Textarea id="habit-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{habit ? 'Salvar Hábito' : 'Adicionar Hábito'}</Button>
      </DialogFooter>
    </form>
  );
};


export default function HabitsPage() {
  const { data: habits = [], isLoading, error } = useGetHabits();
  const addHabitMutation = useAddHabit();
  const updateHabitMutation = useUpdateHabit();
  const deleteHabitMutation = useDeleteHabit();

  const [selectedHabitId, setSelectedHabitId] = useState<string | undefined>();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false); // For future add/edit form
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null); // For future edit
  const { toast } = useToast(); // For future notifications

  // Set initial habit when data loads
  useEffect(() => {
    if (habits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(habits[0].id);
    }
  }, [habits, selectedHabitId]);

  const selectedHabit = useMemo(() => {
    return habits.find(h => h.id === selectedHabitId);
  }, [habits, selectedHabitId]);

  const habitProgressMap = useMemo(() => {
    if (!selectedHabit) return {};
    return selectedHabit.progress.reduce((acc, p) => {
      acc[p.date] = p.status;
      return acc;
    }, {} as Record<string, HabitProgressStatus>);
  }, [selectedHabit]);

  const modifiers = useMemo(() => {
    const mods: Record<string, Date[]> = {
      done: [],
      skipped: [],
      missed: [],
    };
    if (selectedHabit) {
      selectedHabit.progress.forEach(p => {
        const date = parseISO(p.date);
        if (isValid(date)) {
          if (p.status === 'DONE') mods.done.push(date);
          else if (p.status === 'SKIPPED') mods.skipped.push(date);
          else if (p.status === 'MISSED') mods.missed.push(date);
        }
      });
    }
    return mods;
  }, [selectedHabit]);

  const modifiersClassNames = {
    done: 'bg-green-500/30 text-green-800 rounded-md hover:bg-green-500/50 dark:text-green-300',
    skipped: 'bg-yellow-500/30 text-yellow-800 rounded-md hover:bg-yellow-500/50 dark:text-yellow-300',
    missed: 'bg-red-500/30 text-red-800 rounded-md hover:bg-red-500/50 dark:text-red-300',
    today: 'border-primary border-2 rounded-md',
  };    // API handlers for add/edit/delete
  const handleAddHabit = async (data: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addHabitMutation.mutateAsync(data);
      setIsFormOpen(false);
      toast({ title: "Hábito Adicionado", description: `"${data.name}" foi adicionado.` });
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao adicionar hábito.", variant: "destructive" });
    }
  };

  const handleEditHabit = async (data: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingHabit) return;
    try {
      await updateHabitMutation.mutateAsync({ ...editingHabit, ...data });
      setEditingHabit(null);
      setIsFormOpen(false);
      toast({ title: "Hábito Atualizado", description: `"${data.name}" foi atualizado.` });
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao atualizar hábito.", variant: "destructive" });
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    try {
      await deleteHabitMutation.mutateAsync(habitId);
      if (habit) {
        toast({ title: "Hábito Excluído", description: `"${habit.name}" foi excluído.`, variant: "destructive" });
      }
      if (selectedHabitId === habitId) {
        setSelectedHabitId(habits.length > 1 ? habits.filter(h => h.id !== habitId)[0]?.id : undefined);
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao excluir hábito.", variant: "destructive" });
    }
  };

  const openEditForm = (habit: Habit) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <AppLayout pageTitle="Acompanhar Hábitos">
        <div className="space-y-6">
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="h-8 bg-muted rounded animate-pulse mb-4" />
              <div className="h-64 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout pageTitle="Acompanhar Hábitos">
        <div className="space-y-6">
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="text-center text-red-500">
                Erro ao carregar hábitos. Verifique se o servidor está rodando.
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }


  return (
    <AppLayout pageTitle="Acompanhar Hábitos">
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-headline">
                <CalendarDays className="h-6 w-6 text-primary" />
                Calendário de Hábitos
              </CardTitle>
              <CardDescription>Visualize o progresso dos seus hábitos ao longo do tempo.</CardDescription>
            </div>
            <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
              setIsFormOpen(isOpen);
              if (!isOpen) setEditingHabit(null);
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingHabit(null); setIsFormOpen(true); }}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Hábito
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-headline">
                    {editingHabit ? 'Editar Hábito' : 'Adicionar Novo Hábito'}
                  </DialogTitle>
                </DialogHeader>
                <HabitForm
                  habit={editingHabit}
                  onSubmit={editingHabit ? handleEditHabit : handleAddHabit}
                  onCancel={() => { setIsFormOpen(false); setEditingHabit(null); }}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="w-full sm:w-auto sm:min-w-[250px]">
                <Label htmlFor="habit-select">Selecione um Hábito:</Label>
                <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
                  <SelectTrigger id="habit-select">
                    <SelectValue placeholder="Escolha um hábito..." />
                  </SelectTrigger>
                  <SelectContent>
                    {habits.map(habit => (
                      <SelectItem key={habit.id} value={habit.id}>
                        {habit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2 items-center justify-end">
                {Object.entries(statusMap).map(([key, { label, color, icon: Icon }]) => (
                  <Badge key={key} variant="outline" className="flex items-center gap-1.5 text-xs py-1 px-2">
                    <span className={`h-3 w-3 rounded-full ${color}`}></span>
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedHabit ? (
              <div className="p-1 border rounded-md bg-muted/30 flex justify-center">
                <Calendar
                  mode="single" // "single" prevents selection, good for display
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  locale={ptBR}
                  className="w-full max-w-md"
                  classNames={{
                    day: "h-10 w-10 rounded-md text-sm", // Ensure days are clickable if interaction is added later
                    day_selected: "", // Disable default selection styling
                    day_today: "border-primary border-2 rounded-md text-primary font-bold",
                  }}
                  footer={
                    <div className="text-sm text-muted-foreground p-2 border-t mt-2">
                      Sequência atual: <strong className="text-foreground">{selectedHabit.streak} dias</strong>
                      <p className="text-xs mt-1">{selectedHabit.description}</p>
                    </div>
                  }
                />
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <CalendarDays className="mx-auto h-12 w-12 mb-4" />
                {habits.length > 0 ? "Selecione um hábito para ver o calendário." : "Nenhum hábito cadastrado ainda. Adicione um!"}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="font-headline">Lista de Hábitos</CardTitle>
            <CardDescription>Gerencie seus hábitos aqui.</CardDescription>
          </CardHeader>
          <CardContent>
            {habits.length === 0 ? (
              <p className="text-muted-foreground">Nenhum hábito cadastrado.</p>
            ) : (
              <ul className="space-y-3">
                {habits.map(habit => (
                  <li key={habit.id} className="flex items-center justify-between p-3 border rounded-md bg-background hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">{habit.name}</p>
                      <p className="text-xs text-muted-foreground">{habit.description || "Sem descrição"}</p>
                      <p className="text-xs text-muted-foreground mt-1">Sequência: {habit.streak} dias</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditForm(habit)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar Hábito</span>
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir Hábito</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Confirmar Exclusão</DialogTitle>
                          </DialogHeader>
                          <p>Tem certeza que deseja excluir o hábito "{habit.name}"?</p>
                          <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                            <Button variant="destructive" onClick={() => handleDeleteHabit(habit.id)}>Excluir Hábito</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
