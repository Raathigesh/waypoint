/// <reference types="cypress" />

describe('Intro', () => {
    it('Should show intro banner', () => {
        cy.visit('http://localhost:4545/');

        cy.get('body').then($body => {
            if ($body.find('[aria-label="please index banner"]').length) {
                cy.findByTestId('Settings').click();
            } else {
                cy.findByText('Set folders to index').click();
            }
        });
        cy.findByText('Add another folder').click();
        cy.findByPlaceholderText('Directory').type('./');
        cy.findByText('Start Indexing').click();
        cy.findByText('Done').click();

        cy.wait(5000);

        cy.findByText('Search here...').type('get');

        cy.contains('getItems');
    });
});
