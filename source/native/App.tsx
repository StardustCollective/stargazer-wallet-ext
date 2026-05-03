import 'react-native-gesture-handler';
import React, {useEffect, useRef} from 'react';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import {Linking, StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {NativeBaseProvider} from 'native-base';
import RootStack from 'navigation/stacks/Root';
import linking from 'navigation/linking';
import Store from 'state/store';
import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {ToastProvider} from '../context/ToastContext';
import { color } from 'assets/styles/tokens';
import screens from 'navigation/screens';
import {parseDeepLink} from 'utils/deepLinkParser';

const App = () => {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    Linking.addEventListener('url', () => {
      InAppBrowser.close();
    });

    const handleDeepLink = (event: {url: string}) => {
      const {url} = event;
      if (!url.startsWith('stargazer://')) return;

      const parsed = parseDeepLink(url);
      if (!parsed) return;

      const {route, ...params} = parsed;

      let screenName: string;
      switch (route) {
        case 'connect':
          screenName = screens.deeplink.connect;
          break;
        default:
          return;
      }

      navigationRef.current?.navigate({
        name: screenName,
        params,
        key: `${route}-${params.requestId}`,
      } as never);
    };

    // For warm start deep links.
    Linking.addEventListener('url', handleDeepLink);

    // For cold start deep links.
    Linking.getInitialURL().then((url) => {
      if (url?.startsWith('stargazer://')) {
        setTimeout(() => handleDeepLink({url}), 1500);
      }
    });

    // This timeout is used to avoid a blank screen between the splash screen end and the app start.
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <NativeBaseProvider>
          <Provider store={Store}>
            <NavigationContainer linking={linking} ref={navigationRef}>
                <StatusBar
                  translucent
                  barStyle="light-content"
                  backgroundColor={color.brand_900}
                />
                <RootStack />
            </NavigationContainer>
          </Provider>
        </NativeBaseProvider>
        <FlashMessage position="top" />
      </ToastProvider>
    </SafeAreaProvider>
  );
};

export default App;
