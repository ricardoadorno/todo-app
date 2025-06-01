
"use client";

import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { mockDietPlan, mockWorkoutPlan } from "@/lib/mock-data";
import { Apple, Dumbbell, Save, Edit, X, HeartPulse } from "lucide-react"; // Adicionado Edit, X e HeartPulse
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function HealthPage() {
  const [dietPlan, setDietPlan] = useState(mockDietPlan);
  const [workoutPlan, setWorkoutPlan] = useState(mockWorkoutPlan);
  const { toast } = useToast();

  const [isEditingDiet, setIsEditingDiet] = useState(false);
  const [tempDietPlan, setTempDietPlan] = useState(dietPlan);

  const [isEditingWorkout, setIsEditingWorkout] = useState(false);
  const [tempWorkoutPlan, setTempWorkoutPlan] = useState(workoutPlan);

  const handleEditDiet = () => {
    setTempDietPlan(dietPlan);
    setIsEditingDiet(true);
  };

  const handleSaveDietPlan = () => {
    setDietPlan(tempDietPlan);
    setIsEditingDiet(false);
    toast({
      title: "Plano Alimentar Salvo!",
      description: "Suas alterações no plano alimentar foram salvas localmente.",
    });
  };

  const handleCancelEditDiet = () => {
    setIsEditingDiet(false);
    // Não precisa resetar tempDietPlan aqui, pois será atualizado ao clicar em Editar novamente.
  };

  const handleEditWorkout = () => {
    setTempWorkoutPlan(workoutPlan);
    setIsEditingWorkout(true);
  };

  const handleSaveWorkoutPlan = () => {
    setWorkoutPlan(tempWorkoutPlan);
    setIsEditingWorkout(false);
    toast({
      title: "Plano de Treino Salvo!",
      description: "Suas alterações no plano de treino foram salvas localmente.",
    });
  };

  const handleCancelEditWorkout = () => {
    setIsEditingWorkout(false);
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
          </CardHeader>
          <CardContent>
            {isEditingDiet ? (
              <Textarea
                value={tempDietPlan}
                onChange={(e) => setTempDietPlan(e.target.value)}
                className="min-h-[250px] font-body text-sm bg-background p-4 rounded-md leading-relaxed focus:ring-primary focus:border-primary"
                placeholder="Descreva seu plano alimentar aqui..."
              />
            ) : (
              <div className="whitespace-pre-wrap p-4 rounded-md bg-muted/30 font-body text-sm leading-relaxed min-h-[250px] border border-transparent">
                {dietPlan}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-start gap-2">
            {isEditingDiet ? (
              <>
                <Button onClick={handleSaveDietPlan}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Plano
                </Button>
                <Button variant="outline" onClick={handleCancelEditDiet}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={handleEditDiet}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Plano Alimentar
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
          </CardHeader>
          <CardContent>
            {isEditingWorkout ? (
               <Textarea
                value={tempWorkoutPlan}
                onChange={(e) => setTempWorkoutPlan(e.target.value)}
                className="min-h-[250px] font-body text-sm bg-background p-4 rounded-md leading-relaxed focus:ring-primary focus:border-primary"
                placeholder="Descreva seu plano de treino aqui..."
              />
            ) : (
              <div className="whitespace-pre-wrap p-4 rounded-md bg-muted/30 font-body text-sm leading-relaxed min-h-[250px] border border-transparent">
                {workoutPlan}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-start gap-2">
            {isEditingWorkout ? (
              <>
                <Button onClick={handleSaveWorkoutPlan}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Plano
                </Button>
                <Button variant="outline" onClick={handleCancelEditWorkout}>
                   <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </>
            ) : (
               <Button onClick={handleEditWorkout}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Plano de Treino
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <Card className="border-dashed border-primary/50 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary/80 font-headline text-lg">
                    <HeartPulse className="h-5 w-5"/>
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
