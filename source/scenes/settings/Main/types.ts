import { FC } from 'react';

export default interface IMainSettings {
  handleLogout: () => void;
  onWalletLinkClick: () => void;
  onNetworkLinkClicked: () => void;
  onAboutLinkClicked: () => void;
  onContactsLinkClicked: () => void;
  onConnectedSitesClicked: () => void;
  version: number;
}

export type IRenderSettingsItemProps = {
  label: string;
  IconImageOrComponent: FC | string;
  onClick: () => void;
  imageStyles?: object | string;
}
