import './commands'

// Ignore known uncaught exception from auth provider: postMessage on null when auth iframe
// is torn down (PrimaryOriginCommunicator). This is intermittent third-party code we cannot fix.
Cypress.on('uncaught:exception', (err) => {
  if (err.message?.includes("Cannot read properties of null (reading 'postMessage')")) {
    return false // prevent Cypress from failing the test
  }
  return true
})