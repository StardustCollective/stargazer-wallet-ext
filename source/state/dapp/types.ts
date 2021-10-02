export interface IDAppInfo {
  origin: string;
  logo: string;
  title: string;
}
export interface IDAppState {
  /**
   * Dapps that are currently listening for updates
   */
  listening: string[];

  /**
   * Sites that have bee granted permissions
   */
  sites: {
    [dappId: string]: IDAppInfo; // array of connected account ids
  }

}
