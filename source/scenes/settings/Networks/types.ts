import { IOption } from 'components/Select/types';

export type INetworkOptions = {
  key: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<IOption>;
  containerStyle?: object;
  extraProps?: object;
};

export default interface INetworkSettings {
  networkOptions: Array<INetworkOptions>;
}
