export default interface ICardClaim {
  currentStreak: number;
  totalEarned: number;
  amount: number;
  currentClaimWindow: string;
  loading: boolean;
  showError: boolean;
  claimEnabled: boolean;
  epochsLeft: number;
  handleClaim: () => void;
  handleLearnMore: () => void;
  handleHideCard: () => void;
}
