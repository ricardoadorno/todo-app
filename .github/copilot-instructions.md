# Copilot Instructions - Routine Flow

## 🎯 Sistema Routine Flow - Gerenciador de Produtividade Pessoal

### Contexto do Projeto
Você está trabalhando no **Routine Flow**, um aplicativo web de produtividade pessoal construído com **Next.js 15**, **TypeScript**, **Tailwind CSS** e **shadcn/ui**. O sistema permite gerenciar tarefas, hábitos, finanças, metas e saúde de forma integrada.

### 🏗️ Arquitetura e Tecnologias

**Stack Principal:**
- **Frontend:** Next.js 15 + React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Navegação:** App Router (Next.js 13+)
- **Gerenciamento de Estado:** useState/useEffect (futuro: React Query)
- **Datas:** date-fns para manipulação de datas
- **Icons:** Lucide React
- **Tipografia:** Inter (body) + Space Grotesk (headlines)

**Estrutura de Pastas:**
```
src/
├── app/                    # App Router pages
│   ├── habits/            # Página de hábitos
│   ├── tasks/             # Página de tarefas
│   ├── goals/             # Página de metas
│   ├── finances/          # Página de finanças
│   └── health/            # Página de saúde
├── components/
│   ├── dashboard/         # Componentes do dashboard
│   ├── layout/            # Layouts e navegação
│   └── ui/                # shadcn/ui components
├── types/                 # Definições TypeScript
├── lib/                   # Utilitários e mock data
└── hooks/                 # React hooks customizados
```

### 📋 Funcionalidades Principais

#### 1. **Sistema de Tarefas**
- **Tipos:** `Task` com prioridades baseadas na Matriz de Eisenhower
- **Categorias:** FINANCIAL, HEALTH, PERSONAL, WORK, LEARNING, HOME, OTHER
- **Prioridades:** URGENT_IMPORTANT, IMPORTANT_NOT_URGENT, URGENT_NOT_IMPORTANT, NOT_URGENT_NOT_IMPORTANT
- **Recorrência:** NONE, DAILY, WEEKLY, MONTHLY, YEARLY
- **Repetições:** Sistema de repetições (repetitionsRequired/repetitionsCompleted)

#### 2. **Sistema de Hábitos**
- **Tipos:** `Habit` com progresso diário
- **Status de Progresso:** DONE, SKIPPED, MISSED
- **Tracking:** Sistema de streaks e progresso por data
- **Visualização:** Calendário com indicadores visuais

#### 3. **Sistema de Metas**
- **Tipos:** `Goal` com categorias e status
- **Categorias:** PERSONAL, FINANCIAL, HEALTH, CAREER, LEARNING, OTHER
- **Status:** NOT_STARTED, IN_PROGRESS, COMPLETED, ON_HOLD, CANCELLED
- **Progresso:** Valores atual/alvo para metas quantificáveis
- **SubTasks:** Lista de subtarefas para quebrar metas grandes

#### 4. **Sistema Financeiro**
- **Tipos:** `Transaction` (income/expense) e `Investment`
- **Categorização:** Sistema de categorias flexível
- **Recorrência:** Transações recorrentes
- **Investimentos:** Tracking de portfólio básico

#### 5. **Dashboard Integrado**
- **Resumo:** Visão geral de todas as áreas
- **Componentes:** UpcomingTasks, ActiveHabits, GoalsInProgress, FinancialOverview

### 🎨 Guidelines de Design

**Cores Principais:**
- **Primary:** Deep sky blue (#3399FF) - hsl(210, 100%, 60%)
- **Background:** Light gray (#F0F2F5)
- **Accent:** Soft violet (#9966FF) - hsl(260, 100%, 70%)

**Tipografia:**
- **Headlines:** Space Grotesk (font-headline)
- **Body:** Inter (font-body)

**Padrões Visuais:**
- Design flat com ícones Lucide React
- Cards com shadow-lg e hover:shadow-xl
- Transições suaves (transition-all duration-300)
- Badges coloridos por categoria/status
- Progress bars para metas e progresso

### 📝 Convenções de Código

#### **Componentes React:**
```typescript
// Sempre usar "use client" para componentes interativos
"use client";

// Import order: React → tipos → componentes → utils
import { useState, useEffect } from 'react';
import type { Task, Priority } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Props interface sempre antes do componente
interface ComponentProps {
  data: Task[];
  onAction: (id: string) => void;
}

export default function Component({ data, onAction }: ComponentProps) {
  // Estado primeiro
  const [state, setState] = useState<Type>([]);
  
  // Effects depois
  useEffect(() => {
    // logic
  }, [dependencies]);
  
  // JSX com className usando cn() quando necessário
  return (
    <div className={cn("base-classes", conditionalClasses)}>
      {/* content */}
    </div>
  );
}
```

#### **Gerenciamento de Estado:**
- useState para estado local
- useEffect para side effects
- useMemo para computações caras
- Mock data em `src/lib/mock-data.ts`

#### **Tratamento de Datas:**
```typescript
import { format, parseISO, startOfDay, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Sempre usar ISO strings para persistência
const dateString = new Date().toISOString();

// Formatação para display
const displayDate = format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
```

#### **Estilização com Tailwind:**
```typescript
// Classes responsivas
"grid gap-6 md:grid-cols-2 lg:grid-cols-3"

// Estados hover/focus
"hover:shadow-xl transition-shadow duration-300"

// Cores por categoria/status
const categoryColors: Record<Category, string> = {
  WORK: "bg-yellow-500 hover:bg-yellow-600 text-black",
  PERSONAL: "bg-purple-500 hover:bg-purple-600 text-white",
  // ...
};
```

### 🔧 Patterns e Best Practices

#### **Componentes de Formulário:**
- Sempre usar controlled components
- Validação básica no client-side
- useToast para feedback ao usuário
- Dialog/Modal para forms de criação/edição

#### **Listas e Filtros:**
- Usar .filter() e .sort() para organização
- Arrays de opções para selects/categorias
- Função de tradução para labels (translateCategory)

#### **Estado de Loading/Error:**
- Skeleton components para loading states
- Graceful degradation para dados ausentes
- Fallbacks informativos

#### **Acessibilidade:**
- Labels corretos para inputs
- ARIA attributes quando necessário
- Navegação por teclado em modals
- Contraste adequado nas cores

### 🚀 Funcionalidades em Desenvolvimento

#### **Próximos Passos:**
1. **Backend Integration:** Firebase/Supabase para persistência
2. **Authentication:** Sistema de usuários
3. **Sync:** Sincronização em tempo real
4. **Mobile:** PWA capabilities
5. **Analytics:** Relatórios e insights

### 💡 Dicas para Desenvolvimento

#### **Quando Adicionar Funcionalidades:**
1. **Defina o tipo** em `src/types/index.ts` primeiro
2. **Crie mock data** em `src/lib/mock-data.ts`
3. **Implemente o componente** seguindo os patterns existentes
4. **Adicione ao dashboard** se relevante
5. **Teste responsividade** em diferentes breakpoints

#### **Debugging:**
- Use `console.log` para debug de desenvolvimento
- Verifique tipos TypeScript rigorosamente
- Teste navegação entre páginas
- Valide data handling (ISO strings ↔ Date objects)

#### **Performance:**
- useMemo para cálculos de progresso/estatísticas
- Lazy loading para componentes pesados
- Otimize re-renders com React.memo quando necessário

### 📖 Referências Rápidas

#### **Componentes shadcn/ui Disponíveis:**
- `Button`, `Card`, `Dialog`, `Input`, `Select`
- `Badge`, `Progress`, `Separator`, `Tabs`
- `Accordion`, `Alert`, `Calendar`, `Checkbox`
- `RadioGroup`, `Switch`, `Table`, `Toast`

#### **Ícones Lucide Comuns:**
- `PlusCircle`, `Edit`, `Trash2`, `CheckCircle`
- `Target`, `TrendingUp`, `DollarSign`, `Calendar`
- `Repeat`, `ListChecks`, `HeartPulse`, `Settings`

**Lembre-se:** Mantenha consistência com os patterns existentes, priorize TypeScript safety, e sempre considere a experiência do usuário final.
