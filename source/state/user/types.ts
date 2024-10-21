export interface IUserState {
  elpaca: IElpacaState;
}

export interface IElpacaState {
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
  currentStreak: number;
  totalEarned: number;
  claimAmount: number;
  lastClaimEpochProgress: number;
  currentEpochProgress: number;
  nextToken: string;
  currentClaimWindow?: string;
  claimEnabled?: boolean;
  showError?: boolean;
}

export interface ClaimElpacaData {
  address: string;
  token: string;
  signature: string;
}

export interface ClaimElpacaBody {
  value: {
    StreakUpdate: {
      address: string;
      token: string;
    };
  };
  proofs: [
    {
      id: string;
      signature: string;
    }
  ];
}
