describe('GAMES FLOW', () => {

  beforeEach(() => {
    cy.login('user', '1234');
  });

  it('should open games list', () => {

    cy.visit('/games');

    cy.contains('Games');
    cy.get('[data-cy=game-card]').should('exist');
  });

  it('should start and finish a game', () => {

    cy.visit('/games');

    cy.get('[data-cy=game-card]').first().click();

    cy.get('[data-cy=start-game]').click();

    cy.get('[data-cy=game-area]').should('be.visible');

    cy.get('[data-cy=finish-game]').click();

    cy.contains('Match finished');
  });

  it('should show daily rewards page', () => {

    cy.visit('/daily-rewards');

    cy.contains('Daily Rewards');
  });
});