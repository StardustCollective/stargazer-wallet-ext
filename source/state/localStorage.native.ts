import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveState = async (appState: any) => {
  console.log('save state', appState);

  try {
    const serializedState = JSON.stringify(appState);
    AsyncStorage.setItem('state', serializedState);
  } catch (e) {
    console.error('<!> Error saving state', e);
  }
};

export const loadState = async () => {
  console.log('loadState....');
  try {
    const serializedState = await AsyncStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('<!> Error getting state', e);
    return null;
  }
};
