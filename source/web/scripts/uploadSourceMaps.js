const { spawnSync } = require('child_process');
const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '../.env.sentry-build-plugin'),
});

const destPath = path.join(__dirname, '../extension');
const targetBrowser = 'chrome';

async function uploadSourceMaps() {
  try {
    // Ensure environment variables are set
    if (!process.env.SENTRY_AUTH_TOKEN) {
      throw new Error('SENTRY_AUTH_TOKEN environment variable is required');
    }

    // Get package version for release
    const packageJson = require('../package.json');
    const version = packageJson.version;
    const release = `stargazer-wallet-web@${version}`;

    console.log('Uploading source maps for release:', release);

    // Use Sentry CLI to upload source maps
    const result = spawnSync(
      'npx',
      [
        '@sentry/cli',
        'sourcemaps',
        'upload',
        '--auth-token',
        process.env.SENTRY_AUTH_TOKEN,
        '--org',
        'dor-technologies',
        '--project',
        'stargazer-wallet-web',
        '--url-prefix',
        '~/',
        '--release',
        release,
        path.join(destPath, targetBrowser),
      ],
      {
        stdio: 'inherit',
        encoding: 'utf-8',
      }
    );

    if (result.status !== 0) {
      throw new Error(`Sentry CLI failed with status ${result.status}`);
    }

    console.log('✅ Source maps uploaded to Sentry successfully');
  } catch (error) {
    console.error('Failed to upload source maps:', error);
    process.exit(1);
  }
}

uploadSourceMaps();
