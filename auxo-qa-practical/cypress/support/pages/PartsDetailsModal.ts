/// <reference types="cypress" />

import { BasePage } from './BasePage'

export interface PartsDetailsData {
  partCode: string
  description: string
  barCode: string
}

/**
 * Page Object for the Parts Details / New Part form.
 *
 * IMPORTANT: `.page-form-card-wrapper` is the page wrapper for the part form.
 * It does NOT disappear after saving — the page transitions to the Part Details
 * view inside the same wrapper.  Never assert `should('not.exist')` on it.
 */
export class PartsDetailsModal extends BasePage {
  private readonly modalWrap = '.page-form-card-wrapper'

  private readonly selectors = {
    partCode: 'input[placeholder="Part No/Code"]',
    description: 'input[placeholder="Description"]',
    barCode: 'input[placeholder="Barcode"]',
    saveBtn: 'button:contains("Save")',
    stockedBtn: '.ant-checkbox-label',
  } as const

  private withinModal(selector: string) {
    return cy.get(this.modalWrap).find(selector)
  }

  getPartCode() {
    return this.withinModal(this.selectors.partCode)
  }

  getDescription() {
    return this.withinModal(this.selectors.description)
  }

  getBarCode() {
    return this.withinModal(this.selectors.barCode)
  }

  getSaveButton() {
    return this.withinModal(this.selectors.saveBtn)
  }

  getStockedButton() {
    return cy.get(this.selectors.stockedBtn)
  }

  getModalWrap() {
    return cy.get(this.modalWrap)
  }

  /**
   * Fill part details form.
   * No value assertions — inputs may reformat values.
   */
  fillPartsDetails(data: PartsDetailsData) {
    this.getPartCode().clear().type(data.partCode)
    this.getDescription().clear().type(data.description)
    this.getBarCode().clear().type(data.barCode)
    this.getStockedButton().should('be.visible').click({ force: true })
  }

  /**
   * Click Save.
   * The wrapper stays visible (transitions to Part Details), so we do NOT
   * wait for it to disappear.
   */
  clickSave() {
    this.getSaveButton().should('be.visible').click()
  }

  shouldBeClosed() {
    this.getModalWrap().should('not.exist')
  }
}

export const partsDetailsModal = new PartsDetailsModal()
