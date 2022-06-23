

export default interface IAssetWithToggle {
  id?: string;
  logo: string;
  symbol: string;
  label: string;
  selected: boolean;
  toggleItem: (value: boolean) => void;
}
