describe('Navigation', () => {
  it('should navigate to the home page and check for main title', () => {
    // Start from the index page
    cy.visit('/');

    // Find the main heading and assert its content
    // Adjust the selector and text if your main page heading is different
    cy.get('h2').contains('Bem-vindo ao Routine Flow'); 
  });
});
