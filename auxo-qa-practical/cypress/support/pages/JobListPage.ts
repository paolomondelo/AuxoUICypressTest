/// <reference types="cypress" />

import { BasePage } from './BasePage'

/**
 * Page Object for the Job List page with improved reliability.
 */
export class JobListPage extends BasePage {
  private readonly selectors = {
    firstRow: 'tbody tr:not(.ant-table-measure-row):not([aria-hidden="true"])',
    firstRowCheckbox: 'input.ant-checkbox-input',
    firstRowLink: 'a',
    printButton: '#ut-list-bulk-print',
    printedIcon: 'span[aria-label="printed"]',
    tableBody: 'tbody',
  } as const

  /**
   * Wait for job list to load
   */
  waitForJobListToLoad() {
    this.waitForLoadingToComplete()
    this.getFirstRow().should('be.visible')
  }

  /**
   * Get the first job row
   */
  getFirstRow() {
    return cy
      .get(this.selectors.firstRow)
      .first()
      .should('be.visible')
  }

  /**
   * Get first row and store as alias
   */
  getFirstRowAsAlias(alias: string) {
    return this.getFirstRow().as(alias)
  }

  /**
   * Get first row checkbox
   */
  getFirstRowCheckbox() {
    return this.getFirstRow()
      .find(this.selectors.firstRowCheckbox)
      .first()
  }

  /**
   * Get Print button
   */
  getPrintButton() {
    return cy.get(this.selectors.printButton).should('be.visible')
  }

  /**
   * Get printed icon in first row
   */
  getPrintedIconInFirstRow() {
    return this.getFirstRow()
      .find('td')
      .eq(10)
      .find(this.selectors.printedIcon)
  }

  /**
   * Select the first job by clicking its link
   */
  selectFirstJob() {
    cy.log('Selecting first job')
    
    this.getFirstRow()
      .find(this.selectors.firstRowLink)
      .first()
      .should('be.visible')
      .click()
    
    // Wait for job details to load
    cy.url().should('include', '/job-management/jobs/')
  }

  /**
   * Check the first job checkbox
   */
  checkFirstJob() {
    cy.log('Checking first job checkbox')
    
    this.getFirstRow().should('have.length.greaterThan', 0)
    this.getFirstRow().scrollIntoView()
    this.getFirstRowCheckbox().check({ force: true })
    this.getFirstRowCheckbox().should('be.checked')
  }

  /**
   * Click Print Job Card button
   */
  clickPrintJobCard() {
    this.getPrintButton().click()
    
    // Wait for print operation to complete
    cy.wait(1000)
  }

  /**
   * Get text from first row
   */
  getFirstRowText(): Cypress.Chainable<string> {
    return this.getFirstRow()
      .invoke('text')
      .then((text) => text.trim())
  }

  /**
   * Verify printed icon appears in first row
   */
  verifyPrintedIconInFirstRow() {
    this.getPrintedIconInFirstRow().should('exist').and('be.visible')
  }
}

export const jobListPage = new JobListPage()
