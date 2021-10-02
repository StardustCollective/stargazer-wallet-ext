export interface IDAppInfo {
  origin: string;
  logo: string;
  title: string;
  accounts: {[assetType: string]: string[]};
}
export interface IDAppState {
  
  /**
   * Dapps that are currently listening for updates
   */
  listening: string[];

  /**
   * A list of sites that have been granted permissions to access a users
   * account information.
   */
   whitelist: {
    [dappId: string]: IDAppInfo;
  }

}
