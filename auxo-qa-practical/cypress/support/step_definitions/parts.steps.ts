import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { partsListPage, partsDetailsModal, mergePartsModal } from '../pages'
import { generatePartData, generateStockAdjustment } from '../helpers'
import { performStockAdjustment } from '../helpers/stockAdjustment'
import { setupPartsInterceptors } from '../api/interceptors'

/**
 * Parts Management Step Definitions
 * Refactored for better reliability, maintainability, and reusability
 */

// ============================================================================
// GIVEN STEPS - Setup and Navigation
// ============================================================================

Given('I navigate to the Parts List page', () => {
  cy.log('Navigating to Parts List page')
  
  setupPartsInterceptors()
  cy.loginUI()
  cy.visit('/inventory/parts')
  
  // Wait for page to load
  partsListPage.getTableBody().should('be.visible')
})

// ============================================================================
// WHEN STEPS - Actions
// ============================================================================

When('I click on the Parts LHP button', () => {
  cy.log('Navigating to Parts List via menu')
  partsListPage.clickInventory()
  partsListPage.clickPartsList()
})

When('I click the New Part button on the Parts List', () => {
  cy.log('Clicking New Part button')
  partsListPage.clickNewPartButton()
})

/**
 * Helper function to create a part with stock adjustment
 */
function createPartWithStockAdjustment(partCodePrefix: string) {
  cy.log(`Creating part with prefix: ${partCodePrefix}`)
  
  // Generate unique part data
  const partData = generatePartData(partCodePrefix)
  const stockData = generateStockAdjustment(10, 'Initial stock')
  
  // Fill and save part details
  partsDetailsModal.fillPartsDetails(partData)
  partsDetailsModal.clickSave()
  
  // Adjust stock
  partsListPage.clickAdjustStockButton()
  performStockAdjustment(parseFloat(stockData.delta), stockData.notes)
  
  cy.log(`Part created successfully: ${partData.partCode}`)
}

When('I create parts info for Parts A and submit it', () => {
  createPartWithStockAdjustment('PartCodeA')
})

When('I create parts info for Parts B and submit it', () => {
  // Navigate back to parts list and create new part
  partsListPage.clickPartsList()
  partsListPage.clickNewPartButton()
  createPartWithStockAdjustment('PartCodeB')
})

When('I merge parts A and parts B', () => {
  cy.log('Merging parts A and B')
  
  // Navigate to parts list
  partsListPage.clickPartsList()
  
  // Wait for table to load
  partsListPage.getTableBody().should('be.visible')
  partsListPage.getTableRow(0).should('be.visible')
  partsListPage.getTableRow(1).should('be.visible')
  
  // Get combined quantity for validation (optional)
  partsListPage.getCombinedQuantityForFirstTwoParts().as('combinedQuantityOnHand')
  
  // Select first two parts and initiate merge
  partsListPage.selectFirstTwoParts()
  partsListPage.clickMergeButton()
  
  // Wait for merge modal to appear
  mergePartsModal.waitForModalToBeVisible()
  
  // Select the part to keep (left part)
  mergePartsModal.clickPartOnLeft()
  
  // Click Merge & Delete
  mergePartsModal.clickMergeAndDelete()
})

When('I should see a warning message that parts B will be deleted', () => {
  cy.log('Validating warning message')
  mergePartsModal.validateWarningMessage()
})

When('I confirm the deletion of parts B', () => {
  cy.log('Confirming deletion')
  
  // Extract the part code that will be kept
  mergePartsModal.extractPartCodeToAlias(0, 'partCodeToKeep')
  
  // Log the part code for debugging
  cy.get('@partCodeToKeep').then((partCodeToKeep) => {
    cy.log(`Part Code to Keep: ${partCodeToKeep}`)
  })
  
  // Proceed with deletion
  mergePartsModal.clickProceedButtonToDelete()
})

When('I click the newly merged part on the Parts List', () => {
  cy.log('Clicking newly merged part')
  
  cy.get('@partCodeToKeep').then((partCodeToKeep) => {
    partsListPage.clickPartByPartCode(String(partCodeToKeep))
  })
})

// ============================================================================
// THEN STEPS - Assertions
// ============================================================================

Then('I should see {string} message', (expectedMessage: string) => {
  cy.log(`Verifying message: ${expectedMessage}`)
  
  cy.contains(expectedMessage, { timeout: 10000 })
    .should('be.visible')
})

Then('I validate the parts history of the merged part and the recorded fields should be existing', () => {
  cy.log('Validating parts history')
  partsListPage.validatePartHistory()
})
