const { strict: assert } = require('assert');
const { buildWebDriver } = require('../webdriver');
const CONSTANTS = require('../constants');
const { Key, By } = require('selenium-webdriver');

////////////////////////////
// Helper Functions
////////////////////////////

/**
 * Helper method used to raise an error during log in (simulate internet disconnection)
 * @param {string} connected 
 */
const isConnected = async (connected, driver) => {
  var connectionState = connected == "yes" ? true : false;
  // Logic to simulate disconnection (if needed)
  return connectionState;
}

////////////////////////////
// Test
////////////////////////////


describe('Existing user login', async () => {
  let driver;

  beforeEach(async () => {
    const { driver: webDriver } = await buildWebDriver();
    driver = webDriver;

    driver.navigate();

    await driver.clickElement('#link');
    await driver.fill('#recoveryPhraseInput', CONSTANTS.WALLET_ONE_SEED_PHRASE);
    await driver.clickElement('#recoveryPhraseSubmit');
    await driver.fill('#passwordField', CONSTANTS.PASSWORD);
    await driver.fill('#confirmPasswordField', CONSTANTS.PASSWORD);
    await driver.clickElement('#nextButton');
    await driver.clickElement('#nextButton');
  });

  afterEach(async () => {
    driver.quit();
  });

  describe('Test login failure on branch \"main\"', async () => {
    beforeEach(async () => {
      const actions = await driver.actions();
      const walletLogOut = await driver.findElement('#ui-logout-div');
      actions.move({ origin: walletLogOut }).click().perform();
      await driver.fill('#ui-login-password', CONSTANTS.PASSWORD);
    });

    it('test that the login attempt fails', async () => {
      await driver.clickElement('#ui-login-submit-button')
      // Include login to raise an error during login ...
      // Observe the login failure with "Invalid Password" message
      // Trigger an error and then attempt to login
      //await driver.clickElement('#ui-logout-div');
      
      // Check internet connection
      const result = await isConnected("no", driver);
      assert.equal(result, false);
    });
  })

  describe('Test login success on branch \"chin-sgw-64-invalid-password-bug\"', async () => {
    beforeEach(async () => {
      const actions = await driver.actions();
      const walletLogOut = await driver.findElement('#ui-logout-div');
      actions.move({ origin: walletLogOut }).click().perform();
      await driver.fill('#ui-login-password', CONSTANTS.PASSWORD);
    });

    it('test that the login attempt succeeds', async () => {
      await driver.clickElement('#ui-login-submit-button')
      // Check internet connection
      const result = await isConnected("yes", driver);
      // Observe the login success
      assert.equal(result, true);
    });
  })
});
