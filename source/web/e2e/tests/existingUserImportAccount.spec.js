const { strict: assert } = require('assert');
const { By } = require('selenium-webdriver');
const { buildWebDriver } = require('../webdriver');
const CONSTANTS = require('../constants');

/// /////////////////////////
// Helper Functions
/// /////////////////////////

/**
 * Helper method used to verify if an account address generated
 * from the import is what is expected.
 * @param {string} address
 */
const verifyAccountAddress = async (address, driver) => {
  const message = await driver.waitForSelector({
    css: '#assetHeader-address',
    text: address.substring(0, 4),
  });
  const ellipsesAddress = await message.getText();
  const addressLength = address.length;
  const prefix = address.substring(0, 4);
  const suffix = address.substring(addressLength - 4, addressLength);
  return ellipsesAddress.includes(prefix) && ellipsesAddress.includes(suffix);
};

const getPathForFile = (fileName) => {
  const root = process.cwd();
  return `${root}/e2e/data/${fileName}`;
};

/// /////////////////////////
// Test
/// /////////////////////////

describe('Existing user import account', async () => {
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
    driver.quit();
  });

  describe('Multi-chain wallet', async () => {
    beforeEach(async () => {
      await driver.clickElement('#importWallet-multiChainWallet');
      await driver.fill('#importPhrase-phraseInput', CONSTANTS.WALLET_TWO_SEED_PHRASE);
      await driver.fill('#importPhrase-nameInput', CONSTANTS.WALLET_TWO_NAME);
      await driver.clickElement('#importPhrase-importButton');
      await driver.delay(500);
      // Selenium thinks this element isn't visible even though it very much is -
      // this JS hack is the only workaround that works
      await driver.driver.executeScript(
        "document.getElementById('header-backButton').click('click');"
      );
      await driver.delay(500);
      await driver.driver.executeScript(
        "document.getElementById('header-backButton').click('click');"
      );
      await driver.delay(500);
    });

    it('test that the constellation account has been imported', async () => {
      await driver.clickElement('#assetItem-constellation');
      const result = await verifyAccountAddress(
        CONSTANTS.WALLET_TWO_CONSTELLATION_ADDRESS,
        driver
      );
      assert.equal(result, true);
    });

    it('test that the ethereum account has been imported', async () => {
      await driver.clickElement('#assetItem-ethereum');
      const result = await verifyAccountAddress(
        CONSTANTS.WALLET_TWO_ETHEREUM_ADDRESS,
        driver
      );
      assert.equal(result, true);
    });
  });

  describe('Ethereum Only Wallet', async () => {
    beforeEach(async () => {
      await driver.clickElement('#importWallet-ethereum');
    });

    it('should import an ethereum wallet by private key', async () => {
      await driver.fill(
        '#importAccount-privateKeyInput',
        CONSTANTS.WALLET_THREE_ETHEREUM_PRIVATE_KEY
      );
      await driver.fill('#importAccount-accountNameInput', CONSTANTS.WALLET_THREE_NAME);
      await driver.clickElement('#importAccount-confirmNextButton');
      await driver.clickElement('#importAccount-finishButton');
      const backButtonMainSettings = await driver.findElement('#header-backButton');
      const actions = await driver.actions();
      actions.move({ origin: backButtonMainSettings }).click().perform();
      await driver.delay(500);
      await driver.clickElement('#assetItem-ethereum');
      const result = await verifyAccountAddress(
        CONSTANTS.WALLET_THREE_ETHEREUM_ADDRESS,
        driver
      );
      assert.equal(result, true);
    });

    it('should import an ethereum wallet by JSON file', async () => {
      const importTypeSelectElement = await driver.findElement(
        '#importAccount-importTypeSelect'
      );
      importTypeSelectElement.click();
      const jsonFileElement = importTypeSelectElement.findElement(
        By.xpath('//*[.="JSON file"]')
      );
      jsonFileElement.click();
      const fileInputElement = await driver.findElement('#importAccount-fileInput');
      fileInputElement.sendKeys(
        getPathForFile(CONSTANTS.WALLET_THREE_ETHEREUM_JSON_FILE)
      );
      await driver.fill('#importAccount-jsonPasswordInput', CONSTANTS.PASSWORD);
      await driver.fill('#importAccount-accountNameInput', CONSTANTS.WALLET_THREE_NAME);
      await driver.clickElement('#importAccount-confirmNextButton');
      await driver.clickElement('#importAccount-finishButton');
      const backButtonMainSettings = await driver.findElement('#header-backButton');
      const actions = await driver.actions();
      actions.move({ origin: backButtonMainSettings }).click().perform();
      await driver.delay(500);
      await driver.clickElement('#assetItem-ethereum');
      const result = await verifyAccountAddress(
        CONSTANTS.WALLET_THREE_ETHEREUM_ADDRESS,
        driver
      );
      assert.equal(result, true);
    });

    it('should display an error when entering an invalid private key', async () => {
      await driver.fill('#importAccount-privateKeyInput', CONSTANTS.INVALID_PRIVATE_KEY);
      await driver.fill('#importAccount-accountNameInput', CONSTANTS.WALLET_THREE_NAME);
      await driver.clickElement('#importAccount-confirmNextButton');
      await driver.delay(500);
      const errorElement = await driver.findElement('#__react-alert__');
      const errorText = errorElement.findElement(
        By.xpath('//*[.="Error: Invalid private key"]')
      );
      assert.equal(await errorText.getText(), 'Error: Invalid private key');
    });

    it('should display an error when no JSON file has been selected', async () => {
      const importTypeSelectElement = await driver.findElement(
        '#importAccount-importTypeSelect'
      );
      importTypeSelectElement.click();
      const jsonFileElement = importTypeSelectElement.findElement(
        By.xpath('//*[.="JSON file"]')
      );
      jsonFileElement.click();
      await driver.fill('#importAccount-jsonPasswordInput', CONSTANTS.INVALID_PASSWORD);
      await driver.fill('#importAccount-accountNameInput', CONSTANTS.WALLET_FOUR_NAME);
      await driver.clickElement('#importAccount-confirmNextButton');
      await driver.delay(500);
      const errorElement = await driver.findElement('#__react-alert__');
      const errorText = errorElement.findElement(
        By.xpath('//*[.="Error: A private key json file is not chosen"]')
      );
      assert.equal(
        await errorText.getText(),
        'Error: A private key json file is not chosen'
      );
    });

    it('should display an error when selecting an invalid JSON file', async () => {
      const importTypeSelectElement = await driver.findElement(
        '#importAccount-importTypeSelect'
      );
      importTypeSelectElement.click();
      const jsonFileElement = importTypeSelectElement.findElement(
        By.xpath('//*[.="JSON file"]')
      );
      jsonFileElement.click();
      const fileInputElement = await driver.findElement('#importAccount-fileInput');
      fileInputElement.sendKeys(getPathForFile(CONSTANTS.INVALID_JSON_FILE));
      await driver.fill('#importAccount-jsonPasswordInput', CONSTANTS.PASSWORD);
      await driver.fill('#importAccount-accountNameInput', CONSTANTS.WALLET_FOUR_NAME);
      await driver.clickElement('#importAccount-confirmNextButton');
      await driver.delay(500);
      const errorElement = await driver.findElement('#__react-alert__');
      const errorText = errorElement.findElement(
        By.xpath('//*[.="Error: Invalid private key json file"]')
      );
      assert.equal(await errorText.getText(), 'Error: Invalid private key json file');
    });
  });

  describe('Constellation Only Wallet', async () => {
    beforeEach(async () => {
      await driver.clickElement('#importWallet-constellation');
    });

    it('should import a Constellation wallet by private key', async () => {
      await driver.fill(
        '#importAccount-privateKeyInput',
        CONSTANTS.WALLET_FOUR_CONSTELLATION_PRIVATE_KEY
      );
      await driver.fill('#importAccount-accountNameInput', CONSTANTS.WALLET_FOUR_NAME);
      await driver.clickElement('#importAccount-confirmNextButton');
      await driver.clickElement('#importAccount-finishButton');
      const backButtonMainSettings = await driver.findElement('#header-backButton');
      const actions = await driver.actions();
      actions.move({ origin: backButtonMainSettings }).click().perform();
      await driver.delay(500);
      await driver.clickElement('#assetItem-constellation');
      const result = await verifyAccountAddress(
        CONSTANTS.WALLET_FOUR_CONSTELLATION_ADDRESS,
        driver
      );
      assert.equal(result, true);
    });

    it('should import a Constellation wallet by JSON file', async () => {
      const importTypeSelectElement = await driver.findElement(
        '#importAccount-importTypeSelect'
      );
      importTypeSelectElement.click();
      const jsonFileElement = importTypeSelectElement.findElement(
        By.xpath('//*[.="JSON file"]')
      );
      jsonFileElement.click();
      const fileInputElement = await driver.findElement('#importAccount-fileInput');
      fileInputElement.sendKeys(
        getPathForFile(CONSTANTS.WALLET_FOUR_CONSTELLATION_JSON_FILE)
      );
      await driver.fill('#importAccount-jsonPasswordInput', CONSTANTS.PASSWORD);
      await driver.fill('#importAccount-accountNameInput', CONSTANTS.WALLET_FOUR_NAME);
      await driver.clickElement('#importAccount-confirmNextButton');
      await driver.clickElement('#importAccount-finishButton');
      const backButtonMainSettings = await driver.findElement('#header-backButton');
      const actions = await driver.actions();
      actions.move({ origin: backButtonMainSettings }).click().perform();
      await driver.delay(500);
      await driver.clickElement('#assetItem-constellation');
      const result = await verifyAccountAddress(
        CONSTANTS.WALLET_FOUR_CONSTELLATION_ADDRESS,
        driver
      );
      assert.equal(result, true);
    });

    it('should display an error when entering an invalid private key', async () => {
      await driver.fill('#importAccount-privateKeyInput', CONSTANTS.INVALID_PRIVATE_KEY);
      await driver.fill('#importAccount-accountNameInput', CONSTANTS.WALLET_FOUR_NAME);
      await driver.clickElement('#importAccount-confirmNextButton');
      await driver.delay(500);
      const errorElement = await driver.findElement('#__react-alert__');
      const errorText = errorElement.findElement(
        By.xpath('//*[.="Error: Invalid private key"]')
      );
      assert.equal(await errorText.getText(), 'Error: Invalid private key');
    });

    it('should display an error when no JSON file has been selected', async () => {
      const importTypeSelectElement = await driver.findElement(
        '#importAccount-importTypeSelect'
      );
      importTypeSelectElement.click();
      const jsonFileElement = importTypeSelectElement.findElement(
        By.xpath('//*[.="JSON file"]')
      );
      jsonFileElement.click();
      await driver.fill('#importAccount-jsonPasswordInput', CONSTANTS.INVALID_PASSWORD);
      await driver.fill('#importAccount-accountNameInput', CONSTANTS.WALLET_FOUR_NAME);
      await driver.clickElement('#importAccount-confirmNextButton');
      await driver.delay(500);
      const errorElement = await driver.findElement('#__react-alert__');
      const errorText = errorElement.findElement(
        By.xpath('//*[.="Error: A private key json file is not chosen"]')
      );
      assert.equal(
        await errorText.getText(),
        'Error: A private key json file is not chosen'
      );
    });

    it('should display an error when selecting an invalid JSON file', async () => {
      const importTypeSelectElement = await driver.findElement(
        '#importAccount-importTypeSelect'
      );
      importTypeSelectElement.click();
      const jsonFileElement = importTypeSelectElement.findElement(
        By.xpath('//*[.="JSON file"]')
      );
      jsonFileElement.click();
      const fileInputElement = await driver.findElement('#importAccount-fileInput');
      fileInputElement.sendKeys(getPathForFile(CONSTANTS.INVALID_JSON_FILE));
      await driver.fill('#importAccount-jsonPasswordInput', CONSTANTS.PASSWORD);
      await driver.fill('#importAccount-accountNameInput', CONSTANTS.WALLET_FOUR_NAME);
      await driver.clickElement('#importAccount-confirmNextButton');
      await driver.delay(500);
      const errorElement = await driver.findElement('#__react-alert__');
      const errorText = errorElement.findElement(
        By.xpath('//*[.="Error: Invalid private key json file"]')
      );
      assert.equal(await errorText.getText(), 'Error: Invalid private key json file');
    });
  });
});
