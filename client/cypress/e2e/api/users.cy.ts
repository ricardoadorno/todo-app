describe('Users API', () => {
  const API_BASE_URL = 'http://localhost:3001';
  
  // Gera um email aleatório para evitar conflitos em testes múltiplos
  const randomEmail = `user_${Math.floor(Math.random() * 10000)}@cypress-test.com`;
  
  let testUserId: string;

  it('should create a new user', () => {
    const newUser = {
      name: 'Cypress Test User',
      email: randomEmail,
      password: 'cypress123',
    };

    cy.request('POST', `${API_BASE_URL}/users`, newUser)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.name).to.eq(newUser.name);
        expect(response.body.email).to.eq(newUser.email);
        expect(response.body).to.not.have.property('password'); // Não deve retornar senha
        
        // Salva o ID do usuário para testes subsequentes
        testUserId = response.body.id;
      });
  });

  it('should fetch all users', () => {
    cy.request(`${API_BASE_URL}/users`)
      .then(response => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  it('should fetch a user by ID', () => {
    cy.request(`${API_BASE_URL}/users/${testUserId}`)
      .then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(testUserId);
        expect(response.body.email).to.eq(randomEmail);
      });
  });

  it('should update a user', () => {
    const updatedUser = {
      name: 'Updated Cypress User',
      email: randomEmail, // mantém o mesmo email
    };
    
    cy.request('PUT', `${API_BASE_URL}/users/${testUserId}`, updatedUser)
      .then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq('Updated Cypress User');
        expect(response.body.email).to.eq(randomEmail);
      });
  });

  it('should delete a user', () => {
    cy.request('DELETE', `${API_BASE_URL}/users/${testUserId}`)
      .its('status')
      .should('eq', 200);
    
    // Verificar se o usuário foi realmente excluído
    cy.request({
      url: `${API_BASE_URL}/users/${testUserId}`,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.eq(404);
    });
  });
});
