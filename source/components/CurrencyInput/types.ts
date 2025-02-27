export default interface ICurrencyInput {
  style?: object;
  textInputPlaceholder?: string;
  onChangeText: (text: any) => void;
  placeholder: string;
  value: string;
  source?: any;
  networkIcon?: string;
  onPress: () => void;
  tickerValue: string;
  containerStyle?: string;
  inputStyle?: string;
  editable?: boolean;
  isError?: boolean;
}
