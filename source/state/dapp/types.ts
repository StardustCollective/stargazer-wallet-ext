export interface IDAppInfo {
  origin: string;
  logo?: string;
}

export interface IDAppState {
  /**
   * A list of sites that have been granted permissions to access a user's
   * account information, keyed by origin.
   */
  whitelist: {
    [dappId: string]: IDAppInfo & { id: string };
  };
}
