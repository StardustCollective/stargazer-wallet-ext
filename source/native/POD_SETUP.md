# CocoaPods Setup Guide

## Issue

React Native 0.66.1 has a known issue with newer versions of CocoaPods (1.15+) where the Boost library download URL no longer works.

## Solution

This project uses **Bundler** to manage the correct CocoaPods version (1.14.3) that is compatible with React Native 0.66.1.

## Setup Instructions

### 1. Install CocoaPods Dependencies

Always use `bundle exec` when running pod commands to ensure you're using the correct version:

```bash
cd source/native/ios
LANG=en_US.UTF-8 bundle exec pod install
```

### 2. Managing Multiple CocoaPods Versions

The `Gemfile` in the `source/native` directory locks CocoaPods to version 1.14.3. To use it:

```bash
cd source/native
bundle install  # Install the gems specified in Gemfile
```

### 3. Common Commands

- **Install/Update Pods**: `cd source/native/ios && LANG=en_US.UTF-8 bundle exec pod install`
- **Update Pod Repos**: `cd source/native/ios && LANG=en_US.UTF-8 bundle exec pod install --repo-update`
- **Clean and Reinstall**:
  ```bash
  cd source/native/ios
  rm -rf Pods Podfile.lock
  LANG=en_US.UTF-8 bundle exec pod install
  ```

### 4. Boost URL Patch

A patch has been created to fix the Boost download URL:

- Location: `source/native/patches/react-native+0.66.1.patch`
- This patch automatically updates the Boost podspec to use a working mirror
- Applied automatically via the `postinstall` script in root `package.json`

## Troubleshooting

### UTF-8 Encoding Error

If you see `Unicode Normalization not appropriate for ASCII-8BIT`, always prefix your commands with `LANG=en_US.UTF-8`:

```bash
LANG=en_US.UTF-8 bundle exec pod install
```

### Wrong CocoaPods Version

If you accidentally use the global CocoaPods version, you may encounter errors. Always use `bundle exec`:

```bash
# ❌ Wrong
pod install

# ✅ Correct
bundle exec pod install
```

### Cache Issues

If you continue to have issues, clear the CocoaPods cache:

```bash
cd source/native/ios
LANG=en_US.UTF-8 bundle exec pod cache clean --all
rm -rf ~/Library/Caches/CocoaPods
rm -rf Pods Podfile.lock
LANG=en_US.UTF-8 bundle exec pod install
```

## Technical Details

### Why CocoaPods 1.14.3?

- React Native 0.66.1 was built and tested with CocoaPods 1.14.3
- Newer versions (1.15+) have breaking changes that cause issues with Boost library downloads
- The Podfile.lock was generated with 1.14.3, so we match that version for consistency

### Why the Boost Patch?

The original Boost download URL (`https://boostorg.jfrog.io/artifactory/...`) no longer serves the files correctly. The patch changes it to `https://archives.boost.io/...` which is a reliable mirror maintained by the Boost community.

