const { strict: assert } = require('assert');
const { buildWebDriver } = require('../webdriver');
const CONSTANTS = require('../constants');
const { Key, By } = require('selenium-webdriver');
const wifi = require('../../../../node_modules/node-wifi');

////////////////////////////
// Helper Functions
////////////////////////////

/**
 * Helper method used to simulate internet disconnection
 */
const disconnectWifi = async () => {
  wifi.init({
    iface: null
  });

  wifi.disconnect(error => {
    if (error) {
      console.log(error);
    } else {
      console.log('Wifi Disconnected');
    }
  });
}

////////////////////////////
// Test
////////////////////////////


describe.only('Existing user login', async () => {
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

  describe('Test login success w/wifi and w/o wifi', async () => {
    beforeEach(async () => {
      await driver.clickElement('#header-moreButton');
      const actions = await driver.actions();
      const walletLogOut = await driver.findElement('#settings-logoutButton');
      actions.move({ origin: walletLogOut }).click().perform();
    });

    it('test login success w/ correct key', async () => {
      await driver.fill('#ui-login-password', CONSTANTS.PASSWORD);
      await driver.clickElement('#ui-login-submit-button');
      const statusElement = await driver.findElement('#ui-login-status');
      assert.equal(await await statusElement.getText(),'Login successful.');
      await driver.clickElement('#header-moreButton');
      const actions = await driver.actions();
      const walletLogOut = await driver.findElement('#settings-logoutButton');
    });

    it('test login failure with incorrect key', async () => {
      await driver.fill('#ui-login-password', 'incorrect_password');
      await driver.clickElement('#ui-login-submit-button');
      const statusElement = await driver.findElement('#ui-login-status');
      assert.equal(await await statusElement.getText(),'Error: Invalid password');
    });

    it('test login failure with correct key and w/o wifi', async () => {
      disconnectWifi();
      await driver.fill('#ui-login-password', CONSTANTS.PASSWORD);
      await driver.clickElement('#ui-login-submit-button');
      const statusElement = await driver.findElement('#ui-login-status');
      assert.equal(await await statusElement.getText(),'Error: Invalid password');
    });

    it('test login failure with incorrect key and w/o wifi', async () => {
      disconnectWifi();
      await driver.fill('#ui-login-password', 'incorrect_password');
      await driver.clickElement('#ui-login-submit-button');
      const statusElement = await driver.findElement('#ui-login-status');
      assert.equal(await await statusElement.getText(),'Error: Invalid password');
    });
  })
});
