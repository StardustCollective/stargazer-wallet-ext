export interface IAuthState {
  unlocked: boolean;
  loading: boolean;
  external: ExternalData;
}

export interface ExternalData {
  token: string;
  exp: number;
}
