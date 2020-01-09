/* global cy:true */

const imageUrlA = 'https://botfront.io/images/illustrations/conversational_design_with_botfront.png';
const imageUrlB = 'https://botfront.io/images/illustrations/botfront_rasa_easy_setup.png';

describe('Bot responses', function() {
    beforeEach(function() {
        cy.deleteProject('bf');
        cy.createProject('bf', 'My Project', 'en');
        cy.login();
    });

    afterEach(function() {
        cy.deleteProject('bf');
        cy.logout();
    });
    it('should create a custom response using the response editor', function() {
        cy.visit('/project/bf/dialogue/templates');
        cy.dataCy('create-response').click();
        cy.dataCy('add-image-response').click();
        cy.dataCy('response-name-input').click().find('input').type('test_A');
        cy.dataCy('image-url-input').find('input').type(imageUrlA);
        cy.get('.dimmer').click({ position: 'topLeft' }); // close the response editor
        cy.dataCy('template-intent').contains('utter_test_A').should('exist');
        cy.dataCy('response-text').find('img').should('have.attr', 'src').and('equal', imageUrlA);
    });
    // it('should add image variations', function() {
    //     cy.visit('/project/bf/dialogue/templates');
    //     cy.dataCy('create-response').click();
    //     cy.dataCy('add-image-response').click();
    //     cy.dataCy('response-name-input').click().find('input').type('test_A');
    //     cy.dataCy('image-url-input').find('input').type(imageUrlA);
    //     cy.dataCy('add-variation').click();
    //     cy.dataCy('image-url-input').last().find('input').type(imageUrlB);
    //     cy.get('.dimmer').click({ position: 'topLeft' }); // close the response editor
    //     cy.dataCy('template-intent').contains('utter_test_A').should('exist');
    //     cy.dataCy('response-text').find('img').should('have.attr', 'src').and('equal', imageUrlA);
    //     cy.dataCy('response-text').find('img').should('have.attr', 'src').and('equal', imageUrlB);
    // });
});
