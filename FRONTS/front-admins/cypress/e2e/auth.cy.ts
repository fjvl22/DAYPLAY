describe('AUTH FLOW', () => {

  it('should login successfully', () => {

    cy.visit('/login');

    cy.get('[data-cy=nickname]').type('admin');
    cy.get('[data-cy=password]').type('1234');

    cy.get('[data-cy=login-button]').click();

    cy.url().should('include', '/dashboard');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.exist;
    });
  });

  it('should fail login with wrong credentials', () => {

    cy.visit('/login');

    cy.get('[data-cy=nickname]').type('wrong');
    cy.get('[data-cy=password]').type('wrong');

    cy.get('[data-cy=login-button]').click();

    cy.contains('Invalid credentials');
  });
});