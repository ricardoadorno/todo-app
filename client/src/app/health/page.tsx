"use client";

import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Apple, Dumbbell, Save, Edit, X, HeartPulse, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  useGetCurrentDietPlan,
  useGetCurrentWorkoutPlan,
  useUpdateDietPlan,
  useUpdateWorkoutPlan
} from "@/services/health-service";

export default function HealthPage() {
  const { toast } = useToast();

  // Buscar plano de dieta usando o serviço
  const {
    data: dietPlanData,
    isLoading: isLoadingDiet,
    isError: isDietError
  } = useGetCurrentDietPlan();

  // Buscar plano de treino usando o serviço
  const {
    data: workoutPlanData,
    isLoading: isLoadingWorkout,
    isError: isWorkoutError
  } = useGetCurrentWorkoutPlan();

  // Mutations para salvar os planos
  const updateDietPlan = useUpdateDietPlan();
  const updateWorkoutPlan = useUpdateWorkoutPlan();

  // Estados para edição
  const [isEditingDiet, setIsEditingDiet] = useState(false);
  const [tempDietPlan, setTempDietPlan] = useState("");

  const [isEditingWorkout, setIsEditingWorkout] = useState(false);
  const [tempWorkoutPlan, setTempWorkoutPlan] = useState("");

  // Atualizar estados quando os dados carregarem
  useEffect(() => {
    if (dietPlanData) {
      setTempDietPlan(dietPlanData.content);
    }
  }, [dietPlanData]);

  useEffect(() => {
    if (workoutPlanData) {
      setTempWorkoutPlan(workoutPlanData.content);
    }
  }, [workoutPlanData]);

  const handleEditDiet = () => {
    setTempDietPlan(dietPlanData?.content || "");
    setIsEditingDiet(true);
  };

  const handleSaveDietPlan = () => {
    updateDietPlan.mutate({
      content: tempDietPlan,
      startDate: dietPlanData?.startDate || new Date().toISOString(),
      endDate: dietPlanData?.endDate,
      notes: dietPlanData?.notes
    }, {
      onSuccess: () => {
        setIsEditingDiet(false);
        toast({
          title: "Plano Alimentar Salvo!",
          description: "Suas alterações no plano alimentar foram salvas com sucesso.",
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao salvar",
          description: `Ocorreu um erro: ${error.message}`,
          variant: "destructive"
        });
      }
    });
  };

  const handleCancelEditDiet = () => {
    setIsEditingDiet(false);
    setTempDietPlan(dietPlanData?.content || "");
  };

  const handleEditWorkout = () => {
    setTempWorkoutPlan(workoutPlanData?.content || "");
    setIsEditingWorkout(true);
  };

  const handleSaveWorkoutPlan = () => {
    updateWorkoutPlan.mutate({
      content: tempWorkoutPlan,
      startDate: workoutPlanData?.startDate || new Date().toISOString(),
      endDate: workoutPlanData?.endDate,
      notes: workoutPlanData?.notes
    }, {
      onSuccess: () => {
        setIsEditingWorkout(false);
        toast({
          title: "Plano de Treino Salvo!",
          description: "Suas alterações no plano de treino foram salvas com sucesso.",
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao salvar",
          description: `Ocorreu um erro: ${error.message}`,
          variant: "destructive"
        });
      }
    });
  };

  const handleCancelEditWorkout = () => {
    setIsEditingWorkout(false);
    setTempWorkoutPlan(workoutPlanData?.content || "");
  };


  return (
    <AppLayout pageTitle="Visualizar Saúde">
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Apple className="h-6 w-6 text-green-500" />
              Plano Alimentar
            </CardTitle>
            <CardDescription>Sua estratégia de nutrição personalizada. {isEditingDiet ? "Você está editando o plano abaixo." : "Clique em editar para modificar."}</CardDescription>
          </CardHeader>          <CardContent>
            {isLoadingDiet ? (
              <div className="flex items-center justify-center min-h-[250px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isEditingDiet ? (
              <Textarea
                value={tempDietPlan}
                onChange={(e) => setTempDietPlan(e.target.value)}
                className="min-h-[250px] font-body text-sm bg-background p-4 rounded-md leading-relaxed focus:ring-primary focus:border-primary"
                placeholder="Descreva seu plano alimentar aqui..."
              />
            ) : isDietError ? (
              <div className="min-h-[250px] flex items-center justify-center">
                <p className="text-muted-foreground">Erro ao carregar o plano alimentar. Tente novamente mais tarde.</p>
              </div>
            ) : (
              <div className="whitespace-pre-wrap p-4 rounded-md bg-muted/30 font-body text-sm leading-relaxed min-h-[250px] border border-transparent">
                {dietPlanData?.content || "Nenhum plano alimentar definido. Clique em editar para criar um."}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-start gap-2">
            {isEditingDiet ? (
              <>              <Button
                onClick={handleSaveDietPlan}
                disabled={updateDietPlan.isPending}
              >
                {updateDietPlan.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Plano
                  </>
                )}
              </Button>
                <Button variant="outline" onClick={handleCancelEditDiet} disabled={updateDietPlan.isPending}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </>
            ) : (<Button onClick={handleEditDiet} disabled={isLoadingDiet}>
              <Edit className="mr-2 h-4 w-4" />
              {dietPlanData ? "Editar Plano Alimentar" : "Criar Plano Alimentar"}
            </Button>
            )}
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Dumbbell className="h-6 w-6 text-blue-500" />
              Plano de Treino
            </CardTitle>
            <CardDescription>Seu regime de fitness e exercícios. {isEditingWorkout ? "Você está editando o plano abaixo." : "Clique em editar para modificar."}</CardDescription>
          </CardHeader>          <CardContent>
            {isLoadingWorkout ? (
              <div className="flex items-center justify-center min-h-[250px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isEditingWorkout ? (
              <Textarea
                value={tempWorkoutPlan}
                onChange={(e) => setTempWorkoutPlan(e.target.value)}
                className="min-h-[250px] font-body text-sm bg-background p-4 rounded-md leading-relaxed focus:ring-primary focus:border-primary"
                placeholder="Descreva seu plano de treino aqui..."
              />
            ) : isWorkoutError ? (
              <div className="min-h-[250px] flex items-center justify-center">
                <p className="text-muted-foreground">Erro ao carregar o plano de treino. Tente novamente mais tarde.</p>
              </div>
            ) : (
              <div className="whitespace-pre-wrap p-4 rounded-md bg-muted/30 font-body text-sm leading-relaxed min-h-[250px] border border-transparent">
                {workoutPlanData?.content || "Nenhum plano de treino definido. Clique em editar para criar um."}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-start gap-2">
            {isEditingWorkout ? (
              <>                <Button
                onClick={handleSaveWorkoutPlan}
                disabled={updateWorkoutPlan.isPending}
              >
                {updateWorkoutPlan.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Plano
                  </>
                )}
              </Button>
                <Button variant="outline" onClick={handleCancelEditWorkout} disabled={updateWorkoutPlan.isPending}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </>
            ) : (<Button onClick={handleEditWorkout} disabled={isLoadingWorkout}>
              <Edit className="mr-2 h-4 w-4" />
              {workoutPlanData ? "Editar Plano de Treino" : "Criar Plano de Treino"}
            </Button>
            )}
          </CardFooter>
        </Card>

        <Card className="border-dashed border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary/80 font-headline text-lg">
              <HeartPulse className="h-5 w-5" />
              Melhorias Futuras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-primary/70">
              Esta seção pode ser expandida para incluir acompanhamento de saúde mais detalhado, integração com aplicativos de fitness, registro de refeições, consumo de água, padrões de sono e mais.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
