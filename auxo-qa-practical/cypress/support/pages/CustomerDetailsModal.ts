/// <reference types="cypress" />

import { BasePage } from './BasePage'

export interface CustomerDetailsData {
  firstName: string
  lastName: string
  mobileNumber: string
  phoneNumber?: string
  email?: string
}

/**
 * Page Object for the Customer Details modal (Edit Customer Details).
 */
export class CustomerDetailsModal extends BasePage {
  private readonly modalWrap = 'div.ant-modal-wrap'

  private readonly selectors = {
    firstName: 'input[name$="firstName"]',
    lastName: 'input[name$="lastName"]',
    mobileNumber: 'input[name$="mobileNumber"]',
    phoneNumber: 'input[name$="phoneNumber"]',
    email: 'input[name$="email"]',
    saveBtn: 'button:contains("Save")',
  } as const

  private withinModal(selector: string) {
    return cy.get(this.modalWrap).find(selector)
  }

  getFirstName() {
    return this.withinModal(this.selectors.firstName)
  }

  getLastName() {
    return this.withinModal(this.selectors.lastName)
  }

  getMobileNumber() {
    return this.withinModal(this.selectors.mobileNumber)
  }

  getPhoneNumber() {
    return this.withinModal(this.selectors.phoneNumber)
  }

  getEmail() {
    return this.withinModal(this.selectors.email)
  }

  getSaveButton() {
    return this.withinModal(this.selectors.saveBtn)
  }

  getModalWrap() {
    return cy.get(this.modalWrap)
  }

  /**
   * Fill customer details form.
   * No value assertions — lets the app handle formatting.
   * Only fills optional fields (phoneNumber, email) when provided.
   */
  fillCustomerDetails(data: CustomerDetailsData) {
    this.getFirstName().clear().type(data.firstName)
    this.getLastName().clear().type(data.lastName)
    this.getMobileNumber().clear().type(data.mobileNumber)

    if (data.phoneNumber) {
      this.getPhoneNumber().clear().type(data.phoneNumber)
    }
    if (data.email) {
      this.getEmail().clear().type(data.email)
    }
  }

  clickSave() {
    this.getSaveButton().should('be.visible').click()
  }

  shouldBeClosed() {
    this.getModalWrap().should('not.exist')
  }
}

export const customerDetailsModal = new CustomerDetailsModal()
