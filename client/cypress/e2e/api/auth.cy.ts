// Em um ambiente real, é melhor praticar para criar um usuário de teste 
// uma vez e então reutilizá-lo em todos os testes que precisam de autenticação

describe('API Authentication Tests', () => {
  const API_BASE_URL = 'http://localhost:3001';
  
  // Gera credenciais aleatórias para evitar conflitos
  const randomEmail = `auth_${Math.floor(Math.random() * 10000)}@cypress-test.com`;
  const password = 'cypress123';
  let authToken: string;
  let userId: string;

  before(() => {
    // Criar um usuário para testes de autenticação
    const newUser = {
      name: 'Auth Test User',
      email: randomEmail,
      password: password,
    };

    cy.request('POST', `${API_BASE_URL}/users`, newUser)
      .then((response) => {
        expect(response.status).to.eq(201);
        userId = response.body.id;
      });
  });

  it('should authenticate a user and receive a token', () => {
    const credentials = {
      email: randomEmail,
      password: password,
    };

    cy.request('POST', `${API_BASE_URL}/auth/login`, credentials)
      .then(response => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
        authToken = response.body.token;
      });
  });

  it('should access a protected endpoint with auth token', () => {
    // Assumindo que você tem um endpoint protegido
    cy.request({
      method: 'GET',
      url: `${API_BASE_URL}/users/me`,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.email).to.eq(randomEmail);
    });
  });

  it('should fail to access protected endpoint without token', () => {
    cy.request({
      method: 'GET',
      url: `${API_BASE_URL}/users/me`,
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.eq(401);
    });
  });

  it('should refresh an auth token', () => {
    // Assumindo que sua API tenha um endpoint de refresh token
    cy.request({
      method: 'POST',
      url: `${API_BASE_URL}/auth/refresh`,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      // Atualiza o token para os próximos testes
      authToken = response.body.token;
    });
  });

  after(() => {
    // Limpar dados de teste - excluir o usuário criado
    if (userId) {
      cy.request({
        method: 'DELETE',
        url: `${API_BASE_URL}/users/${userId}`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        failOnStatusCode: false,
      });
    }
  });
});
