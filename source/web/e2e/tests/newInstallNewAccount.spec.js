const { strict: assert } = require('assert');
const { withFixtures } = require('../helpers');

const password        = 'Asdqwe123!';
const invalidPassword = '12345'

describe.only('New install new account', function () {

  it('should create a new account successfully', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false
      },
      async ({ driver }) => {
        let recoveryPhrase = [];

        await driver.navigate();

        await driver.clickElement('#start-getStartedButton');
        await driver.fill('#createPass-password', password);
        await driver.fill('#createPass-confirmPassword', password);
        await driver.clickElement('#createPass-nextButton');
        await driver.clickElement('#createPass-nextButton');
        await driver.clickElement('#remindPhrase-startButton');

       let elements = await driver.findAllElementsWithId('createPhrase-phrase')

       for(const element of elements){
        const phrase = await element.getText();
        recoveryPhrase.push(phrase);
       }

       await driver.clickElement('#createPhrase-confirmButton');
       await driver.clickElement('#createPhrase-confirmButton');

       for(const phrase of recoveryPhrase){
        await driver.clickElement(`#${phrase}`);
       }

       await driver.clickElement('#confirmPhrase-confirmButton');
       await driver.clickElement('#confirmPhrase-confirmButton');

      },
    );
  });

  
});
