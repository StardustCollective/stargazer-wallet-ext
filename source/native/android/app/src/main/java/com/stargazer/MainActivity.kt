package com.stargazer;

import android.os.Build
import android.os.Bundle;
import android.view.WindowManager
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Stargazer"

  override fun onCreate(savedInstanceState: Bundle?) {
      SplashScreen.show(this)
      super.onCreate(null)
      // Keep wallet content out of the recents thumbnail, which Android also shows as the
      // first frame on resume, before JS can render the login screen after an auto lock.
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
          setRecentsScreenshotEnabled(false)
      }
  }

  // Before API 33 the snapshot can only be blanked by marking the window secure while paused.
  // Only clear the flag on resume if it was set here, so a secure screen keeps its protection.
  private var securedOnPause = false

  override fun onPause() {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
          val alreadySecure = (window.attributes.flags and WindowManager.LayoutParams.FLAG_SECURE) != 0
          if (!alreadySecure) {
              window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
              securedOnPause = true
          }
      }
      super.onPause()
  }

  override fun onResume() {
      super.onResume()
      if (securedOnPause) {
          window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
          securedOnPause = false
      }
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
