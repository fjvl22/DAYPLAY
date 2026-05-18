describe('PAYMENTS FLOW', () => {

  beforeEach(() => {
    cy.login('admin', '1234');
  });

  it('should load payments list', () => {

    cy.visit('/payments');

    cy.contains('Payments');
    cy.get('[data-cy=payment-row]').should('exist');
  });

  it('should open payment detail', () => {

    cy.get('[data-cy=payment-row]').first().click();

    cy.contains('Payment detail');
  });

  it('should show notifications', () => {

    cy.visit('/notifications');

    cy.get('[data-cy=notification-item]').should('exist');
  });
});