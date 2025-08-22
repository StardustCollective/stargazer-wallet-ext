export default interface IMainSettings {
  handleLogout: () => void;
  onWalletLinkClick: () => void;
  onNetworkLinkClicked: () => void;
  onAboutLinkClicked: () => void;
  onContactsLinkClicked: () => void;
  onConnectedSitesClicked: () => void;
  onSecurityLinkClicked: () => void;
  version: string | number;
}