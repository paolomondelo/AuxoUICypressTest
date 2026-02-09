import { defineConfig } from 'cypress'
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'

export default defineConfig({
  // Video and screenshot settings
  video: false,
  screenshotOnRunFailure: true,
  
  // Retry configuration for flaky test resilience
  retries: {
    runMode: 2,
    openMode: 0,
  },
  
  // Timeout configurations
  defaultCommandTimeout: 15000,
  requestTimeout: 15000,
  responseTimeout: 15000,
  pageLoadTimeout: 60000,
  
  // Wait settings to reduce flakiness
  waitForAnimations: true,
  animationDistanceThreshold: 5,
  
  // Viewport settings
  viewportWidth: 1920,
  viewportHeight: 1080,

  e2e: {
    // Security and test isolation
    chromeWebSecurity: false,
    testIsolation: true,
    
    // File paths
    fixturesFolder: 'cypress/fixtures',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.feature',
    excludeSpecPattern: ['**/*.md', '**/*.js'],
    
    // Base URL
    baseUrl: 'https://tst.workshop.auxosoftware.com',
    
    // Experiment settings for better stability
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 10,

    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      )

      return config
    },
  },
})
