import { Method, webApiEndpoints } from './endpoints'

/**
 * API Interceptor utilities for setting up network mocks and waits
 */

/**
 * Setup job management API interceptors
 */
export function setupJobInterceptors() {
  cy.log('Setting up job management API interceptors')
  
  cy.intercept(Method.GET, `**/${webApiEndpoints.job.sortList}*`).as('jobIndex')
  cy.intercept(Method.GET, '**/api/job-mgmt/jobs/**').as('getJob')
  cy.intercept(Method.PATCH, '**/api/job-mgmt/customers/**').as('updateCustomer')
  cy.intercept(Method.POST, '**/api/job-mgmt/jobs').as('createJob')
  cy.intercept(Method.PUT, '**/api/job-mgmt/jobs/**').as('updateJob')
  cy.intercept(Method.DELETE, '**/api/job-mgmt/jobs/**').as('deleteJob')
}

/**
 * Setup parts management API interceptors
 */
export function setupPartsInterceptors() {
  cy.log('Setting up parts management API interceptors')
  
  cy.intercept(Method.GET, '**/api/inventory/parts*').as('partsList')
  cy.intercept(Method.GET, '**/api/inventory/parts/**').as('getPart')
  cy.intercept(Method.POST, '**/api/inventory/parts').as('createPart')
  cy.intercept(Method.PUT, '**/api/inventory/parts/**').as('updatePart')
  cy.intercept(Method.DELETE, '**/api/inventory/parts/**').as('deletePart')
  cy.intercept(Method.POST, '**/api/inventory/parts/merge').as('mergeParts')
  cy.intercept(Method.PATCH, '**/api/inventory/parts/**/stock').as('adjustStock')
}

/**
 * Wait for job list to load
 */
export function waitForJobList() {
  cy.wait('@jobIndex', { timeout: 15000 })
}

/**
 * Wait for job details to load
 */
export function waitForJobDetails() {
  cy.wait('@getJob', { timeout: 15000 })
}

/**
 * Wait for customer update to complete
 */
export function waitForCustomerUpdate() {
  cy.wait('@updateCustomer', { timeout: 15000 })
  cy.wait('@getJob', { timeout: 15000 })
}

/**
 * Wait for parts list to load
 */
export function waitForPartsList() {
  cy.wait('@partsList', { timeout: 15000 })
}

/**
 * Wait for part creation to complete
 */
export function waitForPartCreation() {
  cy.wait('@createPart', { timeout: 15000 })
}

/**
 * Wait for parts merge to complete
 */
export function waitForPartsMerge() {
  cy.wait('@mergeParts', { timeout: 15000 })
}

/**
 * Wait for stock adjustment to complete
 */
export function waitForStockAdjustment() {
  cy.wait('@adjustStock', { timeout: 15000 })
}
