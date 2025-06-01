describe('Goals API', () => {
  const API_BASE_URL = 'http://localhost:3001';

  it('should fetch goals successfully', () => {
    cy.request(`${API_BASE_URL}/goals`)
      .its('status')
      .should('eq', 200);
  });

  it('should create a new goal', () => {
    const newGoal = {
      name: 'Test Goal from Cypress',
      description: 'This is a test goal created by Cypress',
      category: 'PERSONAL',
      status: 'IN_PROGRESS',
      targetValue: 100,
      currentValue: 25,
      userId: 'test-user-id', // Substitua por um ID válido
    };

    cy.request('POST', `${API_BASE_URL}/goals`, newGoal)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.name).to.eq(newGoal.name);
        expect(response.body.currentValue).to.eq(25);
      });
  });

  it('should fetch a single goal by ID', () => {
    const goalToCreate = {
      name: 'Fetch Me Goal',
      category: 'FINANCIAL',
      status: 'NOT_STARTED',
      userId: 'test-user-id',
      targetValue: 1000,
      currentValue: 0,
    };
    
    cy.request('POST', `${API_BASE_URL}/goals`, goalToCreate).then(createResponse => {
      const goalId = createResponse.body.id;
      
      cy.request(`${API_BASE_URL}/goals/${goalId}`)
        .then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.name).to.eq(goalToCreate.name);
          expect(response.body.id).to.eq(goalId);
        });
    });
  });

  it('should update a goal', () => {
    const goalToCreate = {
      name: 'Goal to Update',
      category: 'LEARNING',
      status: 'NOT_STARTED',
      userId: 'test-user-id',
      targetValue: 100,
      currentValue: 10,
    };
    
    cy.request('POST', `${API_BASE_URL}/goals`, goalToCreate).then(createResponse => {
      const goalId = createResponse.body.id;
      const updatedGoal = {
        ...createResponse.body,
        name: 'Updated Goal Name',
        status: 'IN_PROGRESS',
        currentValue: 50,
      };
      
      cy.request('PUT', `${API_BASE_URL}/goals/${goalId}`, updatedGoal)
        .then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.name).to.eq('Updated Goal Name');
          expect(response.body.status).to.eq('IN_PROGRESS');
          expect(response.body.currentValue).to.eq(50);
        });
    });
  });

  it('should delete a goal', () => {
    const goalToCreate = {
      name: 'Goal to Delete',
      category: 'CAREER',
      status: 'NOT_STARTED',
      userId: 'test-user-id',
      targetValue: 10,
      currentValue: 0,
    };
    
    cy.request('POST', `${API_BASE_URL}/goals`, goalToCreate).then(createResponse => {
      const goalId = createResponse.body.id;
      
      cy.request('DELETE', `${API_BASE_URL}/goals/${goalId}`)
        .its('status')
        .should('eq', 200);
      
      // Verificar se o objetivo foi realmente excluído
      cy.request({
        url: `${API_BASE_URL}/goals/${goalId}`,
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(404);
      });
    });
  });
});
