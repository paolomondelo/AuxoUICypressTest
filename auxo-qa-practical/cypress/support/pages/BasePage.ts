/// <reference types="cypress" />

/**
 * Base Page Object class with common utilities and wait strategies
 * to reduce flakiness and improve test reliability.
 *
 * NOTE: Utility methods here are designed to be practical helpers,
 * not to replace direct cy.get()/click() where those work fine.
 */
export abstract class BasePage {
  protected readonly DEFAULT_TIMEOUT = 15000

  /**
   * Safely get a visible element
   */
  protected getElement(selector: string, options?: { timeout?: number }) {
    const timeout = options?.timeout ?? this.DEFAULT_TIMEOUT
    return cy.get(selector, { timeout }).should('be.visible')
  }

  /**
   * Click a visible, enabled element
   */
  protected clickElement(selector: string, options?: { force?: boolean; timeout?: number }) {
    const timeout = options?.timeout ?? this.DEFAULT_TIMEOUT
    const el = cy.get(selector, { timeout })
      .should('be.visible')
      .and('not.be.disabled')

    if (options?.force) {
      return el.click({ force: true })
    }
    return el.click()
  }

  /**
   * Wait for loading spinner to disappear (if present)
   */
  protected waitForLoadingToComplete(spinnerSelector = '.ant-spin-spinning', timeout = 30000) {
    cy.get('body').then(($body) => {
      if ($body.find(spinnerSelector).length > 0) {
        cy.get(spinnerSelector, { timeout }).should('not.exist')
      }
    })
  }

  /**
   * Wait for element to be visible
   */
  protected waitForElement(selector: string, timeout?: number) {
    return cy.get(selector, { timeout: timeout ?? this.DEFAULT_TIMEOUT }).should('be.visible')
  }

  /**
   * Wait for a notification message to appear
   */
  protected waitForNotification(expectedText?: string, timeout?: number) {
    const el = cy.get('.ant-notification-notice-description', {
      timeout: timeout ?? this.DEFAULT_TIMEOUT,
    }).should('be.visible')

    if (expectedText) {
      el.should('contain', expectedText)
    }
    return el
  }

  /**
   * Wait for a modal to be visible
   */
  protected waitForModal(modalSelector = '.ant-modal', timeout?: number) {
    return cy.get(modalSelector, { timeout: timeout ?? this.DEFAULT_TIMEOUT }).should('be.visible')
  }
}
