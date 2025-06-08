Feature: Gestão de Tarefas
  Como um usuário do Routine Flow
  Eu quero gerenciar minhas tarefas
  Para organizar minha produtividade diária

  Background:
    Given que estou logado no sistema
    And estou na página de tarefas

  Scenario: Criar uma nova tarefa simples
    When eu clico no botão "Nova Tarefa"
    And eu preencho o nome da tarefa com "Revisar relatório mensal"
    And eu seleciono a prioridade "Importante e Não Urgente"
    And eu seleciono a categoria "Trabalho"
    And eu clico em "Salvar"
    Then a tarefa "Revisar relatório mensal" deve aparecer na lista
    And a tarefa deve ter status "Pendente"

  Scenario: Criar tarefa com data de vencimento
    When eu clico no botão "Nova Tarefa"
    And eu preencho o nome da tarefa com "Consulta médica"
    And eu defino a data de vencimento para "próxima semana"
    And eu seleciono a categoria "Saúde"
    And eu clico em "Salvar"
    Then a tarefa "Consulta médica" deve aparecer na lista
    And a tarefa deve mostrar a data de vencimento

  Scenario: Marcar tarefa como concluída
    Given que existe uma tarefa "Estudar TypeScript" pendente
    When eu clico no checkbox da tarefa "Estudar TypeScript"
    Then a tarefa deve ser marcada como concluída
    And a tarefa deve aparecer na seção de "Concluídas"

  Scenario: Editar uma tarefa existente
    Given que existe uma tarefa "Task para editar"
    When eu clico no ícone de editar da tarefa "Task para editar"
    And eu altero o nome para "Task editada com sucesso"
    And eu altero a prioridade para "Urgente e Importante"
    And eu clico em "Salvar"
    Then a tarefa deve aparecer com o nome "Task editada com sucesso"
    And a prioridade deve ser "Urgente e Importante"

  Scenario: Filtrar tarefas por categoria
    Given que existem tarefas das categorias "Trabalho", "Pessoal" e "Saúde"
    When eu seleciono o filtro de categoria "Trabalho"
    Then devo ver apenas as tarefas da categoria "Trabalho"
    And as tarefas de outras categorias não devem aparecer

  Scenario: Excluir uma tarefa
    Given que existe uma tarefa "Tarefa para deletar"
    When eu clico no ícone de excluir da tarefa "Tarefa para deletar"
    And eu confirmo a exclusão
    Then a tarefa "Tarefa para deletar" não deve mais aparecer na lista

  Scenario: Criar tarefa recorrente
    When eu clico no botão "Nova Tarefa"
    And eu preencho o nome da tarefa com "Exercitar-se"
    And eu seleciono a recorrência "Diária"
    And eu defino 3 repetições necessárias
    And eu clico em "Salvar"
    Then a tarefa "Exercitar-se" deve aparecer na lista
    And deve mostrar "0/3 repetições concluídas"
