describe('Tasks API', () => {
  const API_BASE_URL = Cypress.env('apiUrl') || 'http://localhost:3001';
  let testUserId: string;

  // Antes de executar os testes, cria um usuário e faz login
  before(() => {
    cy.createTestUser().then(user => {
      if (user) {
        testUserId = user.id;
        cy.login(user.email, 'cypress123');
      }
    });
  });

  it('should fetch tasks successfully', () => {
    cy.authenticatedRequest({
      method: 'GET',
      url: `${API_BASE_URL}/tasks`
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('should create a new task', () => {
    const newTask = {
      name: 'Test Task from Cypress',
      description: 'This is a test task.',
      priority: 'IMPORTANT_NOT_URGENT',
      dueDate: new Date().toISOString(),
      recurrence: 'NONE',
      repetitionsRequired: 1,
      category: 'WORK',
      userId: testUserId,
    };

    cy.authenticatedRequest({
      method: 'POST',
      url: `${API_BASE_URL}/tasks`,
      body: newTask
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      expect(response.body.name).to.eq(newTask.name);
    });
  });  it('should fetch a single task by ID', () => {
    // Primeiro, crie uma tarefa para ter um ID para buscar
    const taskToCreate = {
      name: 'Fetch Me Task',
      priority: 'URGENT_IMPORTANT',
      userId: testUserId,
      category: 'PERSONAL',
      repetitionsRequired: 1,
      recurrence: 'NONE',
    };
    
    cy.authenticatedRequest({
      method: 'POST',
      url: `${API_BASE_URL}/tasks`,
      body: taskToCreate
    }).then(createResponse => {
      const taskId = createResponse.body.id;
      
      cy.authenticatedRequest({
        method: 'GET',
        url: `${API_BASE_URL}/tasks/${taskId}`
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(taskToCreate.name);
        expect(response.body.id).to.eq(taskId);
      });
    });
  });

  it('should update a task', () => {
    // Criar uma tarefa para depois atualizar
    const taskToCreate = {
      name: 'Task to Update',
      priority: 'IMPORTANT_NOT_URGENT',
      userId: testUserId,
      category: 'WORK',
      repetitionsRequired: 1,
      recurrence: 'NONE',
    };
    
    cy.authenticatedRequest({
      method: 'POST',
      url: `${API_BASE_URL}/tasks`,
      body: taskToCreate
    }).then(createResponse => {
      const taskId = createResponse.body.id;
      const updatedTask = {
        ...createResponse.body,
        name: 'Updated Task Name',
        description: 'This task was updated by Cypress',
      };
      
      cy.authenticatedRequest({
        method: 'PUT',
        url: `${API_BASE_URL}/tasks/${taskId}`,
        body: updatedTask
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq('Updated Task Name');
        expect(response.body.description).to.eq('This task was updated by Cypress');
      });
    });
  });

  it('should delete a task', () => {
    // Criar uma tarefa para depois deletar
    const taskToCreate = {
      name: 'Task to Delete',
      priority: 'NOT_URGENT_NOT_IMPORTANT',
      userId: testUserId,
      category: 'OTHER',
      repetitionsRequired: 1,
      recurrence: 'NONE',
    };
    
    cy.authenticatedRequest({
      method: 'POST',
      url: `${API_BASE_URL}/tasks`,
      body: taskToCreate
    }).then(createResponse => {
      const taskId = createResponse.body.id;
      
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `${API_BASE_URL}/tasks/${taskId}`
      }).then(response => {
        expect(response.status).to.eq(200);
      
        // Verificar se a tarefa foi realmente excluída
        cy.request({
          url: `${API_BASE_URL}/tasks/${taskId}`,
          failOnStatusCode: false
        }).then(getResponse => {
          expect(getResponse.status).to.eq(404);
        });
      });
    });
  });
  
  // Limpa os dados de teste após todos os testes
  after(() => {
    // Se necessário, adicione lógica para limpar tarefas e usuários de teste
  });
});
});
