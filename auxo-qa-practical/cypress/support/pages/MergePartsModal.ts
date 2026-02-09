/// <reference types="cypress" />

import { BasePage } from './BasePage'

/**
 * Page Object for the Merge Parts modal with improved error handling and reliability.
 */
export class MergePartsModal extends BasePage {
  private readonly selectors = {
    modal: '.ant-modal',
    modalBody: '.ant-modal-body',
    partCard: '.ant-card',
    cardBody: '.ant-card-body',
    partCodeLabel: 'span.ant-typography[aria-label]',
    mergeAndDeleteButton: 'button:contains("Merge & Delete")',
    confirmationMessage: 'Are you sure you want to merge these two parts?',
    warningNotification: '.with-line-breaks',
    proceedButton: '.ant-popconfirm-buttons > .ant-btn-primary > span',
    leftColumn: '.ant-row .ant-col',
  } as const

  /**
   * Wait for merge modal to be visible
   */
  waitForModalToBeVisible() {
    this.waitForModal(this.selectors.modal)
  }

  /**
   * Get the merge modal
   */
  getModal() {
    return cy.get(this.selectors.modal).first().should('be.visible')
  }

  /**
   * Get part code from a specific card (0 = left, 1 = right)
   */
  getPartCodeInCard(cardIndex: 0 | 1) {
    return this.getModal()
      .find(this.selectors.partCodeLabel)
      .eq(cardIndex)
      .should('be.visible')
  }

  /**
   * Extract part code and store it in a Cypress alias
   * @param cardIndex 0 = left card (part to keep), 1 = right card (part to delete)
   * @param aliasName Alias name to store the part code
   */
  extractPartCodeToAlias(cardIndex: 0 | 1, aliasName: string) {
    cy.log(`Extracting part code from card ${cardIndex} to alias: ${aliasName}`)
    
    this.getPartCodeInCard(cardIndex)
      .invoke('attr', 'aria-label')
      .then((value) => (value ?? '').trim())
      .then((partCode) => {
        cy.log(`Part code extracted: ${partCode}`)
        cy.wrap(partCode).as(aliasName)
      })
  }

  /**
   * Click the left part card (the part to keep after merge)
   */
  clickPartOnLeft() {
    cy.log('Clicking left part card to select it as the target')
    
    this.waitForModalToBeVisible()
    
    // Click the first card in the left column
    this.getModal()
      .find(this.selectors.leftColumn)
      .first()
      .find(this.selectors.cardBody)
      .should('be.visible')
      .click({ force: true })
    
    // Wait a moment for the selection to register
    cy.wait(500)
  }

  /**
   * Click the right part card (the part to be deleted after merge)
   */
  clickPartOnRight() {
    cy.log('Clicking right part card')
    
    this.waitForModalToBeVisible()
    
    this.getModal()
      .find(this.selectors.leftColumn)
      .eq(1)
      .find(this.selectors.cardBody)
      .should('be.visible')
      .click({ force: true })
    
    cy.wait(500)
  }

  /**
   * Click Merge & Delete button
   */
  clickMergeAndDelete() {
    cy.log('Clicking Merge & Delete button')
    
    this.getModal()
      .contains('button', 'Merge & Delete')
      .should('be.visible')
      .and('not.be.disabled')
      .click({ force: true })
    
    // Wait for confirmation dialog to appear
    cy.wait(1000)
  }

  /**
   * Validate warning message appears with expected content
   */
  validateWarningMessage() {
    cy.log('Validating warning message')
    
    const notification = cy
      .get(this.selectors.warningNotification)
      .should('be.visible')
    
    // Validate key phrases in the warning
    notification.should('contain', this.selectors.confirmationMessage)
    notification.should('contain', 'This will delete')
  }

  /**
   * Click Proceed button to confirm deletion.
   * The target is a <span> inside the button, so we only assert visibility.
   */
  clickProceedButtonToDelete() {
    cy.log('Clicking Proceed button to confirm merge and delete')
    
    cy.get(this.selectors.proceedButton)
      .should('be.visible')
      .click()
    
    // Wait for the operation to complete
    this.waitForLoadingToComplete()
  }

  /**
   * Complete full merge flow: select left part, merge, and confirm
   */
  completeMergeFlow() {
    this.clickPartOnLeft()
    this.clickMergeAndDelete()
    this.validateWarningMessage()
    this.clickProceedButtonToDelete()
  }

  /**
   * Verify merge success notification
   */
  verifyMergeSuccess() {
    this.waitForNotification('Parts merged successfully.')
  }
}

export const mergePartsModal = new MergePartsModal()
