describe('Finances API', () => {
  const API_BASE_URL = 'http://localhost:3001';

  describe('Transactions', () => {
    it('should fetch transactions successfully', () => {
      cy.request(`${API_BASE_URL}/transactions`)
        .its('status')
        .should('eq', 200);
    });

    it('should create a new transaction', () => {
      const newTransaction = {
        description: 'Test Transaction from Cypress',
        amount: 150.75,
        type: 'EXPENSE',
        category: 'FOOD',
        date: new Date().toISOString(),
        userId: 'test-user-id', // Substitua por um ID válido
      };

      cy.request('POST', `${API_BASE_URL}/transactions`, newTransaction)
        .then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('id');
          expect(response.body.description).to.eq(newTransaction.description);
          expect(response.body.amount).to.eq(newTransaction.amount);
        });
    });

    it('should update a transaction', () => {
      const transactionToCreate = {
        description: 'Transaction to Update',
        amount: 50.00,
        type: 'EXPENSE',
        category: 'ENTERTAINMENT',
        date: new Date().toISOString(),
        userId: 'test-user-id',
      };
      
      cy.request('POST', `${API_BASE_URL}/transactions`, transactionToCreate).then(createResponse => {
        const transactionId = createResponse.body.id;
        const updatedTransaction = {
          ...createResponse.body,
          description: 'Updated Transaction',
          amount: 75.50,
          category: 'SHOPPING',
        };
        
        cy.request('PUT', `${API_BASE_URL}/transactions/${transactionId}`, updatedTransaction)
          .then(response => {
            expect(response.status).to.eq(200);
            expect(response.body.description).to.eq('Updated Transaction');
            expect(response.body.amount).to.eq(75.50);
            expect(response.body.category).to.eq('SHOPPING');
          });
      });
    });

    it('should delete a transaction', () => {
      const transactionToCreate = {
        description: 'Transaction to Delete',
        amount: 25.99,
        type: 'INCOME',
        category: 'SALARY',
        date: new Date().toISOString(),
        userId: 'test-user-id',
      };
      
      cy.request('POST', `${API_BASE_URL}/transactions`, transactionToCreate).then(createResponse => {
        const transactionId = createResponse.body.id;
        
        cy.request('DELETE', `${API_BASE_URL}/transactions/${transactionId}`)
          .its('status')
          .should('eq', 200);
        
        // Verificar se a transação foi realmente excluída
        cy.request({
          url: `${API_BASE_URL}/transactions/${transactionId}`,
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(404);
        });
      });
    });
  });

  describe('Investments', () => {
    it('should fetch investments successfully', () => {
      cy.request(`${API_BASE_URL}/investments`)
        .its('status')
        .should('eq', 200);
    });

    it('should create a new investment', () => {
      const newInvestment = {
        name: 'Test Investment from Cypress',
        type: 'STOCK',
        amount: 1000.00,
        currentValue: 1050.00,
        purchaseDate: new Date().toISOString(),
        userId: 'test-user-id', // Substitua por um ID válido
      };

      cy.request('POST', `${API_BASE_URL}/investments`, newInvestment)
        .then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('id');
          expect(response.body.name).to.eq(newInvestment.name);
          expect(response.body.amount).to.eq(newInvestment.amount);
          expect(response.body.currentValue).to.eq(newInvestment.currentValue);
        });
    });

    it('should update an investment', () => {
      const investmentToCreate = {
        name: 'Investment to Update',
        type: 'CRYPTO',
        amount: 500.00,
        currentValue: 525.00,
        purchaseDate: new Date().toISOString(),
        userId: 'test-user-id',
      };
      
      cy.request('POST', `${API_BASE_URL}/investments`, investmentToCreate).then(createResponse => {
        const investmentId = createResponse.body.id;
        const updatedInvestment = {
          ...createResponse.body,
          name: 'Updated Investment',
          currentValue: 550.00,
        };
        
        cy.request('PUT', `${API_BASE_URL}/investments/${investmentId}`, updatedInvestment)
          .then(response => {
            expect(response.status).to.eq(200);
            expect(response.body.name).to.eq('Updated Investment');
            expect(response.body.currentValue).to.eq(550.00);
          });
      });
    });

    it('should delete an investment', () => {
      const investmentToCreate = {
        name: 'Investment to Delete',
        type: 'BOND',
        amount: 2000.00,
        currentValue: 2100.00,
        purchaseDate: new Date().toISOString(),
        userId: 'test-user-id',
      };
      
      cy.request('POST', `${API_BASE_URL}/investments`, investmentToCreate).then(createResponse => {
        const investmentId = createResponse.body.id;
        
        cy.request('DELETE', `${API_BASE_URL}/investments/${investmentId}`)
          .its('status')
          .should('eq', 200);
        
        // Verificar se o investimento foi realmente excluído
        cy.request({
          url: `${API_BASE_URL}/investments/${investmentId}`,
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(404);
        });
      });
    });
  });
});
