export type IConnectedSitesContainerProps = {
  onChange: (id: string) => void;
  navigation: any;
};

export default interface IConnectedSitesSettings {
  onDeleteSiteClicked: (siteId: string) => void;
  connectedSites: object;
}
