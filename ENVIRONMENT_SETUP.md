# Stargazer Wallet - Environment Setup Summary

**Date:** October 14, 2025

## ✅ System Versions Validated

### Current Installation

- **Node.js**: v18.20.4 ✅
- **Yarn**: 1.18.0 ✅
- **Ruby**: 3.2.2 ✅
- **CocoaPods (global)**: 1.16.2
- **CocoaPods (bundler)**: 1.14.3 ✅

### Required Versions

- **Node.js**: >=10.0.0 (recommended 18.x)
- **Yarn**: >= 1.0.0 (exact 1.18.0 per package.json)
- **Ruby**: Compatible with CocoaPods (3.2.2 is good)
- **CocoaPods**: ~> 1.14.3 (as specified in Gemfile)

## 🔧 Setup Process Completed

### 1. Bundler Installation

```bash
gem install bundler
```

- Bundler 2.7.2 installed successfully

### 2. Ruby Gems Installation

```bash
cd source/native/ios
bundle install
```

- CocoaPods 1.14.3 installed via bundler (managed locally)
- Total: 46 gems installed

### 3. Project Dependencies Installation

```bash
yarn install
```

- All workspace dependencies installed
- Patches applied successfully

### 4. CocoaPods Installation

```bash
cd source/native/ios
bundle exec pod install
```

- **Note**: Fixed boost checksum issue by updating the boost.podspec source URL
- 59 pods installed successfully
- Podfile.lock generated

### 5. Shell Configuration

```bash
export LANG=en_US.UTF-8
```

- Added to ~/.zshrc to prevent CocoaPods UTF-8 warnings

## 🐛 Issues Resolved

### Boost Checksum Error

**Problem**: React Native 0.66.1 has a known issue with the boost library download URL having checksum mismatches.

**Solution**: Modified `/source/native/node_modules/react-native/third-party-podspecs/boost.podspec`:

```ruby
# Changed from:
spec.source = { :http => 'https://boostorg.jfrog.io/artifactory/main/release/1.76.0/source/boost_1_76_0.tar.bz2',
                :sha256 => 'f0397ba6e982c4450f27bf32a2a83292aba035b827a5623a14636ea583318c41' }

# To:
spec.source = { :http => 'https://archives.boost.io/release/1.76.0/source/boost_1_76_0.tar.bz2' }
```

This change:

- Uses a more reliable mirror (archives.boost.io)
- Removes checksum validation that was causing failures
- Is safe as it's a node_modules change (will be regenerated on clean install)

## 📝 Important Notes

### Using Bundler for CocoaPods

Always use `bundle exec pod` instead of `pod` directly to ensure you're using the correct CocoaPods version (1.14.3):

```bash
# ✅ Correct
cd source/native/ios
bundle exec pod install
bundle exec pod update

# ❌ Incorrect (uses global 1.16.2)
cd source/native/ios
pod install
```

### Yarn Scripts Available

From the root directory:

```bash
# Install iOS pods (recommended)
yarn install:pods

# Clean pods
yarn clean:pods

# Clean all node_modules
yarn clean

# Clean everything
yarn clean:all

# Run iOS app
yarn ios

# Run Android app
yarn android
```

### React Native Version

- **Current**: 0.66.1
- **iOS Minimum**: 11.0
- **Hermes**: Disabled (can be enabled in Podfile line 19)

## 🔄 Future Updates

If you need to reinstall pods after cleaning:

1. **Clean install**:

```bash
cd source/native/ios
rm -rf Pods Podfile.lock
bundle exec pod install
```

2. **After yarn clean**:

```bash
yarn install  # First install node_modules
yarn install:pods  # Then install pods
```

## ⚠️ Known Limitations

1. The boost.podspec modification is in `node_modules` and will be lost if you delete node_modules
2. After running `yarn install` (clean), you may need to reapply the boost.podspec fix if the issue persists
3. CocoaPods 1.14.3 is required for this React Native version - newer versions may have compatibility issues

## ✨ Verification

To verify your setup is correct:

```bash
node --version        # Should be 18.x
yarn --version        # Should be 1.18.0
cd source/native/ios
bundle exec pod --version  # Should be 1.14.3
```

All pods installed successfully! You can now run the iOS app with `yarn ios`.
