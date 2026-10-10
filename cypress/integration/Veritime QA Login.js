describe('QA Login Test', function() {
  it('Logs In to TA QA', function() {
    cy.visit('https://vtqa.flqa.net')
    cy.get('#Username')   
        .type('ou11923')
    cy.get('#Password')   
        .type('!greg1234')
    cy.get('#qa-button-login').click()
    cy.get('.content') //test comment
        .should('have.text', 'Lowndes County Schools')
    cy.get('#sk--user-info-title > .sk--user-name')
        .should('have.text', 'Frontline Technologies 11923')
  })
})
