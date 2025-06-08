Feature: Autenticação de Usuários
  Como um usuário do Routine Flow
  Eu quero fazer login e logout
  Para acessar minhas informações pessoais de produtividade

  Background:
    Given que existe um usuário com email "test@routineflow.com" e senha "password123"

  Scenario: Login com credenciais válidas
    Given que estou na página de login
    When eu preencho o email com "test@routineflow.com"
    And eu preencho a senha com "password123"
    And eu clico no botão "Entrar"
    Then eu devo ser redirecionado para o dashboard
    And devo ver a mensagem "Bem-vindo ao Routine Flow"

  Scenario: Login com credenciais inválidas
    Given que estou na página de login
    When eu preencho o email com "invalid@email.com"
    And eu preencho a senha com "wrongpassword"
    And eu clico no botão "Entrar"
    Then devo ver uma mensagem de erro "Credenciais inválidas"
    And devo permanecer na página de login

  Scenario: Logout do sistema
    Given que estou logado no sistema
    When eu clico no menu do usuário
    And eu clico em "Sair"
    Then devo ser redirecionado para a página de login
    And não devo ter mais acesso às páginas protegidas

  Scenario: Acesso negado a páginas protegidas sem autenticação
    Given que não estou logado
    When eu tento acessar a página "/dashboard"
    Then devo ser redirecionado para a página de login
