const { strict: assert } = require('assert');
const { Key } = require('selenium-webdriver');
const { buildWebDriver } = require('../webdriver');
const CONSTANTS = require('../constants');

let driver;

describe('Existing User: Create Multi-Chain Wallet', () => {
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
    await driver.clickElement('#addWallet-createNewWallet');
  });

  afterEach(async () => {
    driver.quit();
  });

  it('should create a new multi-chain wallet successfully', async () => {
    const walletName = `wallet${Math.floor(Math.random() * 1000)}`;

    await driver.fill('#newAccount-accountNameInput', walletName);
    await driver.clickElement('#newAccount-confirmButton');
    await driver.clickElement('#addWallet-finishButton');
    await driver.clickElement('#settings-wallets');
    await driver.findElement(`#${walletName}`);
  });

  it('should display the 12 word recovery phrase when a new wallet is created', async () => {
    await driver.fill('#newAccount-accountNameInput', 'wallet348397894');
    await driver.clickElement('#newAccount-confirmButton');
    await driver.clickElement('#newAccount-showRecoveryPhrase');
    await driver.fill('#phrase-password', CONSTANTS.PASSWORD);
    const passwordField = await driver.findElement('#phrase-password');
    await passwordField.sendKeys(Key.ENTER);

    const element = await driver.findElement('#phrase-recoveryPhrase');
    const phrase = await element.getText();
    const phraseArray = phrase.split(' ');

    assert.equal(phraseArray.length, 12);
  });

  it('should test that the user remains in the enter account name screen when no name is entered', async () => {
    await driver.clickElement('#newAccount-confirmButton');

    const message = await driver.waitForSelector({
      css: '#newAccount-nameAccountText',
      text: 'Please name',
    });

    assert.equal(await message.getText(), 'Please name your new account:');
  });

  it('should send the user back to the main setting screen when clicking the close button', async () => {
    await driver.clickElement('#newAccount-cancelButton');
    await driver.findElement('#settings-wallets');
  });
});
