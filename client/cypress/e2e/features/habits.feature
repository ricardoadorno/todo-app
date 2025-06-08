Feature: Gestão de Hábitos
  Como um usuário do Routine Flow
  Eu quero acompanhar meus hábitos diários
  Para construir uma rotina saudável e produtiva

  Background:
    Given que estou logado no sistema
    And estou na página de hábitos

  Scenario: Criar um novo hábito
    When eu clico no botão "Novo Hábito"
    And eu preencho o nome do hábito com "Beber 2L de água"
    And eu preencho a descrição com "Manter hidratação adequada durante o dia"
    And eu seleciono a frequência "Diária"
    And eu clico em "Salvar"
    Then o hábito "Beber 2L de água" deve aparecer na lista
    And deve mostrar status "Não realizado hoje"

  Scenario: Marcar hábito como realizado
    Given que existe um hábito "Meditar 10 minutos" para hoje
    When eu clico no botão "Concluído" para o hábito "Meditar 10 minutos"
    Then o hábito deve mostrar status "Realizado hoje"
    And o contador de streak deve aumentar em 1
    And deve aparecer uma confirmação visual de sucesso

  Scenario: Marcar hábito como pulado
    Given que existe um hábito "Correr 5km" para hoje
    When eu clico no botão "Pular" para o hábito "Correr 5km"
    And eu confirmo que quero pular
    Then o hábito deve mostrar status "Pulado hoje"
    And o streak deve ser mantido
    And deve aparecer uma nota explicativa sobre o pulo

  Scenario: Visualizar calendário de hábitos
    Given que existe um hábito "Leitura diária" com histórico
    When eu clico no hábito "Leitura diária"
    And eu clico na aba "Calendário"
    Then devo ver um calendário mensal
    And os dias realizados devem estar marcados em verde
    And os dias pulados devem estar marcados em amarelo
    And os dias perdidos devem estar marcados em vermelho

  Scenario: Acompanhar estatísticas de hábito
    Given que existe um hábito "Exercício físico" com 15 dias de histórico
    When eu clico no hábito "Exercício físico"
    And eu clico na aba "Estatísticas"
    Then devo ver o streak atual
    And devo ver o maior streak alcançado
    And devo ver a taxa de sucesso em porcentagem
    And devo ver um gráfico de progresso semanal

  Scenario: Editar um hábito existente
    Given que existe um hábito "Estudar inglês"
    When eu clico no ícone de editar do hábito "Estudar inglês"
    And eu altero o nome para "Estudar inglês 30min"
    And eu altero a descrição para "Foco em conversação e vocabulário"
    And eu clico em "Salvar"
    Then o hábito deve aparecer com o nome "Estudar inglês 30min"
    And deve manter o histórico anterior

  Scenario: Excluir um hábito
    Given que existe um hábito "Hábito temporário"
    When eu clico no ícone de excluir do hábito "Hábito temporário"
    And eu confirmo a exclusão
    Then o hábito "Hábito temporário" não deve mais aparecer na lista
    And todos os dados relacionados devem ser removidos
