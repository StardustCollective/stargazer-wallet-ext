export default interface ICardClaim {
  currentStreak: number;
  totalEarned: number;
  amount: number;
  currentClaimWindow: string;
  loading: boolean;
  showError: boolean;
  claimEnabled: boolean;
  handleClaim: () => void;
  handleLearnMore: () => void;
  handleClose: () => void;
}
