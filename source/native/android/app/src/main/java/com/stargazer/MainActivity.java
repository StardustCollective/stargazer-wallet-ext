package com.stargazer;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
  
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashScreenTheme, true);
    super.onCreate(null);
    ((MainApplication) getApplication()).addActivityToStack(this.getClass());
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
    ((MainApplication) getApplication()).removeActivityFromStack(this.getClass());
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Stargazer";
  }
}
