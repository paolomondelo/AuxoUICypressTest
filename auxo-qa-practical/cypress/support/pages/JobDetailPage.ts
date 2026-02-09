/// <reference types="cypress" />

import { BasePage } from './BasePage'

/**
 * Page Object for the Job Detail page with improved reliability.
 */
export class JobDetailPage extends BasePage {
  private readonly selectors = {
    viewMoreLink: 'a:contains("View More")',
    customerMoreButton: '#customer-more-action > .ant-btn',
    dropdownItem: '.ant-dropdown-menu-item',
    moreActionsButton: 'button:contains("More Actions")',
    editCustomerDetailsItem: 'Edit Customer Details',
  } as const

  /**
   * Get View More link
   */
  getViewMoreLink() {
    return cy.get(this.selectors.viewMoreLink).should('be.visible')
  }

  /**
   * Get Customer More button
   */
  getCustomerMoreButton() {
    return cy
      .get(this.selectors.customerMoreButton)
      .first()
      .should('be.visible')
  }

  /**
   * Get More Actions button
   */
  getMoreActionsButton() {
    return cy.get(this.selectors.moreActionsButton).should('be.visible')
  }

  /**
   * Click View More link
   */
  clickViewMore() {
    cy.log('Clicking View More')
    this.getViewMoreLink().click()
    
    // Wait for page to load
    this.waitForLoadingToComplete()
  }

  /**
   * Open Customer More menu
   */
  openCustomerMoreMenu() {
    cy.log('Opening Customer More menu')
    this.getCustomerMoreButton().click()
    
    // Wait for dropdown to appear
    cy.get(this.selectors.dropdownItem).should('be.visible')
  }

  /**
   * Click Edit Customer Details from dropdown
   */
  clickEditCustomerDetails() {
    cy.log('Clicking Edit Customer Details')
    
    cy.contains(this.selectors.dropdownItem, this.selectors.editCustomerDetailsItem)
      .should('be.visible')
      .click()
    
    // Wait for modal to appear
    cy.get('div.ant-modal-wrap').should('be.visible')
  }

  /**
   * Open Edit Customer Details modal (complete flow)
   */
  openEditCustomerDetails() {
    this.clickViewMore()
    this.openCustomerMoreMenu()
    this.clickEditCustomerDetails()
  }

  /**
   * Verify job detail page is loaded
   */
  verifyJobDetailPageLoaded() {
    cy.url().should('include', '/job-management/jobs/')
    this.waitForLoadingToComplete()
  }
}

export const jobDetailPage = new JobDetailPage()
