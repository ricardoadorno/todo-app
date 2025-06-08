Feature: Gestão de Metas
  Como um usuário do Routine Flow
  Eu quero definir e acompanhar metas
  Para alcançar objetivos pessoais e profissionais

  Background:
    Given que estou logado no sistema
    And estou na página de metas

  Scenario: Criar uma meta simples
    When eu clico no botão "Nova Meta"
    And eu preencho o título com "Aprender React Native"
    And eu preencho a descrição com "Concluir curso completo e criar um app"
    And eu seleciono a categoria "Aprendizado"
    And eu defino a data limite para "31/12/2025"
    And eu clico em "Salvar"
    Then a meta "Aprender React Native" deve aparecer na lista
    And deve mostrar status "Não Iniciada"

  Scenario: Criar meta com progresso quantificável
    When eu clico no botão "Nova Meta"
    And eu preencho o título com "Economizar para viagem"
    And eu seleciono a categoria "Financeiro"
    And eu defino o valor alvo como "5000"
    And eu defino o valor atual como "500"
    And eu clico em "Salvar"
    Then a meta "Economizar para viagem" deve aparecer na lista
    And deve mostrar progresso "500/5000 (10%)"

  Scenario: Adicionar subtarefas a uma meta
    Given que existe uma meta "Construir site pessoal"
    When eu clico na meta "Construir site pessoal"
    And eu clico em "Adicionar Subtarefa"
    And eu adiciono a subtarefa "Definir layout e design"
    And eu adiciono a subtarefa "Desenvolver páginas principais"
    And eu adiciono a subtarefa "Implementar formulário de contato"
    And eu clico em "Salvar"
    Then a meta deve mostrar "0/3 subtarefas concluídas"

  Scenario: Marcar subtarefa como concluída
    Given que existe uma meta "Organizar escritório" com subtarefas
    And a subtarefa "Comprar organizadores" está pendente
    When eu marco a subtarefa "Comprar organizadores" como concluída
    Then a subtarefa deve aparecer como concluída
    And o progresso da meta deve ser atualizado
    And deve aparecer uma barra de progresso visual

  Scenario: Atualizar progresso de meta quantificável
    Given que existe uma meta "Ler 24 livros" com progresso "8/24"
    When eu clico na meta "Ler 24 livros"
    And eu clico em "Atualizar Progresso"
    And eu altero o valor atual para "12"
    And eu clico em "Salvar"
    Then a meta deve mostrar progresso "12/24 (50%)"
    And a barra de progresso deve refletir 50%

  Scenario: Filtrar metas por status
    Given que existem metas com status "Não Iniciada", "Em Progresso" e "Concluída"
    When eu seleciono o filtro de status "Em Progresso"
    Then devo ver apenas as metas em progresso
    And as metas com outros status não devem aparecer

  Scenario: Marcar meta como concluída
    Given que existe uma meta "Certificação AWS" em progresso
    When eu clico na meta "Certificação AWS"
    And eu clico em "Marcar como Concluída"
    And eu confirmo a conclusão
    Then a meta deve aparecer com status "Concluída"
    And deve mostrar a data de conclusão
    And deve aparecer uma celebração visual

  Scenario: Colocar meta em pausa
    Given que existe uma meta "Aprender alemão" em progresso
    When eu clico na meta "Aprender alemão"
    And eu clico em "Pausar Meta"
    And eu adiciono uma nota "Focando em outras prioridades por agora"
    And eu confirmo
    Then a meta deve aparecer com status "Em Pausa"
    And deve mostrar a nota explicativa
