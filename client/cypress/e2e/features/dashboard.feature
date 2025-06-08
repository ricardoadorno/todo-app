Feature: Dashboard Principal
  Como um usuário do Routine Flow
  Eu quero ver um resumo de todas as minhas atividades
  Para ter uma visão geral da minha produtividade

  Background:
    Given que estou logado no sistema
    And estou na página do dashboard

  Scenario: Visualizar resumo geral
    Given que existem dados nas diferentes seções do app
    When eu acesso o dashboard
    Then devo ver um cartão de "Tarefas Pendentes"
    And devo ver um cartão de "Hábitos de Hoje"
    And devo ver um cartão de "Metas em Progresso"
    And devo ver um cartão de "Resumo Financeiro"

  Scenario: Visualizar tarefas próximas do vencimento
    Given que existem tarefas com vencimento em 2 dias
    When eu visualizo a seção "Tarefas Próximas"
    Then devo ver as tarefas ordenadas por data de vencimento
    And tarefas urgentes devem ter destaque visual
    And devo poder marcar tarefas como concluídas diretamente

  Scenario: Acompanhar progresso diário de hábitos
    Given que tenho hábitos configurados para hoje
    When eu visualizo a seção "Hábitos de Hoje"
    Then devo ver todos os hábitos do dia
    And devo ver o status atual de cada hábito
    And devo poder marcar hábitos como realizados

  Scenario: Visualizar progresso de metas
    Given que tenho metas em progresso
    When eu visualizo a seção "Metas em Progresso"
    Then devo ver as metas ordenadas por prioridade
    And devo ver o progresso de cada meta
    And devo ver barras de progresso visuais

  Scenario: Acompanhar resumo financeiro
    Given que tenho transações do mês atual
    When eu visualizo a seção "Resumo Financeiro"
    Then devo ver o saldo atual
    And devo ver as receitas do mês
    And devo ver as despesas do mês
    And devo ver um gráfico de gastos por categoria

  Scenario: Navegar para seções específicas
    When eu clico em "Ver Todas" na seção de tarefas
    Then devo ser redirecionado para a página de tarefas
    When eu clico em "Ver Todos" na seção de hábitos
    Then devo ser redirecionado para a página de hábitos

  Scenario: Atualizar dados em tempo real
    Given que estou no dashboard
    When eu marco um hábito como realizado
    Then o contador de hábitos deve ser atualizado instantaneamente
    And a barra de progresso deve refletir a mudança

  Scenario: Visualizar estatísticas da semana
    Given que tenho dados da semana atual
    When eu visualizo as estatísticas semanais
    Then devo ver quantas tarefas foram concluídas
    And devo ver a taxa de sucesso dos hábitos
    And devo ver o progresso das metas
    And devo ver o resumo financeiro semanal
