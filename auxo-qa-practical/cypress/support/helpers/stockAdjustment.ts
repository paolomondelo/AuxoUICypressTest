/**
 * Stock Adjustment helper — matches the original tested behaviour exactly.
 *
 * Key differences from the over-engineered version:
 *  - Does NOT .clear() the delta input (the field starts at 0.00; typing appends).
 *  - Does NOT assert .have.value (the numeric input may auto-format, e.g. "10.00").
 */

export const STOCK_ADJUSTMENT_SELECTORS = {
  deltaInput: "input[value='0.00'][name='stockAdjustment.delta']",
  notesInput: "input[name='stockAdjustment.notes']",
  confirmButton: 'button:contains("Confirm")',
  successMessage: '.ant-notification-notice-description',
  successText: 'Stock level updated successfully.',
} as const

/**
 * Perform a stock adjustment.
 * @param delta  The quantity to type (e.g. 10).
 * @param notes  Free-text notes for the adjustment.
 */
export function performStockAdjustment(delta: number | string, notes: string) {
  cy.get(STOCK_ADJUSTMENT_SELECTORS.deltaInput)
    .should('be.visible')
    .type(String(delta))

  cy.get(STOCK_ADJUSTMENT_SELECTORS.notesInput)
    .should('be.visible')
    .type(notes)

  cy.get(STOCK_ADJUSTMENT_SELECTORS.confirmButton)
    .should('be.visible')
    .click()

  cy.get(STOCK_ADJUSTMENT_SELECTORS.successMessage)
    .should('be.visible')
    .and('contain', STOCK_ADJUSTMENT_SELECTORS.successText)
}
