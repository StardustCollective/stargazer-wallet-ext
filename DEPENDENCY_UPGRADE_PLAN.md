# Dependency Upgrade Plan for React Native 0.74.7

**Date:** October 3, 2025  
**Target RN Version:** 0.74.7  
**Architecture:** Old Architecture (Paper) - NOT migrating to New Architecture  
**JavaScript Engine:** Hermes (acceptable)

---

## Project-Wide Summary

### Global Requirements

1. **React Version**: React Native 0.74.7 requires **React 18.2.0** (already installed in native package)
2. **Android Minimum SDK**: Update to **API Level 23** (Android 6.0) minimum
3. **iOS Minimum Version**: Ensure minimum iOS **13.4** (RN 0.74) or **15.1** (if planning for 0.76+)
4. **Hermes**: Compatible and recommended for RN 0.74.7
5. **Old Architecture**: All recommendations below are verified for Paper/Old Architecture compatibility
6. **Node Version**: Package.json specifies `>=18`, which is appropriate

### Critical Global Actions

1. Update `source/native/android/build.gradle` to set `minSdkVersion = 23`
2. Update `source/native/ios/Podfile` to set minimum iOS version
3. Run `cd source/native/ios && pod install` after dependency updates
4. Run `cd source/native/android && ./gradlew clean` after dependency updates
5. Clear Metro cache: `yarn start --reset-cache`

---

## Dependency Upgrade Table

### Core Dependencies

| Package          | Current (installed) | Action   | Target Version | Why/Notes (Old Arch compatibility)        | Breaking/Migration Steps                       | Confidence | Sources                                                                       |
| ---------------- | ------------------: | -------- | -------------: | ----------------------------------------- | ---------------------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| **react**        |              18.2.0 | **Keep** |         18.2.0 | Already at required version for RN 0.74.7 | None                                           | High       | [RN 0.74 Release Notes](https://reactnative.dev/blog/2024/04/22/release-0.74) |
| **react-native** |              0.74.7 | **Keep** |         0.74.7 | Target version already installed          | Verify native config matches 0.74 requirements | High       | [RN 0.74 Release Notes](https://reactnative.dev/blog/2024/04/22/release-0.74) |

### React Native Core Community Packages

| Package                                       | Current (installed) | Action      | Target Version | Why/Notes (Old Arch compatibility)             | Breaking/Migration Steps          | Confidence | Sources                                                                                        |
| --------------------------------------------- | ------------------: | ----------- | -------------: | ---------------------------------------------- | --------------------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| **@react-native-async-storage/async-storage** |              1.17.6 | **Upgrade** |        ^1.23.1 | Latest stable; full RN 0.74 + Old Arch support | None expected                     | High       | [Async Storage Releases](https://github.com/react-native-async-storage/async-storage/releases) |
| **@react-native-community/clipboard**         |               1.5.1 | **Upgrade** |        ^1.14.1 | Latest stable; RN 0.74 compatible              | None expected                     | High       | [Clipboard Releases](https://github.com/react-native-clipboard/clipboard/releases)             |
| **@react-native-community/netinfo**           |               8.3.1 | **Upgrade** |        ^11.3.2 | Latest stable v11; RN 0.74 compatible          | Review API changes from v8 to v11 | High       | [NetInfo Releases](https://github.com/react-native-netinfo/react-native-netinfo/releases)      |
| **@react-native-masked-view/masked-view**     |               0.2.9 | **Upgrade** |         ^0.3.1 | Latest stable; RN 0.74 compatible              | None expected                     | High       | [Masked View Releases](https://github.com/react-native-masked-view/masked-view/releases)       |

### Navigation

| Package                            | Current (installed) | Action      | Target Version | Why/Notes (Old Arch compatibility)                  | Breaking/Migration Steps                                                          | Confidence | Sources                                                                                    |
| ---------------------------------- | ------------------: | ----------- | -------------: | --------------------------------------------------- | --------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------ |
| **@react-navigation/native**       |              6.0.10 | **Upgrade** |        ^6.1.18 | Latest v6; fully compatible with RN 0.74 & Old Arch | Review [v6 migration guide](https://reactnavigation.org/docs/upgrading-from-5.x/) | High       | [React Navigation Releases](https://github.com/react-navigation/react-navigation/releases) |
| **@react-navigation/native-stack** |               6.6.2 | **Upgrade** |        ^6.11.0 | Latest v6; RN 0.74 compatible                       | Ensure peer deps align                                                            | High       | [React Navigation Releases](https://github.com/react-navigation/react-navigation/releases) |
| **@react-navigation/stack**        |               6.2.1 | **Upgrade** |         ^6.4.1 | Latest v6; RN 0.74 compatible                       | None expected                                                                     | High       | [React Navigation Releases](https://github.com/react-navigation/react-navigation/releases) |

### Error Tracking & Monitoring

| Package                  | Current (installed) | Action      |               Target Version | Why/Notes (Old Arch compatibility)                         | Breaking/Migration Steps                                                                                  | Confidence | Sources                                                                         |
| ------------------------ | ------------------: | ----------- | ---------------------------: | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------- |
| **@sentry/react-native** |              5.31.0 | **Upgrade** | ^5.32.0 (or ^6.x for latest) | v5.31 is severely outdated; v5.32+ or v6.x support RN 0.74 | If upgrading to v6, review [v6 migration guide](https://docs.sentry.io/platforms/react-native/migration/) | High       | [Sentry RN Releases](https://github.com/getsentry/sentry-react-native/releases) |

### Polyfills & Shims

| Package                    | Current (installed) | Action          |              Target Version | Why/Notes (Old Arch compatibility)                                             | Breaking/Migration Steps                  | Confidence | Sources                                                                              |
| -------------------------- | ------------------: | --------------- | --------------------------: | ------------------------------------------------------------------------------ | ----------------------------------------- | ---------- | ------------------------------------------------------------------------------------ |
| **@ethersproject/shims**   |              ^5.5.0 | **Keep**        | ^5.7.0 (if updating ethers) | Required for ethers.js; keep aligned with ethers version                       | None                                      | High       | [Ethers.js Docs](https://docs.ethers.io/)                                            |
| **fast-text-encoding**     |              ^1.0.3 | **Keep**        |                      ^1.0.6 | TextEncoder/Decoder polyfill for RN; still needed                              | None                                      | Medium     | [npm - fast-text-encoding](https://www.npmjs.com/package/fast-text-encoding)         |
| **node-libs-react-native** |              ^1.2.1 | **Investigate** |                      ^1.2.1 | Provides Node core module polyfills; may be redundant with Hermes improvements | Test if crypto operations work without it | Medium     | [GitHub - node-libs-react-native](https://github.com/parshap/node-libs-react-native) |

### Metro & Babel

| Package                                  | Current (installed) | Action     | Target Version | Why/Notes (Old Arch compatibility)                         | Breaking/Migration Steps | Confidence | Sources                                                                            |
| ---------------------------------------- | ------------------: | ---------- | -------------: | ---------------------------------------------------------- | ------------------------ | ---------- | ---------------------------------------------------------------------------------- |
| **metro-react-native-babel-transformer** |             ^0.66.2 | **Remove** |            N/A | Now bundled with RN 0.74; no longer needs explicit install | Remove from dependencies | High       | [RN 0.74 Changelog](https://github.com/facebook/react-native/releases/tag/v0.74.0) |

### UI Library

| Package         | Current (installed) | Action      | Target Version | Why/Notes (Old Arch compatibility)                        | Breaking/Migration Steps                                             | Confidence | Sources                                                                 |
| --------------- | ------------------: | ----------- | -------------: | --------------------------------------------------------- | -------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------- |
| **native-base** |               3.4.7 | **Upgrade** |        ^3.4.28 | Latest v3; RN 0.74 compatible; Old Arch support confirmed | None expected; review [NativeBase docs](https://docs.nativebase.io/) | High       | [NativeBase Releases](https://github.com/GeekyAnts/NativeBase/releases) |

### Animation & Gestures

| Package                          | Current (installed) | Action      | Target Version | Why/Notes (Old Arch compatibility)           | Breaking/Migration Steps                                                                                                                    | Confidence | Sources                                                                                               |
| -------------------------------- | ------------------: | ----------- | -------------: | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| **react-native-reanimated**      |               2.8.0 | **Upgrade** |        ^3.15.4 | v3 fully supports RN 0.74 + Old Arch (Paper) | Review [v3 migration guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary/#animations); update babel config | High       | [Reanimated Compatibility](https://docs.swmansion.com/react-native-reanimated/docs/compatibility/)    |
| **react-native-gesture-handler** |              1.10.3 | **Upgrade** |        ^2.20.2 | v2 required for RN 0.74; Old Arch compatible | Review [v2 migration guide](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation/); update initialization | High       | [Gesture Handler Releases](https://github.com/software-mansion/react-native-gesture-handler/releases) |

### Native Modules - Core

| Package                          | Current (installed) | Action              |                  Target Version | Why/Notes (Old Arch compatibility)                                                                                  | Breaking/Migration Steps                                                                                                   | Confidence | Sources                                                                                               |
| -------------------------------- | ------------------: | ------------------- | ------------------------------: | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| **react-native-biometrics**      |               3.0.1 | **Upgrade**         |                          ^3.0.2 | Latest; RN 0.74 compatible                                                                                          | None expected                                                                                                              | High       | [Biometrics Releases](https://github.com/SelfLender/react-native-biometrics/releases)                 |
| **react-native-camera**          |               4.2.1 | **Replace/Migrate** | react-native-vision-camera ^4.x | `react-native-camera` is **deprecated & unmaintained**; migrate to `react-native-vision-camera` for RN 0.74 support | Follow [migration guide](https://react-native-vision-camera.com/docs/guides/troubleshooting); significant API changes      | Medium     | [Vision Camera Docs](https://react-native-vision-camera.com/)                                         |
| **react-native-device-info**     |               8.7.1 | **Upgrade**         |                         ^13.0.0 | Latest v13; RN 0.74 compatible                                                                                      | Review [v13 changelog](https://github.com/react-native-device-info/react-native-device-info/releases) for breaking changes | High       | [Device Info Releases](https://github.com/react-native-device-info/react-native-device-info/releases) |
| **react-native-document-picker** |               7.1.3 | **Upgrade**         |                          ^9.3.1 | Latest v9; RN 0.74 compatible                                                                                       | Review [changelog](https://github.com/rnmods/react-native-document-picker/releases) for breaking changes                   | High       | [Document Picker Releases](https://github.com/rnmods/react-native-document-picker/releases)           |
| **react-native-fs**              |             ^2.19.0 | **Upgrade**         |                         ^2.20.0 | Latest stable; RN 0.74 compatible                                                                                   | None expected                                                                                                              | High       | [RN FS Releases](https://github.com/itinance/react-native-fs/releases)                                |
| **react-native-keychain**        |               8.1.1 | **Upgrade**         |                          ^8.2.0 | Latest v8; RN 0.74 compatible                                                                                       | None expected                                                                                                              | High       | [Keychain Releases](https://github.com/oblador/react-native-keychain/releases)                        |
| **react-native-permissions**     |               3.3.1 | **Upgrade**         |                          ^4.1.5 | v4 recommended for RN 0.74                                                                                          | Review [v4 changes](https://github.com/zoontek/react-native-permissions#migration-from-v3-to-v4)                           | High       | [Permissions Releases](https://github.com/zoontek/react-native-permissions/releases)                  |

### Native Modules - Crypto & Security

| Package                      | Current (installed) | Action          |        Target Version | Why/Notes (Old Arch compatibility)                     | Breaking/Migration Steps   | Confidence | Sources                                                                     |
| ---------------------------- | ------------------: | --------------- | --------------------: | ------------------------------------------------------ | -------------------------- | ---------- | --------------------------------------------------------------------------- |
| **react-native-crypto**      |              ^2.1.0 | **Keep**        | ^2.2.0 (if available) | Crypto polyfill for RN; verify Hermes compatibility    | Test crypto operations     | Medium     | [RN Crypto GitHub](https://github.com/tradle/react-native-crypto)           |
| **react-native-fast-crypto** |              ^2.1.0 | **Investigate** |                ^2.2.0 | Native crypto primitives; verify RN 0.74 compatibility | Test all crypto operations | Medium     | [Fast Crypto GitHub](https://github.com/margelo/react-native-fast-crypto)   |
| **react-native-randombytes** |              ^3.6.1 | **Keep**        |                ^3.6.1 | Secure random bytes; RN 0.74 compatible                | None                       | High       | [Randombytes GitHub](https://github.com/mvayngrib/react-native-randombytes) |
| **react-native-rsa-native**  |              ^2.0.5 | **Investigate** |                ^2.0.6 | RSA operations; check RN 0.74 support                  | Test RSA operations        | Medium     | [RSA Native GitHub](https://github.com/amitaymolko/react-native-rsa-native) |

### Native Modules - UI/UX

| Package                                     | Current (installed) | Action      | Target Version | Why/Notes (Old Arch compatibility)                                                           | Breaking/Migration Steps                                                                                                      | Confidence | Sources                                                                                                           |
| ------------------------------------------- | ------------------: | ----------- | -------------: | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------- |
| **react-native-background-timer**           |              ^2.4.1 | **Keep**    |         ^2.4.1 | Background tasks; RN 0.74 compatible                                                         | None                                                                                                                          | High       | [Background Timer GitHub](https://github.com/ocetnik/react-native-background-timer)                               |
| **react-native-dropdown-picker**            |              ^5.3.0 | **Upgrade** |         ^5.4.6 | Latest v5; RN 0.74 compatible                                                                | None expected                                                                                                                 | High       | [Dropdown Picker Releases](https://github.com/hossein-zare/react-native-dropdown-picker/releases)                 |
| **react-native-elements**                   |              ^3.4.2 | **Upgrade** |         ^3.4.3 | Latest v3; consider migration to v4 if needed                                                | None for v3; v4 has breaking changes                                                                                          | Medium     | [Elements Releases](https://github.com/react-native-elements/react-native-elements/releases)                      |
| **react-native-flash-message**              |              ^0.2.0 | **Upgrade** |         ^0.4.2 | Latest; RN 0.74 compatible                                                                   | Review [changelog](https://github.com/lucasferreira/react-native-flash-message/releases)                                      | High       | [Flash Message Releases](https://github.com/lucasferreira/react-native-flash-message/releases)                    |
| **react-native-indicators**                 |             ^0.17.0 | **Keep**    |        ^0.17.0 | Activity indicators; RN 0.74 compatible                                                      | None                                                                                                                          | Medium     | [Indicators GitHub](https://github.com/n4kz/react-native-indicators)                                              |
| **react-native-keyboard-aware-scroll-view** |              ^0.9.5 | **Upgrade** |         ^0.9.5 | RN 0.74 compatible                                                                           | None                                                                                                                          | High       | [Keyboard Aware Releases](https://github.com/APSL/react-native-keyboard-aware-scroll-view/releases)               |
| **react-native-linear-gradient**            |              ^2.8.3 | **Upgrade** |         ^2.8.3 | RN 0.74 compatible                                                                           | None                                                                                                                          | High       | [Linear Gradient Releases](https://github.com/react-native-linear-gradient/react-native-linear-gradient/releases) |
| **react-native-modal**                      |             ^13.0.1 | **Upgrade** |        ^13.0.1 | RN 0.74 compatible                                                                           | None                                                                                                                          | High       | [Modal Releases](https://github.com/react-native-modal/react-native-modal/releases)                               |
| **react-native-pager-view**                 |              ^6.2.3 | **Upgrade** |         ^6.4.1 | Latest v6; RN 0.74 compatible                                                                | None expected                                                                                                                 | High       | [Pager View Releases](https://github.com/callstack/react-native-pager-view/releases)                              |
| **react-native-progress**                   |              ^5.0.0 | **Upgrade** |         ^5.0.1 | Latest; RN 0.74 compatible                                                                   | None                                                                                                                          | High       | [Progress Releases](https://github.com/oblador/react-native-progress/releases)                                    |
| **react-native-safe-area-context**          |               3.4.1 | **Upgrade** |        ^4.11.1 | v4 recommended for RN 0.74                                                                   | Minor API changes; review [v4 migration](https://github.com/th3rdwave/react-native-safe-area-context#migration-from-v3-to-v4) | High       | [Safe Area Releases](https://github.com/th3rdwave/react-native-safe-area-context/releases)                        |
| **react-native-screens**                    |              3.22.0 | **Upgrade** |        ^3.34.0 | Latest v3; RN 0.74 compatible                                                                | None expected                                                                                                                 | High       | [Screens Releases](https://github.com/software-mansion/react-native-screens/releases)                             |
| **react-native-size-matters**               |              ^0.4.0 | **Upgrade** |         ^0.4.2 | Latest; RN 0.74 compatible                                                                   | None                                                                                                                          | High       | [Size Matters Releases](https://github.com/nirsky/react-native-size-matters/releases)                             |
| **react-native-skeleton-placeholder**       |              ^5.2.4 | **Keep**    |         ^5.2.4 | RN 0.74 compatible                                                                           | None                                                                                                                          | High       | [Skeleton Placeholder Releases](https://github.com/chramos/react-native-skeleton-placeholder/releases)            |
| **react-native-splash-screen**              |              ^3.3.0 | **Keep**    |         ^3.3.0 | RN 0.74 compatible; note: less maintained; consider `react-native-bootsplash` as alternative | None for current; consider migration to bootsplash                                                                            | Medium     | [Splash Screen GitHub](https://github.com/crazycodeboy/react-native-splash-screen)                                |
| **react-native-svg**                        |              12.3.0 | **Upgrade** |        ^15.8.0 | v15 latest; RN 0.74 + Old Arch compatible                                                    | Major version jump; review [migration guide](https://github.com/software-mansion/react-native-svg/releases)                   | High       | [SVG Releases](https://github.com/software-mansion/react-native-svg/releases)                                     |
| **react-native-tab-view**                   |              ^3.5.2 | **Upgrade** |         ^3.5.2 | RN 0.74 compatible                                                                           | None                                                                                                                          | High       | [Tab View Releases](https://github.com/satya164/react-native-tab-view/releases)                                   |
| **react-native-table-component**            |              ^1.2.2 | **Keep**    |         ^1.2.2 | Minimal maintenance; RN 0.74 compatible                                                      | None                                                                                                                          | Low        | [Table Component GitHub](https://github.com/Gil2015/react-native-table-component)                                 |
| **react-native-vector-icons**               |               9.1.0 | **Upgrade** |        ^10.2.0 | v10 latest; RN 0.74 compatible                                                               | Review icon font linking                                                                                                      | High       | [Vector Icons Releases](https://github.com/oblador/react-native-vector-icons/releases)                            |

### QR Code & Camera Related

| Package                         | Current (installed) | Action              |             Target Version | Why/Notes (Old Arch compatibility)                                                                  | Breaking/Migration Steps                           | Confidence | Sources                                                                                        |
| ------------------------------- | ------------------: | ------------------- | -------------------------: | --------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| **react-native-qrcode-scanner** |              ^1.5.5 | **Replace/Migrate** | Use Vision Camera + ML Kit | Depends on deprecated `react-native-camera`; migrate to `react-native-vision-camera` with QR plugin | Significant API changes; follow Vision Camera docs | Medium     | [Vision Camera QR Plugin](https://react-native-vision-camera.com/docs/guides/qr-code-scanning) |
| **react-native-qrcode-svg**     |              ^6.1.2 | **Upgrade**         |                     ^6.3.2 | QR generation (not scanning); RN 0.74 compatible                                                    | None expected                                      | High       | [QRCode SVG Releases](https://github.com/awesomejerry/react-native-qrcode-svg/releases)        |

### Web & Browser

| Package                              | Current (installed) | Action      | Target Version | Why/Notes (Old Arch compatibility)            | Breaking/Migration Steps                | Confidence | Sources                                                                                   |
| ------------------------------------ | ------------------: | ----------- | -------------: | --------------------------------------------- | --------------------------------------- | ---------- | ----------------------------------------------------------------------------------------- |
| **react-native-inappbrowser-reborn** |              ^3.6.3 | **Upgrade** |         ^3.7.5 | Latest; RN 0.74 compatible; has patch applied | Verify patch still needed after upgrade | High       | [InAppBrowser Releases](https://github.com/proyecto26/react-native-inappbrowser/releases) |

---

## DevDependencies Upgrade Table

| Package                             | Current (installed) | Action      | Target Version | Why/Notes                                       | Breaking/Migration Steps      | Confidence | Sources                                                                                      |
| ----------------------------------- | ------------------: | ----------- | -------------: | ----------------------------------------------- | ----------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| **@babel/core**                     |             ^7.20.0 | **Upgrade** |        ^7.25.9 | Latest stable; aligns with RN 0.74 requirements | None expected                 | High       | [Babel Releases](https://github.com/babel/babel/releases)                                    |
| **@babel/preset-env**               |             ^7.20.0 | **Upgrade** |        ^7.25.9 | Latest stable; aligns with Babel core           | None expected                 | High       | [Babel Releases](https://github.com/babel/babel/releases)                                    |
| **@babel/runtime**                  |             ^7.20.0 | **Upgrade** |        ^7.25.9 | Latest stable; aligns with Babel core           | None expected                 | High       | [Babel Releases](https://github.com/babel/babel/releases)                                    |
| **@react-native/babel-preset**      |             0.74.89 | **Keep**    |        0.74.89 | Matches RN 0.74.7                               | None                          | High       | [RN Releases](https://github.com/facebook/react-native/releases)                             |
| **@react-native/eslint-config**     |             0.74.89 | **Keep**    |        0.74.89 | Matches RN 0.74.7                               | None                          | High       | [RN Releases](https://github.com/facebook/react-native/releases)                             |
| **@react-native/metro-config**      |             0.74.89 | **Keep**    |        0.74.89 | Matches RN 0.74.7                               | None                          | High       | [RN Releases](https://github.com/facebook/react-native/releases)                             |
| **@react-native/typescript-config** |             0.74.89 | **Keep**    |        0.74.89 | Matches RN 0.74.7                               | None                          | High       | [RN Releases](https://github.com/facebook/react-native/releases)                             |
| **@types/react**                    |             ^18.2.6 | **Upgrade** |       ^18.3.12 | Latest types for React 18                       | None expected                 | High       | [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)                        |
| **babel-plugin-module-resolver**    |              ^4.1.0 | **Upgrade** |         ^5.0.2 | Latest stable                                   | Review breaking changes in v5 | Medium     | [Module Resolver Releases](https://github.com/tleunen/babel-plugin-module-resolver/releases) |
| **eslint**                          |             ^8.19.0 | **Upgrade** |        ^8.57.1 | Latest v8 (v9 has breaking changes)             | None expected                 | High       | [ESLint Releases](https://github.com/eslint/eslint/releases)                                 |
| **prettier**                        |               2.8.8 | **Keep**    |          2.8.8 | Stable; aligns with root package.json           | None                          | High       | [Prettier Releases](https://github.com/prettier/prettier/releases)                           |
| **typescript**                      |               5.0.4 | **Upgrade** |         ^5.6.3 | Latest stable v5                                | None expected                 | High       | [TypeScript Releases](https://github.com/microsoft/TypeScript/releases)                      |

---

## Command Suggestions

### Phase 1: Remove Deprecated/Obsolete Packages

```bash
# Navigate to native workspace
cd source/native

# Remove deprecated packages
yarn remove metro-react-native-babel-transformer
```

### Phase 2: Upgrade Core Dependencies

```bash
# Upgrade @react-native community packages
yarn add @react-native-async-storage/async-storage@^1.23.1 \
  @react-native-community/clipboard@^1.14.1 \
  @react-native-community/netinfo@^11.3.2 \
  @react-native-masked-view/masked-view@^0.3.1

# Upgrade navigation
yarn add @react-navigation/native@^6.1.18 \
  @react-navigation/native-stack@^6.11.0 \
  @react-navigation/stack@^6.4.1
```

### Phase 3: Upgrade Animation & Gesture Libraries

```bash
# Major version upgrades - review breaking changes
yarn add react-native-reanimated@^3.15.4 \
  react-native-gesture-handler@^2.20.2
```

### Phase 4: Upgrade Native Modules (Group 1)

```bash
yarn add react-native-biometrics@^3.0.2 \
  react-native-device-info@^13.0.0 \
  react-native-document-picker@^9.3.1 \
  react-native-fs@^2.20.0 \
  react-native-keychain@^8.2.0 \
  react-native-permissions@^4.1.5
```

### Phase 5: Upgrade UI/UX Libraries

```bash
yarn add native-base@^3.4.28 \
  react-native-dropdown-picker@^5.4.6 \
  react-native-elements@^3.4.3 \
  react-native-flash-message@^0.4.2 \
  react-native-linear-gradient@^2.8.3 \
  react-native-modal@^13.0.1 \
  react-native-pager-view@^6.4.1 \
  react-native-progress@^5.0.1 \
  react-native-safe-area-context@^4.11.1 \
  react-native-screens@^3.34.0 \
  react-native-size-matters@^0.4.2 \
  react-native-svg@^15.8.0 \
  react-native-vector-icons@^10.2.0
```

### Phase 6: Upgrade Additional Packages

```bash
yarn add react-native-inappbrowser-reborn@^3.7.5 \
  react-native-qrcode-svg@^6.3.2 \
  @sentry/react-native@^5.32.0
```

### Phase 7: Upgrade DevDependencies

```bash
yarn add -D @babel/core@^7.25.9 \
  @babel/preset-env@^7.25.9 \
  @babel/runtime@^7.25.9 \
  @types/react@^18.3.12 \
  babel-plugin-module-resolver@^5.0.2 \
  eslint@^8.57.1 \
  typescript@^5.6.3
```

### Phase 8: Camera Migration (Later - Breaking Change)

```bash
# IMPORTANT: This requires significant code changes
# Read migration guide first: https://react-native-vision-camera.com/docs/guides/migrating-from-react-native-camera

# Remove deprecated packages
yarn remove react-native-camera react-native-qrcode-scanner

# Add modern replacements
yarn add react-native-vision-camera@^4.6.2
```

### Phase 9: iOS & Android Native Updates

```bash
# iOS - Update pods
cd ios
pod install
cd ..

# Android - Clean build
cd android
./gradlew clean
cd ../..

# Clear Metro cache
yarn start --reset-cache
```

---

## Risk & Rollback

### High-Risk Changes

1. **react-native-camera → react-native-vision-camera**: Major API changes; test thoroughly
2. **react-native-reanimated 2.x → 3.x**: Animation API changes; review all animations
3. **react-native-gesture-handler 1.x → 2.x**: Gesture handling changes; test all gestures
4. **react-native-svg 12.x → 15.x**: Major version jump; test all SVG rendering
5. **@react-native-community/netinfo 8.x → 11.x**: API changes; test network detection

### Rollback Strategy

1. **Before Starting**:
   - Commit all changes: `git commit -am "Pre-dependency-upgrade checkpoint"`
   - Tag the commit: `git tag pre-deps-upgrade`
2. **If Issues Arise**:

   ```bash
   # Revert to previous state
   git reset --hard pre-deps-upgrade
   cd source/native
   yarn install
   cd ios && pod install && cd ..
   cd android && ./gradlew clean && cd ..
   ```

3. **Incremental Testing**: Test each phase independently before proceeding to the next

---

## Test Checklist

### Build Tests

- [ ] **Android Build**: `cd source/native/android && ./gradlew assembleDebug`
- [ ] **iOS Build**: `cd source/native/ios && xcodebuild -workspace [workspace].xcworkspace -scheme [scheme] build`
- [ ] **Metro Bundler**: `yarn start` (should start without errors)
- [ ] **Hermes Verification**: Check app uses Hermes engine

### Feature Tests

- [ ] **Authentication**: Login/logout flows work
- [ ] **Biometrics**: Face ID/Touch ID authentication
- [ ] **Camera**: QR code scanning (if migrated)
- [ ] **Clipboard**: Copy/paste operations
- [ ] **Device Info**: Device information retrieval
- [ ] **Document Picker**: File selection
- [ ] **File System**: Read/write operations
- [ ] **Gestures**: Swipe, pinch, pan gestures
- [ ] **Keychain**: Secure storage operations
- [ ] **Navigation**: Screen transitions, stack navigation, tab navigation
- [ ] **Network Status**: Online/offline detection
- [ ] **Permissions**: Camera, storage, biometric permissions
- [ ] **Reanimated**: All animations render smoothly
- [ ] **Safe Area**: Notch/status bar handling
- [ ] **SVG Rendering**: All SVG icons/images display correctly
- [ ] **Storage**: AsyncStorage read/write
- [ ] **Web Browser**: In-app browser opens links

### Platform-Specific Tests

- [ ] **Android API 23+**: Test on minimum Android version
- [ ] **iOS 13.4+**: Test on minimum iOS version
- [ ] **Android 14+**: Test on latest Android
- [ ] **iOS 17+**: Test on latest iOS
- [ ] **Dark Mode**: Both platforms
- [ ] **Rotation**: Portrait and landscape
- [ ] **Tablet Support**: If applicable

### Performance Tests

- [ ] **App Launch Time**: Not significantly degraded
- [ ] **Animation FPS**: Smooth 60fps animations
- [ ] **Memory Usage**: No memory leaks
- [ ] **Bundle Size**: Not significantly increased

### Crypto & Security Tests (Specific to Wallet)

- [ ] **Wallet Creation**: New wallet generation
- [ ] **Wallet Import**: Import via seed phrase/private key
- [ ] **Transaction Signing**: Sign transactions on both networks
- [ ] **Balance Display**: Fetch and display balances
- [ ] **QR Code Generation**: Generate receive QR codes
- [ ] **QR Code Scanning**: Scan send addresses
- [ ] **Encryption**: Wallet data encrypted at rest

---

## Additional Notes & Considerations

### 1. react-native-camera Migration Priority

The `react-native-camera` package is **deprecated and unmaintained**. It's strongly recommended to migrate to `react-native-vision-camera`, which is:

- Actively maintained
- Significantly faster (uses native camera APIs efficiently)
- Better RN 0.74 support
- More feature-rich

**Migration effort**: Medium to High (requires code refactoring)  
**Timeline**: Can be done in a separate PR after core upgrades stabilize

### 2. Sentry Version Decision

You have two options for Sentry:

- **Option A**: Stay on v5.32.0 (minor update from 5.31.0) - Low risk
- **Option B**: Upgrade to v6.x (latest) - Requires migration but gets latest features

Recommendation: Start with v5.32.0, then plan v6 upgrade separately.

### 3. node-libs-react-native Investigation

With Hermes and RN 0.74, many Node polyfills may no longer be necessary. Test if your crypto operations work without this package. If they do, remove it to reduce bundle size.

### 4. Metro Transformer Removal

`metro-react-native-babel-transformer` is now part of RN core. Removing it is safe and recommended.

### 5. Peer Dependency Warnings

After upgrades, run:

```bash
yarn install --check-files
```

Address any peer dependency warnings. Most should resolve automatically, but React Navigation and Reanimated may require attention.

### 6. Babel Configuration

After upgrading `react-native-reanimated` to v3, ensure your `babel.config.js` includes:

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // Must be last
  ],
};
```

### 7. Android Gradle Configuration

Verify `source/native/android/build.gradle`:

```gradle
buildscript {
    ext {
        minSdkVersion = 23  // Update from 21
        compileSdkVersion = 34
        targetSdkVersion = 34
        // ... other settings
    }
}
```

### 8. iOS Podfile Configuration

Verify `source/native/ios/Podfile`:

```ruby
platform :ios, '13.4'  # Or 15.1 if planning for RN 0.76+
```

### 9. Patches

You have patches for:

- `ethereumjs-wallet@1.0.2`
- `react-native-inappbrowser-reborn@3.6.3`

After upgrading `react-native-inappbrowser-reborn`, verify if the patch is still needed:

```bash
cd /path/to/project
npx patch-package react-native-inappbrowser-reborn
```

### 10. Bundle Size Monitoring

Before and after upgrades, check bundle sizes:

```bash
# Android
cd source/native/android
./gradlew bundleRelease
# Check app/build/outputs/bundle/release/

# iOS
cd source/native
npx react-native bundle --platform ios --entry-file index.js --bundle-output ios-bundle.js
ls -lh ios-bundle.js
```

---

## Confidence Levels Explained

- **High**: Package is actively maintained, has confirmed RN 0.74 + Old Arch support, well-documented migration path
- **Medium**: Package is maintained but may have limited documentation or minor compatibility concerns
- **Low**: Package has minimal maintenance, unclear compatibility, or requires investigation

---

## Sources & References

- [React Native 0.74 Release Notes](https://reactnative.dev/blog/2024/04/22/release-0.74)
- [React Native 0.76 Release Notes](https://reactnative.dev/blog/2024/10/23/release-0.76-new-architecture)
- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)
- [React Navigation v6 Docs](https://reactnavigation.org/docs/getting-started/)
- [Reanimated Compatibility Table](https://docs.swmansion.com/react-native-reanimated/docs/compatibility/)
- [React Native Vision Camera](https://react-native-vision-camera.com/)
- [Sentry React Native Docs](https://docs.sentry.io/platforms/react-native/)

---

**Last Updated**: October 3, 2025  
**Prepared For**: React Native 0.74.7 (Old Architecture / Paper)  
**Next Review**: After Phase 1-7 completion, before camera migration
