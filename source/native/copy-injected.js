const fs = require('fs');
const path = require('path');

function copyFile(sourcePath, destinationPath, destinationPathAndroid) {
  try {
    // Check if the source file exists
    if (!fs.existsSync(sourcePath)) {
      console.log('Source file does not exist.');
      return;
    }

    // Check if the destination folder exists, create if not
    const destinationFolder = path.dirname(destinationPath);
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }

    // Check if the destination folder exists, create if not
    const destinationAndroidFolder = path.dirname(destinationPathAndroid);
    if (!fs.existsSync(destinationAndroidFolder)) {
      fs.mkdirSync(destinationAndroidFolder, { recursive: true });
    }

    // Perform the file copy
    fs.copyFileSync(sourcePath, destinationPath);
    fs.copyFileSync(sourcePath, destinationPathAndroid);
    console.log(`File successfully copied from '${sourcePath}' to '${destinationPath}'.`);
    console.log(
      `File successfully copied from '${sourcePath}' to '${destinationPathAndroid}'.`
    );
  } catch (error) {
    console.error(`Error occurred: ${error.message}`);
  }
}

// Usage example
const sourceFile = 'source/web/extension/chrome/js/injectedScript.bundle.js';
const destinationFile = 'source/native/ios/Assets/injectedScript.bundle.js';
const destinationFileAndroid =
  'source/native/android/app/src/main/assets/injectedScript.bundle.js';
copyFile(sourceFile, destinationFile, destinationFileAndroid);
