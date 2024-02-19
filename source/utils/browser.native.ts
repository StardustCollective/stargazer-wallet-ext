import { Linking } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

export const open = async (url: string) => {
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: 'done',
        preferredBarTintColor: '#FFFFFF',
        preferredControlTintColor: '#4676ee',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'automatic',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: true,
        // Android Properties
        showTitle: false,
        toolbarColor: '#FFFFFF',
        secondaryToolbarColor: 'black',
        navigationBarColor: 'black',
        navigationBarDividerColor: 'white',
        enableUrlBarHiding: true,
        enableDefaultShare: false,
        forceCloseOnRedirection: false,
        showInRecents: true,
        // Specify full animation resource identifier(package:anim/name)
        // or only resource name(in case of animation bundled with app).
        animations: {
          startEnter: 'slide_in_bottom',
          startExit: 'slide_out_top',
          endEnter: 'slide_in_top',
          endExit: 'slide_out_bottom',
        },
      });
    } else Linking.openURL(url);
  } catch (error) {
    console.log(error);
  }
};

export const reload = () => {
  // We don't need to reload for React Native
};
