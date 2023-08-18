export interface IPhraseInput {
  value: string;
  index: number;
  hasError: boolean;
  onChangeText: (value: string, index: number) => void;
}
