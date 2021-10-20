const { strict: assert } = require('assert');
const { withFixtures } = require('../helpers');

const recoverPhrase = "tape acoustic spy autumn ribbon badge exhibit point victory very auto stereo";
const password = 'Asdqwe123!';

describe('New install import account', function () {

  it('should import existing account successfully', async function () {
    await withFixtures(
      {
        title: this.test.title,
      },
      async ({ driver }) => {
        await driver.navigate();
   
        // await driver.press('#password', driver.Key.ENTER);

        await driver.clickElement('#link');
        await driver.fill('#recoveryPhraseInput', recoverPhrase);
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

  
});
