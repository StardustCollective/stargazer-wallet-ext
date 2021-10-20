const path = require('path');
// const sinon = require('sinon');
// const createStaticServer = require('../../development/create-static-server');
// const {
//   createSegmentServer,
// } = require('../../development/lib/create-segment-server');
// const Ganache = require('./ganache');
// const FixtureServer = require('./fixture-server');
const { buildWebDriver } = require('./webdriver');
// const { ensureXServerIsRunning } = require('./x-server');

const tinyDelayMs = 200;
const regularDelayMs = tinyDelayMs * 2;
const largeDelayMs = regularDelayMs * 2;

const dappPort = 8080;

async function withFixtures(options, testSuite) {
  const {
    dapp,
    fixtures,
    ganacheOptions,
    driverOptions,
    mockSegment,
    title,
    failOnConsoleError = true,
    dappPath = undefined,
  } = options;
  // const fixtureServer = new FixtureServer();
  // const ganacheServer = new Ganache();
  // let secondaryGanacheServer;
  let dappServer;
  let segmentServer;
  let segmentStub;

  let webDriver;
  let failed = false;
  try {
    // await ganacheServer.start(ganacheOptions);
    // if (ganacheOptions?.concurrent) {
    //   const { port, chainId } = ganacheOptions.concurrent;
    //   secondaryGanacheServer = new Ganache();
    //   await secondaryGanacheServer.start({
    //     blockTime: 2,
    //     _chainIdRpc: chainId,
    //     port,
    //     vmErrorsOnRPCResponse: false,
    //   });
    // }
    // await fixtureServer.start();
    // await fixtureServer.loadState(path.join(__dirname, 'fixtures', fixtures));
    // if (dapp) {
    //   let dappDirectory;
    //   if (dappPath) {
    //     dappDirectory = path.resolve(__dirname, dappPath);
    //   } else {
    //     dappDirectory = path.resolve(
    //       __dirname,
    //       '..',
    //       '..',
    //       'node_modules',
    //       '@metamask',
    //       'test-dapp',
    //       'dist',
    //     );
    //   }
    //   dappServer = createStaticServer(dappDirectory);
    //   dappServer.listen(dappPort);
    //   await new Promise((resolve, reject) => {
    //     dappServer.on('listening', resolve);
    //     dappServer.on('error', reject);
    //   });
    // }
    // if (mockSegment) {
    //   segmentStub = sinon.stub();
    //   segmentServer = createSegmentServer((_request, response, events) => {
    //     for (const event of events) {
    //       segmentStub(event);
    //     }
    //     response.statusCode = 200;
    //     response.end();
    //   });
    //   await segmentServer.start(9090);
    // }
    if (
      process.env.SELENIUM_BROWSER === 'chrome' &&
      process.env.CI === 'true'
    ) {
      // await ensureXServerIsRunning();
    }
    const { driver } = await buildWebDriver(driverOptions);
    webDriver = driver;

    await testSuite({
      driver,
      segmentStub,
    });

    if (process.env.SELENIUM_BROWSER === 'chrome') {
      const errors = await driver.checkBrowserForConsoleErrors(driver);
      if (errors.length) {
        const errorReports = errors.map((err) => err.message);
        const errorMessage = `Errors found in browser console:\n${errorReports.join(
          '\n',
        )}`;
        if (failOnConsoleError) {
          throw new Error(errorMessage);
        } else {
          console.error(new Error(errorMessage));
        }
      }
    }
  } catch (error) {
    failed = true;
    if (webDriver) {
      try {
        await webDriver.verboseReportOnFailure(title);
      } catch (verboseReportError) {
        console.error(verboseReportError);
      }
    }
    throw error;
  } finally {
    if (!failed || process.env.E2E_LEAVE_RUNNING !== 'true') {
      // await fixtureServer.stop();
      // await ganacheServer.quit();
      // if (ganacheOptions?.concurrent) {
      //   await secondaryGanacheServer.quit();
      // }
      if (webDriver) {
        await webDriver.quit();
      }
      // if (dappServer && dappServer.listening) {
      //   await new Promise((resolve, reject) => {
      //     dappServer.close((error) => {
      //       if (error) {
      //         return reject(error);
      //       }
      //       return resolve();
      //     });
      //   });
      // }
      // if (segmentServer) {
      //   await segmentServer.stop();
      // }
    }
  }
}

module.exports = {
  tinyDelayMs,
  regularDelayMs,
  largeDelayMs,
  withFixtures,
};
