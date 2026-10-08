package com.stargazer

import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil

/**
 * Toggles FLAG_SECURE on the current window, which blocks screenshots, screen recording
 * and the recent apps thumbnail. Used by screens that show seed phrases or private keys.
 */
class SecureScreenModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "SecureScreen"

  @ReactMethod
  fun enable() {
    setSecure(true)
  }

  @ReactMethod
  fun disable() {
    setSecure(false)
  }

  private fun setSecure(secure: Boolean) {
    UiThreadUtil.runOnUiThread {
      val window = currentActivity?.window ?: return@runOnUiThread
      if (secure) {
        window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
      } else {
        window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
      }
    }
  }
}
