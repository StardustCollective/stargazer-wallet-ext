export interface IUserState {
  elpaca: IElpacaState;
}

export interface IElpacaState {
  hidden: boolean;
  streak: IStreakState;
  claim: IClaimState;
}

export interface IClaimState {
  loading: boolean;
  data: ElPacaClaimData;
  error: any;
}

export interface IStreakState {
  loading: boolean;
  data: ElPacaStreakData;
  error: any;
}

export interface ElPacaClaimData {
  hash: string;
  address: string;
}

export interface ElPacaStreakData {
  totalEarned: number;
}

export interface ElPacaStreakResponse {
  success: boolean;
  response: any;
}
