const { strict: assert } = require('assert');
const { withFixtures } = require('../helpers');
const CONSTANTS = require('../constants');

describe('New install import account', () => {
  it('should import existing account successfully', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false,
      },
      async ({ driver }) => {
        await driver.navigate();

        await driver.clickElement('#link');
        await driver.fill('#recoveryPhraseInput', CONSTANTS.WALLET_ONE_SEED_PHRASE);
        await driver.clickElement('#recoveryPhraseSubmit');

        await driver.fill('#passwordField', CONSTANTS.PASSWORD);
        await driver.fill('#confirmPasswordField', CONSTANTS.PASSWORD);
        await driver.clickElement('#nextButton');

        const message = await driver.waitForSelector({
          css: '.body-comment',
          text: 'Your wallet',
        });

        assert.equal(
          await message.getText(),
          'Your wallet and all connected accounts have been imported.'
        );
      }
    );
  });

  it('should display an error message when entering an invalid seed phrase ', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false,
      },
      async ({ driver }) => {
        await driver.navigate();

        await driver.clickElement('#link');
        await driver.fill('#recoveryPhraseInput', CONSTANTS.INVALID_SEED_PHRASE);
        await driver.clickElement('#recoveryPhraseSubmit');

        const message = await driver.waitForSelector({
          css: '#seedPhraseError',
          text: 'Invalid recovery',
        });

        assert.equal(await message.getText(), 'Invalid recovery seed phrase');
      }
    );
  });

  it('should test that the import button is disabled when the seed phrase input is blank ', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false,
      },
      async ({ driver }) => {
        await driver.navigate();

        await driver.clickElement('#link');
        const element = await driver.findElement('#recoveryPhraseSubmit');
        assert.equal(await element.isEnabled(), false);
      }
    );
  });

  it('should test that the import button is enabled when 12 word seed phrase is entered', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false,
      },
      async ({ driver }) => {
        await driver.navigate();

        await driver.clickElement('#link');
        await driver.fill('#recoveryPhraseInput', CONSTANTS.WALLET_ONE_SEED_PHRASE);
        const element = await driver.findElement('#recoveryPhraseSubmit');
        assert.equal(await element.isEnabled(), true);
      }
    );
  });

  it('should display an error when the password does not meet the requirements', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false,
      },
      async ({ driver }) => {
        await driver.navigate();

        await driver.clickElement('#link');
        await driver.fill('#recoveryPhraseInput', CONSTANTS.WALLET_ONE_SEED_PHRASE);
        await driver.clickElement('#recoveryPhraseSubmit');

        await driver.fill('#passwordField', CONSTANTS.INVALID_PASSWORD);
        await driver.fill('#confirmPasswordField', CONSTANTS.INVALID_PASSWORD);
        await driver.clickElement('#nextButton');

        const message = await driver.waitForSelector({
          css: '#passwordError',
          text: 'Please check',
        });

        assert.equal(await message.getText(), 'Please check the above requirements!');
      }
    );
  });

  it('should display an error when the password does not match', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false,
      },
      async ({ driver }) => {
        await driver.navigate();

        await driver.clickElement('#link');
        await driver.fill('#recoveryPhraseInput', CONSTANTS.WALLET_ONE_SEED_PHRASE);
        await driver.clickElement('#recoveryPhraseSubmit');

        await driver.fill('#passwordField', 'Asdqwe123!!');
        await driver.fill('#confirmPasswordField', 'Asdqwe123!');
        await driver.clickElement('#nextButton');

        const message = await driver.waitForSelector({
          css: '#passwordError',
          text: 'Incorrect please',
        });

        assert.equal(await message.getText(), 'Incorrect please re-enter password!');
      }
    );
  });

  it('should display an error when no password is entered', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false,
      },
      async ({ driver }) => {
        await driver.navigate();

        await driver.clickElement('#link');
        await driver.fill('#recoveryPhraseInput', CONSTANTS.WALLET_ONE_SEED_PHRASE);
        await driver.clickElement('#recoveryPhraseSubmit');

        await driver.clickElement('#nextButton');

        const message = await driver.waitForSelector({
          css: '#passwordError',
          text: 'Password is a',
        });

        assert.equal(await message.getText(), 'Password is a required field!');
      }
    );
  });

  it('should display an error when the confirm password field is not filled', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false,
      },
      async ({ driver }) => {
        await driver.navigate();

        await driver.clickElement('#link');
        await driver.fill('#recoveryPhraseInput', CONSTANTS.WALLET_ONE_SEED_PHRASE);
        await driver.clickElement('#recoveryPhraseSubmit');

        await driver.fill('#passwordField', 'Asdqwe123!!');
        await driver.clickElement('#nextButton');

        const message = await driver.waitForSelector({
          css: '#passwordError',
          text: 'Confirm password',
        });

        assert.equal(await message.getText(), 'Confirm password is a required field!');
      }
    );
  });
});
