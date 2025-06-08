import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserCircle, Info } from "lucide-react"; // Using UserCircle icon

export default function SettingsPage() {
  return (
    <AppLayout pageTitle="Configurações">
      <div className="space-y-6 max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <UserCircle className="h-6 w-6 text-primary" />
              Informações do Usuário
            </CardTitle>
            <CardDescription>Seu identificador único no Fluxo de Rotina.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground mb-1">ID do Usuário:</p>
              <p
                className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground font-mono break-all shadow-inner select-all cursor-pointer hover:bg-muted/80 transition-colors"
                title="Clique para copiar (recurso não implementado)"
              >
              </p>
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 bg-blue-500/5 border border-blue-500/20 rounded-md">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
              <span>Este ID pode ser usado para futuras funcionalidades colaborativas, exportação/importação de dados, ou para fins de depuração caso encontre algum problema. Mantenha-o seguro se planeja usar funcionalidades avançadas.</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              Configurações do Aplicativo
            </CardTitle>
            <CardDescription>Preferências gerais do aplicativo (em breve).</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Configurações de tema, preferências de notificação e outras personalizações estarão disponíveis aqui em atualizações futuras.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
