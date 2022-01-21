const { strict: assert } = require('assert');
const { withFixtures } = require('../helpers');
const CONSTANTS = require('../constants');

describe('New install new account', () => {
  it('should create a new account successfully', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false,
      },
      async ({ driver }) => {
        const recoveryPhrase = [];

        await driver.navigate();

        await driver.clickElement('#start-getStartedButton');
        await driver.fill('#createPass-password', CONSTANTS.PASSWORD);
        await driver.fill('#createPass-confirmPassword', CONSTANTS.PASSWORD);
        await driver.clickElement('#createPass-nextButton');
        await driver.clickElement('#createPass-nextButton');
        await driver.clickElement('#remindPhrase-startButton');

        const elements = await driver.findAllElementsWithId('createPhrase-phrase');

        for (const element of elements) {
          const phrase = await element.getText();
          recoveryPhrase.push(phrase);
        }

        await driver.clickElement('#createPhrase-confirmButton');
        await driver.clickElement('#createPhrase-confirmButton');

        for (const phrase of recoveryPhrase) {
          await driver.clickElement(`#${phrase}`);
        }

        await driver.clickElement('#confirmPhrase-confirmButton');
        await driver.clickElement('#confirmPhrase-confirmButton');
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

        await driver.clickElement('#start-getStartedButton');

        await driver.fill('#createPass-password', CONSTANTS.INVALID_PASSWORD);
        await driver.fill('#createPass-confirmPassword', CONSTANTS.INVALID_PASSWORD);
        await driver.clickElement('#createPass-nextButton');

        const message = await driver.waitForSelector({
          css: '#createPass-passwordError',
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

        await driver.clickElement('#start-getStartedButton');

        await driver.fill('#createPass-password', 'Asdqwe123!');
        await driver.fill('#createPass-confirmPassword', 'Asdqwe12345678!');
        await driver.clickElement('#createPass-nextButton');

        const message = await driver.waitForSelector({
          css: '#createPass-passwordError',
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

        await driver.clickElement('#start-getStartedButton');
        await driver.clickElement('#createPass-nextButton');

        const message = await driver.waitForSelector({
          css: '#createPass-passwordError',
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

        await driver.clickElement('#start-getStartedButton');

        await driver.fill('#createPass-password', CONSTANTS.PASSWORD);
        await driver.clickElement('#createPass-nextButton');

        const message = await driver.waitForSelector({
          css: '#createPass-passwordError',
          text: 'Confirm password',
        });

        assert.equal(await message.getText(), 'Confirm password is a required field!');
      }
    );
  });

  it('should test that the validate button is initially disabled ', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false,
      },
      async ({ driver }) => {
        await driver.navigate();

        await driver.clickElement('#start-getStartedButton');
        await driver.fill('#createPass-password', CONSTANTS.PASSWORD);
        await driver.fill('#createPass-confirmPassword', CONSTANTS.PASSWORD);
        await driver.clickElement('#createPass-nextButton');
        await driver.clickElement('#createPass-nextButton');
        await driver.clickElement('#remindPhrase-startButton');
        await driver.clickElement('#createPhrase-confirmButton');
        await driver.clickElement('#createPhrase-confirmButton');

        const element = await driver.findElement('#confirmPhrase-confirmButton');
        assert.equal(await element.isEnabled(), false);
      }
    );
  });

  it('should test that the validate button will remain disabled when only selecting 11 phrases ', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false,
      },
      async ({ driver }) => {
        const recoveryPhrase = [];

        await driver.navigate();

        await driver.clickElement('#start-getStartedButton');
        await driver.fill('#createPass-password', CONSTANTS.PASSWORD);
        await driver.fill('#createPass-confirmPassword', CONSTANTS.PASSWORD);
        await driver.clickElement('#createPass-nextButton');
        await driver.clickElement('#createPass-nextButton');
        await driver.clickElement('#remindPhrase-startButton');

        const elements = await driver.findAllElementsWithId('createPhrase-phrase');

        for (const element of elements) {
          const phrase = await element.getText();
          recoveryPhrase.push(phrase);
        }

        await driver.clickElement('#createPhrase-confirmButton');
        await driver.clickElement('#createPhrase-confirmButton');

        for (let i = 0; i < recoveryPhrase.length - 1; i++) {
          await driver.clickElement(`#${recoveryPhrase[i]}`);
        }

        const element = await driver.findElement('#confirmPhrase-confirmButton');
        assert.equal(await element.isEnabled(), false);
      }
    );
  });

  it('should test that the validate button will become enabled when the 12th phrase is selected ', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false,
      },
      async ({ driver }) => {
        const recoveryPhrase = [];

        await driver.navigate();

        await driver.clickElement('#start-getStartedButton');
        await driver.fill('#createPass-password', CONSTANTS.PASSWORD);
        await driver.fill('#createPass-confirmPassword', CONSTANTS.PASSWORD);
        await driver.clickElement('#createPass-nextButton');
        await driver.clickElement('#createPass-nextButton');
        await driver.clickElement('#remindPhrase-startButton');

        const elements = await driver.findAllElementsWithId('createPhrase-phrase');

        for (const element of elements) {
          const phrase = await element.getText();
          recoveryPhrase.push(phrase);
        }

        await driver.clickElement('#createPhrase-confirmButton');
        await driver.clickElement('#createPhrase-confirmButton');

        for (const phrase of recoveryPhrase) {
          await driver.clickElement(`#${phrase}`);
        }

        const element = await driver.findElement('#confirmPhrase-confirmButton');
        assert.equal(await element.isEnabled(), true);
      }
    );
  });

  it('should test that the validate button will remain disabled when selecting the incorrect order of the recovery phrases ', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false,
      },
      async ({ driver }) => {
        const recoveryPhrase = [];

        await driver.navigate();

        await driver.clickElement('#start-getStartedButton');
        await driver.fill('#createPass-password', CONSTANTS.PASSWORD);
        await driver.fill('#createPass-confirmPassword', CONSTANTS.PASSWORD);
        await driver.clickElement('#createPass-nextButton');
        await driver.clickElement('#createPass-nextButton');
        await driver.clickElement('#remindPhrase-startButton');

        const elements = await driver.findAllElementsWithId('createPhrase-phrase');

        for (const element of elements) {
          const phrase = await element.getText();
          recoveryPhrase.push(phrase);
        }

        await driver.clickElement('#createPhrase-confirmButton');
        await driver.clickElement('#createPhrase-confirmButton');

        for (let i = recoveryPhrase.length - 1; i >= 0; i--) {
          await driver.clickElement(`#${recoveryPhrase[i]}`);
        }

        const element = await driver.findElement('#confirmPhrase-confirmButton');
        assert.equal(await element.isEnabled(), false);
      }
    );
  });
});
