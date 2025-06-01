describe('Habits API', () => {
  const API_BASE_URL = 'http://localhost:3001';

  it('should fetch habits successfully', () => {
    cy.request(`${API_BASE_URL}/habits`)
      .its('status')
      .should('eq', 200);
  });

  it('should create a new habit', () => {
    const newHabit = {
      name: 'Test Habit from Cypress',
      description: 'This is a test habit created by Cypress',
      frequency: 'DAILY',
      userId: 'test-user-id', // Substitua por um ID válido
    };

    cy.request('POST', `${API_BASE_URL}/habits`, newHabit)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.name).to.eq(newHabit.name);
      });
  });

  it('should fetch a single habit by ID', () => {
    const habitToCreate = {
      name: 'Fetch Me Habit',
      frequency: 'WEEKLY',
      userId: 'test-user-id',
    };
    
    cy.request('POST', `${API_BASE_URL}/habits`, habitToCreate).then(createResponse => {
      const habitId = createResponse.body.id;
      
      cy.request(`${API_BASE_URL}/habits/${habitId}`)
        .then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.name).to.eq(habitToCreate.name);
          expect(response.body.id).to.eq(habitId);
        });
    });
  });

  it('should update a habit', () => {
    const habitToCreate = {
      name: 'Habit to Update',
      frequency: 'DAILY',
      userId: 'test-user-id',
    };
    
    cy.request('POST', `${API_BASE_URL}/habits`, habitToCreate).then(createResponse => {
      const habitId = createResponse.body.id;
      const updatedHabit = {
        ...createResponse.body,
        name: 'Updated Habit Name',
        frequency: 'WEEKLY',
      };
      
      cy.request('PUT', `${API_BASE_URL}/habits/${habitId}`, updatedHabit)
        .then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.name).to.eq('Updated Habit Name');
          expect(response.body.frequency).to.eq('WEEKLY');
        });
    });
  });

  it('should record habit progress', () => {
    const habitToCreate = {
      name: 'Habit for Progress',
      frequency: 'DAILY',
      userId: 'test-user-id',
    };
    
    cy.request('POST', `${API_BASE_URL}/habits`, habitToCreate).then(createResponse => {
      const habitId = createResponse.body.id;
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      const progressData = {
        habitId: habitId,
        date: today,
        status: 'DONE',
      };
      
      cy.request('POST', `${API_BASE_URL}/habits/progress`, progressData)
        .then(response => {
          expect(response.status).to.eq(201);
          expect(response.body.status).to.eq('DONE');
          expect(response.body.habitId).to.eq(habitId);
        });
    });
  });

  it('should delete a habit', () => {
    const habitToCreate = {
      name: 'Habit to Delete',
      frequency: 'MONTHLY',
      userId: 'test-user-id',
    };
    
    cy.request('POST', `${API_BASE_URL}/habits`, habitToCreate).then(createResponse => {
      const habitId = createResponse.body.id;
      
      cy.request('DELETE', `${API_BASE_URL}/habits/${habitId}`)
        .its('status')
        .should('eq', 200);
      
      // Verificar se o hábito foi realmente excluído
      cy.request({
        url: `${API_BASE_URL}/habits/${habitId}`,
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(404);
      });
    });
  });
});
