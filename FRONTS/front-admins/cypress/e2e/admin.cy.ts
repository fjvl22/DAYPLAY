describe('ADMIN FLOW', () => {

  beforeEach(() => {
    cy.login('admin', '1234');
  });

  it('should load users page', () => {

    cy.visit('/users');

    cy.contains('Users');
    cy.get('[data-cy=user-table]').should('exist');
  });

  it('should approve pending user', () => {

    cy.visit('/pending-users');

    cy.get('[data-cy=approve-button]').first().click();

    cy.contains('User approved');
  });

  it('should load system events', () => {

    cy.visit('/events');

    cy.get('[data-cy=events-list]').should('exist');
  });
});