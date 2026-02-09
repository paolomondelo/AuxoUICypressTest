/**
 * Test Data Generator utilities for creating unique test data
 */

/**
 * Generate a unique timestamp-based identifier
 */
export function generateTimestamp(): number {
  return Date.now()
}

/**
 * Generate a unique part code with prefix
 */
export function generatePartCode(prefix = 'PART'): string {
  return `${prefix}_${generateTimestamp()}`
}

/**
 * Generate a unique description
 */
export function generateDescription(prefix = 'Description'): string {
  return `${prefix}_${generateTimestamp()}`
}

/**
 * Generate a unique barcode (simulating a valid format)
 */
export function generateBarcode(): string {
  return `021${Cypress._.random(1000000, 9999999)}`
}

/**
 * Generate a unique mobile number (NZ format)
 */
export function generateMobileNumber(): string {
  return `021${Cypress._.random(1000000, 9999999)}`
}

/**
 * Generate a unique phone number (NZ format)
 */
export function generatePhoneNumber(): string {
  return `09${Cypress._.random(10000000, 99999999)}`
}

/**
 * Generate a unique email address
 */
export function generateEmail(domain = 'test.com'): string {
  return `test${generateTimestamp()}@${domain}`
}

/**
 * Generate a unique first name
 */
export function generateFirstName(): string {
  return `Test${generateTimestamp()}`
}

/**
 * Generate a unique last name
 */
export function generateLastName(): string {
  return `User${generateTimestamp()}`
}

/**
 * Generate complete part data
 */
export function generatePartData(partCodePrefix = 'PART') {
  return {
    partCode: generatePartCode(partCodePrefix),
    description: generateDescription(),
    barCode: generateBarcode(),
  }
}

/**
 * Generate customer data — only the three required fields.
 * Matches the original test behaviour (never fills phone / email).
 */
export function generateCustomerData() {
  return {
    firstName: generateFirstName(),
    lastName: generateLastName(),
    mobileNumber: generateMobileNumber(),
  }
}

/**
 * Generate stock adjustment data
 */
export function generateStockAdjustment(delta = 10, notes = 'Test adjustment') {
  return {
    delta: delta.toString(),
    notes: `${notes}_${generateTimestamp()}`,
  }
}
