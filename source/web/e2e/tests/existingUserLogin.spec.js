const { strict: assert } = require('assert');
const { buildWebDriver } = require('../webdriver');
const CONSTANTS = require('../constants');
const { Key, By } = require('selenium-webdriver');
const wifi = require('node-wifi');

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

  describe('test login', async () => {
    beforeEach(async () => {
      await driver.clickElement('#header-moreButton');
      const actions = await driver.actions();
      const walletLogOut = await driver.findElement('#wallet-logoutButton');
      actions.move({ origin: walletLogOut }).click().perform();
    });

    it('test login success with correct key', async () => {
      await driver.fill('#login-passwordField', CONSTANTS.PASSWORD);
      await driver.clickElement('#login-submitButton');
      const homeScene = await driver.findElement('#home-scene');
      assert.notEqual(homeScene,null);
    });

    it('test login failure with incorrect key', async () => {
      await driver.fill('#login-passwordField', 'incorrect_key_value');
      await driver.clickElement('#login-submitButton');
      const statusElement = await driver.findElement('#login-failure');
      assert.equal(await statusElement.getText(),'Error: Invalid password');
    });
  })
});
