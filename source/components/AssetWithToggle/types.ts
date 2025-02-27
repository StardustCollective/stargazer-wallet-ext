export default interface IAssetWithToggle {
  id?: string;
  logo: string;
  networkLogo: string;
  networkLabel: string;
  symbol: string;
  label: string;
  selected: boolean;
  disabled: boolean;
  toggleItem: (value: boolean) => void;
}
