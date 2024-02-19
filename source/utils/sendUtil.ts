export const getDecimalPlaces = (valString: string): number => {
  const floatVal = parseFloat(valString);

  return isNaN(floatVal)
    ? null
    : valString.includes('.')
    ? valString.split('.')[1].length
    : 0;
};

export const inputValToString = (targetVal: string): string => {
  const floatVal = parseFloat(targetVal);

  return isNaN(floatVal) ? '0' : targetVal;
};

export const getChangeAmount = (
  targetVal: string,
  maxAmount: number,
  assetDecimals: number
): string | undefined => {
  const valString = inputValToString(targetVal);
  const decimalPlaces = getDecimalPlaces(valString);

  if (parseFloat(valString) > maxAmount || decimalPlaces > assetDecimals) return null;

  return valString;
};

export const checkOneDecimalPoint = (value: string): boolean => {
  return /(\..*){1,}/.test(value);
};
