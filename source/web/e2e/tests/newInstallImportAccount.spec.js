const { strict: assert } = require('assert');
const { withFixtures } = require('../helpers');

const seedPhrase = "tape acoustic spy autumn ribbon badge exhibit point victory very auto stereo";
const password = 'Asdqwe123!';
const invalidSeed = 'asdaedasdasda dasdas asda da asdda asd asd asdadasd asda. asdasdasd as as'
    

describe('New install import account', function () {

  it('should import existing account successfully', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false
      },
      async ({ driver }) => {
        await driver.navigate();

        await driver.clickElement('#link');
        await driver.fill('#recoveryPhraseInput', seedPhrase);
        await driver.clickElement('#recoveryPhraseSubmit');

        await driver.fill('#passwordField', password);
        await driver.fill('#confirmPasswordField', password);
        await driver.clickElement('#nextButton');

        const message = await driver.waitForSelector({
          css: '.body-comment',
          text: 'Your wallet',
        });
        
        assert.equal(await message.getText(), 'Your wallet and all connected accounts have been imported.');
 
      },
    );
  });

  it('should display an error message when entering a blank seed phrase ', async function () {
    
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false,
      },
      async ({ driver }) => {
        await driver.navigate();

        await driver.clickElement('#link');
        await driver.fill('#recoveryPhraseInput', invalidSeed);
        await driver.clickElement('#recoveryPhraseSubmit');

        const message = await driver.waitForSelector({
          css: '#seedPhraseError',
          text: 'Invalid recovery',
        });
        
        assert.equal(await message.getText(), 'Invalid recovery seed phrase');
 
      },
    );
  });

  it('should display an error when the password does not meet the requirements', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false
      },
      async ({ driver }) => {
        await driver.navigate();

        await driver.clickElement('#link');
        await driver.fill('#recoveryPhraseInput', seedPhrase);
        await driver.clickElement('#recoveryPhraseSubmit');

        await driver.fill('#passwordField', '12345');
        await driver.fill('#confirmPasswordField', '12345');
        await driver.clickElement('#nextButton');

        const message = await driver.waitForSelector({
          css: '#passwordError',
          text: 'Please check',
        });
        
        assert.equal(await message.getText(), 'Please check the above requirements!');
 
      },
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
        await driver.fill('#recoveryPhraseInput', seedPhrase);
        await driver.clickElement('#recoveryPhraseSubmit');

        await driver.fill('#passwordField', 'Asdqwe123!!');
        await driver.fill('#confirmPasswordField', 'Asdqwe123!');
        await driver.clickElement('#nextButton');

        const message = await driver.waitForSelector({
          css: '#passwordError',
          text: 'Incorrect please',
        });
        
        assert.equal(await message.getText(), 'Incorrect please re-enter password!');
 
      },
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
        await driver.fill('#recoveryPhraseInput', seedPhrase);
        await driver.clickElement('#recoveryPhraseSubmit');

        await driver.clickElement('#nextButton');

        const message = await driver.waitForSelector({
          css: '#passwordError',
          text: 'Password is a',
        });
        
        assert.equal(await message.getText(), 'Password is a required field!');
 
      },
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
        await driver.fill('#recoveryPhraseInput', seedPhrase);
        await driver.clickElement('#recoveryPhraseSubmit');

        await driver.fill('#passwordField', 'Asdqwe123!!');
        await driver.clickElement('#nextButton');

        const message = await driver.waitForSelector({
          css: '#passwordError',
          text: 'Confirm password',
        });
        
        assert.equal(await message.getText(), 'Confirm password is a required field!');
 
      },
    );
  });


  
});
