import { Ref } from 'react';

export default interface ICurrencyInput {
  textInputPlaceholder?: string,
  onChangeText: (text: any) => void,
  placeholder: string,
  value: string,
  source?: any,
  onPress: () => void,
  tickerValue: string,
  containerStyle?: string,
  inputStyle?: string,
}
