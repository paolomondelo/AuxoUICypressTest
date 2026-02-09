/// <reference types="cypress" />

import { BasePage } from './BasePage'

/**
 * Page Object for the Parts List page with improved reliability and maintainability.
 */
export class PartsListPage extends BasePage {
  private readonly selectors = {
    // Navigation
    inventoryMenu: 'li[id="ut-side-menu-group-inventory"] span[class="ant-menu-title-content"]',
    partsListMenuItem: '#ut-side-menu-part-list',
    
    // Actions
    newPartButton: '#ut-list-add-entity-button',
    adjustStockButton: '#ut-adjust-stock',
    mergeButton: 'button:contains("Merge")',
    
    // Table elements
    mainContent: 'main.ant-layout-content',
    tableBody: 'tbody.ant-table-tbody',
    tableRow: 'tr.ant-table-row',
    selectionColumn: 'td.ant-table-selection-column',
    checkboxInput: 'input.ant-checkbox-input',
    checkboxLabel: 'label.ant-checkbox-wrapper',
    quantityCell: 'td div.text-right',
    
    // Part History
    partHistoryTitle: 'h2, h3, h4, .ant-card-head-title',
    partHistoryCard: '.ant-card-body',
    partHistoryTable: '.ant-table-tbody',
  } as const

  /**
   * Navigate to Parts List via menu
   */
  navigateToPartsList() {
    this.clickElement(this.selectors.inventoryMenu)
    this.clickElement(this.selectors.partsListMenuItem)
    this.waitForTableToLoad()
  }

  /**
   * Click the Parts List menu item
   */
  clickPartsList() {
    this.clickElement(this.selectors.partsListMenuItem)
    this.waitForTableToLoad()
  }

  /**
   * Click the Inventory menu
   */
  clickInventory() {
    this.clickElement(this.selectors.inventoryMenu)
  }

  /**
   * Click New Part button
   */
  clickNewPartButton() {
    this.clickElement(this.selectors.newPartButton)
  }

  /**
   * Click Adjust Stock button
   */
  clickAdjustStockButton() {
    // Wait for Part Details to be visible first
    cy.contains('Part Details').should('be.visible')
    this.clickElement(this.selectors.adjustStockButton, { force: true })
  }

  /**
   * Click Merge button (enabled when exactly 2 parts are selected)
   */
  clickMergeButton() {
    this.clickElement(this.selectors.mergeButton)
  }

  /**
   * Wait for table to load completely
   */
  private waitForTableToLoad() {
    this.waitForLoadingToComplete()
    this.getTableBody().should('be.visible')
  }

  /**
   * Get the main table body containing part rows
   */
  getTableBody() {
    return cy
      .get(this.selectors.mainContent)
      .find(this.selectors.selectionColumn)
      .first()
      .closest('table')
      .find(this.selectors.tableBody)
      .should('be.visible')
  }

  /**
   * Get a specific table row by index (0-based)
   */
  getTableRow(index: number) {
    return this.getTableBody()
      .find(this.selectors.tableRow)
      .eq(index)
      .should('be.visible')
  }

  /**
   * Get checkbox for a specific row
   */
  private getRowCheckbox(index: number) {
    return this.getTableRow(index)
      .find(this.selectors.selectionColumn)
      .find(this.selectors.checkboxInput)
  }

  /**
   * Get checkbox label wrapper for a specific row (for clicking)
   */
  private getRowCheckboxLabel(index: number) {
    return this.getTableRow(index)
      .find(this.selectors.selectionColumn)
      .find(this.selectors.checkboxLabel)
  }

  /**
   * Get quantity on hand value for a specific row
   */
  getQuantityOnHandForRow(index: number): Cypress.Chainable<string> {
    return this.getTableRow(index)
      .find(this.selectors.quantityCell)
      .invoke('text')
      .then((text) => text.trim())
  }

  /**
   * Select a specific part by row index.
   * Clicks the Ant Design checkbox label wrapper (the real input is hidden).
   */
  selectPartByIndex(index: number) {
    this.getTableRow(index).should('be.visible')
    this.getRowCheckboxLabel(index)
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true })
  }

  /**
   * Select the first two parts in the list
   */
  selectFirstTwoParts() {
    this.waitForTableToLoad()
    this.selectPartByIndex(0)
    this.selectPartByIndex(1)
  }

  /**
   * Click a part by its part code to view details
   */
  clickPartByPartCode(partCode: string) {
    cy.log(`Clicking part with code: ${partCode}`)
    cy.contains(partCode)
      .should('be.visible')
      .click()
    
    // Wait for part details to load
    cy.contains('Part Details').should('be.visible')
  }

  /**
   * Validate part history contains required fields
   */
  validatePartHistory() {
    cy.log('Validating Part History')
    
    // Wait for Part Details to be visible first
    cy.contains('Part Details').should('be.visible')
    
    // Wait for any loading to complete
    this.waitForLoadingToComplete()
    
    // Wait for Part History section to be visible (with longer timeout for slow page)
    cy.contains('Part History', { timeout: 20000 })
      .should('be.visible')
    
    // Find the table that contains "Stock Adjustment" rows
    // This is more reliable than trying to traverse DOM structure
    cy.get(this.selectors.partHistoryTable, { timeout: 20000 })
      .contains('Stock Adjustment')
      .closest(this.selectors.partHistoryTable)
      .should('be.visible')
      .find(this.selectors.tableRow)
      .should('have.length.at.least', 2)
      .eq(0)
      .should('be.visible')
      .within(() => {
        // Validate Type column - should be "Stock Adjustment"
        cy.get('td').eq(0).should('contain.text', 'Stock Adjustment')
        
        // Validate Quantity column - should have a value
        cy.get('td')
          .eq(2)
          .should('exist')
          .then(($cell) => {
            // Check if it has a div.text-right or just text
            const $textRight = $cell.find('div.text-right')
            if ($textRight.length > 0) {
              cy.wrap($textRight)
                .should('not.be.empty')
                .invoke('text')
                .then((text) => {
                  const quantity = text.trim()
                  expect(quantity).to.not.equal('')
                  cy.log(`Quantity: ${quantity}`)
                })
            } else {
              // If no div.text-right, check the cell text directly
              cy.wrap($cell)
                .invoke('text')
                .then((text) => {
                  const quantity = text.trim()
                  expect(quantity).to.not.equal('')
                  cy.log(`Quantity: ${quantity}`)
                })
            }
          })
        
        // Validate Quantity On Hand column - should have a value
        cy.get('td')
          .eq(3)
          .should('exist')
          .then(($cell) => {
            const $textRight = $cell.find('div.text-right')
            if ($textRight.length > 0) {
              cy.wrap($textRight)
                .should('not.be.empty')
                .invoke('text')
                .then((text) => {
                  const qtyOnHand = text.trim()
                  expect(qtyOnHand).to.not.equal('')
                  cy.log(`Quantity On Hand: ${qtyOnHand}`)
                })
            } else {
              cy.wrap($cell)
                .invoke('text')
                .then((text) => {
                  const qtyOnHand = text.trim()
                  expect(qtyOnHand).to.not.equal('')
                  cy.log(`Quantity On Hand: ${qtyOnHand}`)
                })
            }
          })
        
        // Validate Notes column - should contain merge information (first row)
        cy.get('td')
          .eq(7)
          .should('exist')
          .should('contain.text', 'Merged from part number')
      })
  }

  /**
   * Get combined quantity on hand for first two rows
   */
  getCombinedQuantityForFirstTwoParts(): Cypress.Chainable<string> {
    return this.getQuantityOnHandForRow(0).then((qty0) => {
      return this.getQuantityOnHandForRow(1).then((qty1) => {
        const sum = parseFloat(qty0) + parseFloat(qty1)
        return sum.toString()
      })
    })
  }
}

export const partsListPage = new PartsListPage()
