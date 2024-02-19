const fs = require('fs');

function incrementAndroidVersion(filePath, incrementType) {
  try {
    let gradleFile = fs.readFileSync(filePath, 'utf-8');
    let newVersionCode = 0;
    gradleFile = gradleFile.replace(/versionCode\s+\d+/, match => {
      const currentVersionCode = parseInt(match.split(' ')[1]);
      newVersionCode = currentVersionCode + 1;
      return `versionCode ${newVersionCode}`;
    });

    let newMajor = null;
    let newMinor = null;
    let newPatch = null;

    gradleFile = gradleFile.replace(
      /versionName\s+"(\d+)\.(\d+)\.(\d+)"/,
      (match, major, minor, patch) => {
        newMajor = major;
        newMinor = minor;
        newPatch = patch;

        if (incrementType === 'major') {
          newMajor = parseInt(major) + 1;
          newMinor = 0;
          newPatch = 0;
        } else if (incrementType === 'minor') {
          newMinor = parseInt(minor) + 1;
          newPatch = 0;
        } else if (incrementType === 'patch') {
          newPatch = parseInt(patch) + 1;
        }

        return `versionName "${newMajor}.${newMinor}.${newPatch}"`;
      },
    );

    fs.writeFileSync(filePath, gradleFile, 'utf-8');
    console.log(
      `New Android version = v${newMajor}.${newMinor}.${newPatch} (${newVersionCode})`,
    );
  } catch (error) {
    console.error('Error incrementing Android version:', error);
  }
}

function incrementIOSVersion(filePath, incrementType) {
  try {
    let pbxprojFile = fs.readFileSync(filePath, 'utf-8');
    let newProjectVersion = 0;
    pbxprojFile = pbxprojFile.replace(
      /CURRENT_PROJECT_VERSION\s+=\s+\d+/g,
      match => {
        const currentProjectVersion = parseInt(match.split('=')[1].trim());
        newProjectVersion = currentProjectVersion + 1;
        return `CURRENT_PROJECT_VERSION = ${newProjectVersion}`;
      },
    );

    let newMajor = null;
    let newMinor = null;
    let newPatch = null;

    pbxprojFile = pbxprojFile.replace(
      /MARKETING_VERSION\s*=\s*\d+\.\d+\.\d/g,
      match => {
        const currentMarketingVersion = match.match(/\d+\.\d+\.\d+/);
        const [major, minor, patch] = currentMarketingVersion[0]
          .split('.')
          .map(Number);

        newMajor = major;
        newMinor = minor;
        newPatch = patch;

        if (incrementType === 'major') {
          newMajor += 1;
          newMinor = 0;
          newPatch = 0;
        } else if (incrementType === 'minor') {
          newMinor += 1;
          newPatch = 0;
        } else if (incrementType === 'patch') {
          newPatch += 1;
        }

        return `MARKETING_VERSION = ${newMajor}.${newMinor}.${newPatch}`;
      },
    );

    fs.writeFileSync(filePath, pbxprojFile, 'utf-8');
    console.log(
      `New iOS version = v${newMajor}.${newMinor}.${newPatch} (${newProjectVersion})`,
    );
  } catch (error) {
    console.error('Error incrementing iOS version:', error);
  }
}

const platform = process.argv[2];
const incrementType = process.argv[3];

const androidBuildGradleFilePath = './android/app/build.gradle';
const iosPbxprojFilePath = './ios/Stargazer.xcodeproj/project.pbxproj';

if (platform === 'android') {
  incrementAndroidVersion(androidBuildGradleFilePath, incrementType);
} else if (platform === 'ios') {
  incrementIOSVersion(iosPbxprojFilePath, incrementType);
} else {
  console.error('Invalid platform. Use "android" or "ios".');
}
