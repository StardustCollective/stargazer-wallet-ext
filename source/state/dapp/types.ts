export interface IDAppInfo {
  origin: string;
  logo: string;
  title: string;
}

export interface IDAppState {
  [dappId: string]: IDAppInfo; // array of connected account ids
}
