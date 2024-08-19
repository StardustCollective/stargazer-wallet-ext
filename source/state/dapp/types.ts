export interface IDAppInfo {
  origin: string;
  logo: string;
  title: string;
}

export interface IDAppState {
  /**
   * A list of sites that have been granted permissions to access a user's
   * account information.
   */
  whitelist: {
    [dappId: string]: IDAppInfo;
  };
  current: IDAppInfo | null;
}
