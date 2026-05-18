Cypress.Commands.add('login', (nickname: string, password: string) => {

  cy.request('POST', 'http://localhost:3000/api/auth/login', {
    nickname,
    password
  }).then((res) => {

    expect(res.status).to.eq(200);

    window.localStorage.setItem('accessToken', res.body.accessToken);
    window.localStorage.setItem('refreshToken', res.body.refreshToken);
  });
});