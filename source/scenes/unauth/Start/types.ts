import { NavigationProp } from 'navigation/types';

export default interface IStart {
  navigation: NavigationProp;
  onImportClicked: () => void;
  onGetStartedClicked: () => void;
}
