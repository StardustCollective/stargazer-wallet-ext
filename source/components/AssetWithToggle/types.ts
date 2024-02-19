export default interface IAssetWithToggle {
  id?: string;
  logo: string;
  network: string;
  symbol: string;
  label: string;
  selected: boolean;
  disabled: boolean;
  toggleItem: (value: boolean) => void;
}
