/// <reference types="cypress" />

describe('Intro', () => {
    it('Should show intro banner', () => {
        cy.visit('http://localhost:4545?resetConfig=true');
        cy.wait(2000);
        cy.get('[aria-label="Settings"]').click();
        cy.findByText('Add another folder').click();
        cy.findByPlaceholderText('Directory').type('./');
        cy.findByText('Start Indexing').click();
        cy.findByText('Done').click();

        cy.wait(5000);

        cy.findByText('Search here...').type('get');

        cy.contains('getItems');
    });
});
