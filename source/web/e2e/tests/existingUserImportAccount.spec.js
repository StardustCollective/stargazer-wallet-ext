const { strict: assert } = require('assert');
const { buildWebDriver } = require('./../webdriver');
const CONSTANTS = require('../constants');
const { Key, Select } = require('selenium-webdriver');

/**
 * Helper method used to verify if an account address generated
 * from the import is what is expected.
 * @param {string} address 
 */
const verifyAccountAddress = async (address, driver) => {
  const shortAddressLength = address.includes('0x') ? 4 : 5;
  
  const message = await driver.waitForSelector({
    css: '#assetHeader-address',
    text: address.substring(0, 4),
  });
  const ellipsesAddress = await message.getText();
  const addressLength = address.length;
  const prefix = address.substring(0, 4);
  const suffix = address.substring(
    addressLength - 4,
    addressLength
  );
  return ellipsesAddress.includes(prefix) && ellipsesAddress.includes(suffix);
}

describe.only('Existing user import account', async () => {
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
    await driver.clickElement('#header-moreButton');
    await driver.clickElement('#settings-wallets');
    await driver.clickElement('#header-addButton');
    await driver.clickElement('#addWallet-importWallet');
  });

  afterEach(async () => {
    // driver.quit();
  });

  describe('Multi-chain wallet', async () => {
    beforeEach(async () => {
      await driver.clickElement('#importWallet-multiChainWallet');
      await driver.fill(
        '#importPhrase-phraseInput',
        CONSTANTS.WALLET_TWO_SEED_PHRASE
      );
      await driver.fill('#importPhrase-nameInput', CONSTANTS.WALLET_TWO_NAME);
      await driver.clickElement('#importPhrase-importButton');
      let backButtonWallets = await driver.findElement('#header-backButton');
      let actions = await driver.actions();
      actions.move({ origin: backButtonWallets }).click().perform();
      let backButtonMainSettings = await driver.findElement('#header-backButton');
      actions.move({ origin: backButtonMainSettings }).click().perform();
      await driver.delay(500);
    });

    it('test that the constellation account has been imported', async () => {
      await driver.clickElement('#assetItem-constellation')
      const result = await verifyAccountAddress(CONSTANTS.WALLET_TWO_CONSTELLATION_ADDRESS, driver);
      assert.equal(result, true);
    });

    it('test that the ethereum account has been imported', async () => {
      await driver.clickElement('#assetItem-ethereum')
      const result = await verifyAccountAddress(CONSTANTS.WALLET_TWO_ETHEREUM_ADDRESS, driver);
      assert.equal(result, true);
    });
  });

  describe('Ethereum Only Wallet', async () => {
    
    beforeEach(async () => {
      await driver.clickElement('#importWallet-ethereum');
    });

    it('should import an ethereum wallet by private key', async () => {
      await driver.fill('#importAccount-privateKeyInput', CONSTANTS.WALLET_THREE_PRIVATE_KEY);
      await driver.fill('#importAccount-accountNameInput', CONSTANTS.WALLET_THREE_NAME);
      await driver.clickElement('#importAccount-confirmNextButton');
      await driver.clickElement('#importAccount-finishButton');
      let backButtonMainSettings = await driver.findElement('#header-backButton');
      let actions = await driver.actions();
      actions.move({ origin: backButtonMainSettings }).click().perform();
      await driver.delay(500);
      await driver.clickElement('#assetItem-ethereum')
      let result = await verifyAccountAddress(CONSTANTS.WALLET_THREE_ETHEREUM_ADDRESS, driver);
      assert.equal(result, true);
    });

    // it('should import an ethereum wallet by JSON file', async () => {
    //   let importTypeSelectElement = await driver.findElement('#importAccount-importTypeSelect');
    //   importTypeSelectElement.sendKeys(Key.ENTER);
    //   importTypeSelectElement.sendKeys(Key.ARROW_DOWN);
    //   importTypeSelectElement.sendKeys(Key.ENTER);

    // });

  })

  // describe('Constellation Only Wallet', async () => {
    
  //   beforeEach(async () => {
  //     await driver.clickElement('#importWallet-constellation');
  //   });

  //   it('should import an constellation wallet by private key', async () => {
      
  //   });

  //   it('should import an constellation wallet by JSON file', async () => {
      
  //   });

  // })
});
