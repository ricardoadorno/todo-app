# Routine Flow - Especificação de Requisitos do Sistema

## 📋 Visão Geral

O **Routine Flow** é um aplicativo web de produtividade pessoal que integra gerenciamento de tarefas, hábitos, finanças, metas e saúde em uma única plataforma. O sistema utiliza uma abordagem holística para ajudar usuários a organizar e acompanhar diferentes aspectos de suas vidas.

### 🎯 Objetivos Principais
- Centralizar o gerenciamento de produtividade pessoal
- Fornecer insights sobre progresso e tendências
- Simplificar o acompanhamento de rotinas diárias
- Oferecer uma experiência de usuário intuitiva e moderna

## 🏗️ Arquitetura Técnica

### Stack Tecnológico
- **Frontend**: Next.js 15 + React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Roteamento**: App Router (Next.js 13+)
- **Gerenciamento de Datas**: date-fns
- **Ícones**: Lucide React
- **Notificações**: React Toast

### Estrutura do Projeto
```
src/
├── app/                    # Páginas do App Router
│   ├── page.tsx           # Dashboard principal
│   ├── tasks/             # Gerenciamento de tarefas
│   ├── habits/            # Acompanhamento de hábitos
│   ├── goals/             # Definição e tracking de metas
│   ├── finances/          # Controle financeiro
│   ├── health/            # Planos de saúde
│   └── settings/          # Configurações do usuário
├── components/
│   ├── dashboard/         # Componentes do painel principal
│   ├── layout/            # Layout e navegação
│   └── ui/                # Componentes de interface
├── types/                 # Definições TypeScript
├── lib/                   # Utilitários e dados mock
└── hooks/                 # React hooks customizados
```

## 📊 Módulos do Sistema

### 1. 📋 Sistema de Tarefas

#### Funcionalidades
- **CRUD Completo**: Criar, visualizar, editar e excluir tarefas
- **Priorização**: Sistema baseado na Matriz de Eisenhower
- **Categorização**: Organização por área da vida
- **Recorrência**: Tarefas que se repetem automaticamente
- **Repetições**: Sistema de múltiplas execuções
- **Data de Vencimento**: Controle de prazos

#### Tipos de Dados
```typescript
interface Task {
  id: string;
  name: string;
  description?: string;
  priority: 'URGENT_IMPORTANT' | 'IMPORTANT_NOT_URGENT' | 
           'URGENT_NOT_IMPORTANT' | 'NOT_URGENT_NOT_IMPORTANT';
  dueDate: string | null;
  repetitionsRequired: number;
  repetitionsCompleted: number;
  category: 'FINANCIAL' | 'HEALTH' | 'PERSONAL' | 'WORK' | 
           'LEARNING' | 'HOME' | 'OTHER';
  recurrence: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  createdAt?: string;
  updatedAt?: string;
}
```

#### Regras de Negócio
- Tarefas urgentes e importantes aparecem primeiro na lista
- Tarefas completadas (repetitionsCompleted >= repetitionsRequired) são marcadas como concluídas
- Tarefas recorrentes geram novas instâncias automaticamente
- Filtragem inteligente entre "Visíveis Agora" e históricas

### 2. 🔄 Sistema de Hábitos

#### Funcionalidades
- **Rastreamento Diário**: Marcar status diário (feito/pulado/perdido)
- **Contagem de Sequência**: Streak automático
- **Visualização Calendário**: Interface visual para progresso
- **Histórico Completo**: Acompanhamento de longo prazo

#### Tipos de Dados
```typescript
interface Habit {
  id: string;
  name: string;
  description?: string;
  streak: number;
  progress: HabitDayProgress[];
  createdAt?: string;
  updatedAt?: string;
}

interface HabitDayProgress {
  date: string; // YYYY-MM-DD
  status: 'DONE' | 'SKIPPED' | 'MISSED';
}
```

#### Regras de Negócio
- Status diário só pode ser alterado para datas passadas e hoje
- Streak é calculado automaticamente baseado em dias consecutivos "DONE"
- Status padrão para dias não marcados é considerado "MISSED"
- Calendário mostra cores diferentes para cada status

### 3. 🎯 Sistema de Metas

#### Funcionalidades
- **Definição de Objetivos**: Metas com valores quantificáveis
- **Categorização**: Organização por área de vida
- **Status de Progresso**: Acompanhamento de fases
- **Subtarefas**: Quebra de metas grandes em passos menores
- **Data Alvo**: Definição de prazos

#### Tipos de Dados
```typescript
interface Goal {
  id: string;
  name: string;
  description?: string;
  category: 'PERSONAL' | 'FINANCIAL' | 'HEALTH' | 
           'CAREER' | 'LEARNING' | 'OTHER';
  targetDate: string | null;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 
          'ON_HOLD' | 'CANCELLED';
  currentValue?: number | null;
  targetValue?: number | null;
  subTasks?: SubTask[];
  createdAt?: string;
  updatedAt?: string;
}

interface SubTask {
  id: string;
  name: string;
  completed: boolean;
}
```

#### Regras de Negócio
- Progresso percentual calculado como (currentValue / targetValue) * 100
- Metas com targetValue null são consideradas qualitativas
- SubTasks podem ser marcadas independentemente
- Status automático baseado em progresso e datas

### 4. 💰 Sistema Financeiro

#### Funcionalidades
- **Registro de Transações**: Receitas e despesas
- **Categorização**: Organização por tipo de gasto/receita
- **Transações Recorrentes**: Automatização de lançamentos
- **Controle de Investimentos**: Portfólio básico
- **Resumo Financeiro**: Visão geral de saldo e tendências

#### Tipos de Dados
```typescript
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  description: string;
  category?: string;
  isRecurring?: boolean;
  recurrenceInterval?: Recurrence;
  createdAt?: string;
  updatedAt?: string;
}

interface Investment {
  id: string;
  name: string;
  type: 'STOCK' | 'CRYPTO' | 'FUND' | 'REAL_ESTATE' | 'OTHER';
  quantity?: number;
  purchasePrice?: number;
  currentValue: number;
  purchaseDate: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

#### Regras de Negócio
- Saldo calculado como soma de receitas menos despesas
- Transações recorrentes geram lançamentos automáticos
- Categorias personalizáveis por usuário
- Moeda padrão: Real brasileiro (R$)

### 5. 🏥 Sistema de Saúde

#### Funcionalidades Atuais
- **Visualização de Planos**: Exibição de dietas e exercícios
- **Formato Texto**: Planos simples em texto

#### Expansões Futuras
- Tracking de peso e medidas
- Registro de exercícios
- Acompanhamento nutricional
- Integração com dispositivos

### 6. 📊 Dashboard Integrado

#### Componentes Principais
- **Resumo Financeiro**: Saldo, receitas e despesas recentes
- **Tarefas Próximas**: Top 5 tarefas prioritárias
- **Hábitos Ativos**: Status dos hábitos do dia
- **Metas em Progresso**: Top 4 metas mais importantes

#### Regras de Exibição
- Atualização em tempo real
- Foco em itens mais relevantes
- Links diretos para páginas detalhadas
- Design responsivo para diferentes dispositivos

## 🎨 Design System

### Paleta de Cores
- **Primary**: Deep Sky Blue (#3399FF) - Produtividade e clareza
- **Background**: Light Gray (#F0F2F5) - Neutralidade e legibilidade
- **Accent**: Soft Violet (#9966FF) - Contraste suave
- **Success**: Green (#10B981) - Ações positivas
- **Warning**: Yellow (#F59E0B) - Atenção
- **Error**: Red (#EF4444) - Problemas e exclusões

### Tipografia
- **Headlines**: Space Grotesk - Moderno e tecnológico
- **Body**: Inter - Limpo e legível
- **Hierarchy**: h1-h6 bem definida

### Componentes de Interface
- Design flat com ícones Lucide React
- Cards com sombras sutis
- Transições suaves (300ms)
- Estados hover e focus bem definidos
- Feedback visual consistente

### Responsividade
- **Mobile First**: Design otimizado para celular
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: CSS Grid e Flexbox
- **Touch Targets**: Mínimo 44px para elementos interativos

## 📱 Experiência do Usuário

### Fluxos Principais

#### 1. Primeira Utilização
1. Landing no dashboard (sem dados)
2. Call-to-action para criar primeiro item
3. Onboarding contextual
4. Configurações básicas

#### 2. Uso Diário Típico
1. Check do dashboard
2. Atualização de hábitos do dia
3. Review de tarefas pendentes
4. Marcação de progresso
5. Adição de novas atividades

#### 3. Planejamento Semanal
1. Review de metas
2. Criação de novas tarefas
3. Ajuste de prioridades
4. Análise de progresso financeiro

### Princípios de UX
- **Simplicidade**: Interfaces limpas e intuitivas
- **Consistência**: Padrões visuais e interação uniformes
- **Feedback**: Resposta imediata a ações do usuário
- **Acessibilidade**: Suporte a leitores de tela e navegação por teclado
- **Performance**: Carregamento rápido e transições suaves

## 🔧 Requisitos Técnicos

### Funcionalidades Atuais
- ✅ Interface responsiva
- ✅ Dados mock para desenvolvimento
- ✅ Roteamento client-side
- ✅ Componentes reutilizáveis
- ✅ TypeScript strict mode
- ✅ Lint e formatação automática

### Requisitos de Sistema
- **Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript**: ES2020+
- **CSS**: Grid e Flexbox support
- **Resolução**: 320px+ width

### Performance
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Bundle Size**: < 250KB gzipped
- **Time to Interactive**: < 3s em 3G

## 🚀 Roadmap de Desenvolvimento

### Fase 1: MVP (Atual)
- ✅ Estrutura básica do projeto
- ✅ Interface de todas as funcionalidades
- ✅ Dados mock e navegação
- ✅ Design system implementado

### Fase 2: Backend Integration
- 🔄 Setup de banco de dados (Firebase/Supabase)
- 🔄 API routes para CRUD
- 🔄 Persistência de dados
- 🔄 Sincronização em tempo real

### Fase 3: Autenticação
- 🔄 Sistema de usuários
- 🔄 Login social (Google, GitHub)
- 🔄 Proteção de rotas
- 🔄 Perfis de usuário

### Fase 4: Features Avançadas
- 📋 Notificações push
- 📋 Relatórios e analytics
- 📋 Export/import de dados
- 📋 Integração com calendários
- 📋 API pública

### Fase 5: Mobile
- 📋 PWA capabilities
- 📋 App nativo (React Native)
- 📋 Sync offline
- 📋 Notificações nativas

## 🧪 Estratégia de Testes

### Testes Unitários
- Utilitários de data/hora
- Funções de cálculo
- Componentes isolados

### Testes de Integração
- Fluxos entre páginas
- Formulários completos
- Estados de loading/error

### Testes E2E
- Jornadas críticas do usuário
- Cross-browser testing
- Performance testing

## 📊 Métricas e Analytics

### KPIs de Produto
- Tarefas completadas por usuário
- Frequência de uso por módulo
- Taxa de retenção semanal
- Tempo médio na aplicação

### Métricas Técnicas
- Core Web Vitals
- Taxa de erro JavaScript
- Tempo de carregamento por página
- Taxa de abandono

## 🔒 Segurança e Privacidade

### Dados do Usuário
- Criptografia de dados sensíveis
- Política de privacidade clara
- Controle granular de dados
- LGPD compliance

### Segurança Técnica
- HTTPS obrigatório
- Sanitização de inputs
- Rate limiting em APIs
- Logs de auditoria

## 📖 Documentação

### Para Desenvolvedores
- README detalhado
- Guia de contribuição
- API documentation
- Deployment guide

### Para Usuários
- Tutorial de onboarding
- Help center
- FAQ
- Changelog

---

**Versão do Documento**: 1.0  
**Última Atualização**: Maio 2025  
**Status**: Em Desenvolvimento Ativo
