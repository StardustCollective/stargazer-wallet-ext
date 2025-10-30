# Building with Android Studio - React Native 0.74

## ⚠️ Important: Do NOT Use "Rebuild Project"

React Native 0.74 uses an **included build** architecture that is **incompatible** with Android Studio's "Rebuild Project" button. Using it will cause a Gradle deadlock.

---

## ✅ How to Build in Android Studio

### Method 1: Use Gradle Panel (Recommended)

1. Open **View → Tool Windows → Gradle** (or click the Gradle elephant icon on the right)
2. In the Gradle panel, navigate to: **Stargazer → Tasks → build**
3. Double-click **`assemble`** to build the app
4. To clean first: Double-click **`clean`**, then **`assemble`**

### Method 2: Use Custom Build Task

We've created a safe build task specifically for Android Studio:

1. Open **View → Tool Windows → Gradle**
2. Navigate to: **Stargazer → Tasks → build**
3. Double-click **`ideBuild`**

This runs `clean` + `assembleDebug` without triggering the problematic test tasks.

### Method 3: Run from Command Line

```bash
cd source/native/android
./gradlew clean assembleDebug
```

Then use Android Studio's **Run** button to deploy the app (don't rebuild).

---

## 🏃 Running the App

After building with any of the methods above:

1. Click the **Run** button (green play icon) in Android Studio
2. Or press `Ctrl+R` (Mac: `Cmd+R`)

Android Studio will deploy the already-built APK to your device/emulator.

---

## 🔧 Why "Rebuild Project" Doesn't Work

When you click "Rebuild Project", Android Studio runs:

```bash
./gradlew clean build --all-projects
```

This attempts to build test classes in the `:gradle-plugin:react-native-gradle-plugin` included build, which creates a circular dependency causing Gradle to deadlock.

**This is a known limitation of React Native 0.74's new architecture, not a bug in your setup.**

---

## 💡 Quick Reference

| ❌ **Don't Use**                | ✅ **Use Instead**                     |
| ------------------------------- | -------------------------------------- |
| Build → Rebuild Project         | Gradle Panel → `assemble`              |
| Build → Clean Project → Rebuild | Gradle Panel → `clean` then `assemble` |
|                                 | Or use `ideBuild` task                 |

---

## 🐛 Troubleshooting

If you accidentally triggered "Rebuild Project" and got stuck:

1. **Stop the build** (red stop button or `Ctrl+F2`)
2. **Stop Gradle daemons**:
   ```bash
   cd source/native/android
   ./gradlew --stop
   ```
3. **Clean and rebuild**:
   ```bash
   ./gradlew clean assembleDebug
   ```
4. Use the **Run** button in Android Studio to deploy

---

## 📚 Related Documentation

- [React Native 0.74 Upgrade Guide](https://react-native-community.github.io/upgrade-helper/)
- [Gradle Included Builds](https://docs.gradle.org/current/userguide/composite_builds.html)

