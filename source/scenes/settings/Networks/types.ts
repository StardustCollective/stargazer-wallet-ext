export type IItem = {
  value: string;
  label: string;
};

export type INetworkOptions = {
  icon: string;
  key: string;
  title: string;
  value: string;
  onChange: (value: string) => void;
  items: IItem[];
  containerStyle: object;
};

export default interface INetworkSettings {
  networkOptions: Array<INetworkOptions>;
  handleAddNetwork: () => void;
}
