Feature: Gestão Financeira
  Como um usuário do Routine Flow
  Eu quero controlar minhas finanças
  Para ter uma visão clara de receitas, despesas e investimentos

  Background:
    Given que estou logado no sistema
    And estou na página de finanças

  Scenario: Adicionar nova receita
    When eu clico no botão "Nova Transação"
    And eu seleciono o tipo "Receita"
    And eu preencho a descrição com "Salário de Janeiro"
    And eu preencho o valor com "4500.00"
    And eu seleciono a categoria "Salário"
    And eu defino a data para "01/01/2025"
    And eu clico em "Salvar"
    Then a transação "Salário de Janeiro" deve aparecer na lista
    And o saldo deve ser atualizado corretamente

  Scenario: Adicionar nova despesa
    When eu clico no botão "Nova Transação"
    And eu seleciono o tipo "Despesa"
    And eu preencho a descrição com "Compras no supermercado"
    And eu preencho o valor com "230.50"
    And eu seleciono a categoria "Alimentação"
    And eu clico em "Salvar"
    Then a transação "Compras no supermercado" deve aparecer na lista
    And o saldo deve ser reduzido corretamente

  Scenario: Criar transação recorrente
    When eu clico no botão "Nova Transação"
    And eu seleciono o tipo "Despesa"
    And eu preencho a descrição com "Aluguel"
    And eu preencho o valor com "1200.00"
    And eu seleciono a categoria "Moradia"
    And eu marco como "Recorrente"
    And eu seleciono a frequência "Mensal"
    And eu clico em "Salvar"
    Then a transação "Aluguel" deve aparecer na lista
    And deve mostrar o ícone de recorrência

  Scenario: Filtrar transações por período
    Given que existem transações de diferentes meses
    When eu seleciono o filtro de período "Janeiro 2025"
    Then devo ver apenas as transações de Janeiro 2025
    And o resumo financeiro deve refletir apenas esse período

  Scenario: Filtrar transações por categoria
    Given que existem transações de categorias "Alimentação", "Transporte" e "Lazer"
    When eu seleciono o filtro de categoria "Alimentação"
    Then devo ver apenas as transações de "Alimentação"
    And o total deve somar apenas essas transações

  Scenario: Editar uma transação
    Given que existe uma transação "Jantar restaurante - R$ 85,00"
    When eu clico no ícone de editar da transação "Jantar restaurante"
    And eu altero a descrição para "Jantar de aniversário"
    And eu altero o valor para "120.00"
    And eu clico em "Salvar"
    Then a transação deve aparecer como "Jantar de aniversário - R$ 120,00"

  Scenario: Excluir uma transação
    Given que existe uma transação "Compra incorreta"
    When eu clico no ícone de excluir da transação "Compra incorreta"
    And eu confirmo a exclusão
    Then a transação "Compra incorreta" não deve mais aparecer na lista
    And o saldo deve ser recalculado

  Scenario: Adicionar investimento
    When eu clico na aba "Investimentos"
    And eu clico no botão "Novo Investimento"
    And eu preencho o nome com "Tesouro Selic 2030"
    And eu seleciono o tipo "Renda Fixa"
    And eu preencho o valor investido com "1000.00"
    And eu preencho o valor atual com "1050.00"
    And eu clico em "Salvar"
    Then o investimento "Tesouro Selic 2030" deve aparecer na lista
    And deve mostrar o rendimento de "R$ 50,00 (5%)"

  Scenario: Visualizar resumo financeiro
    Given que existem transações e investimentos cadastrados
    When eu visualizo o dashboard financeiro
    Then devo ver o total de receitas do mês
    And devo ver o total de despesas do mês
    And devo ver o saldo atual
    And devo ver o total investido
    And devo ver um gráfico de gastos por categoria
