
export const getDecimalPlaces = (valString: string): Number => {
  const floatVal = parseFloat(valString);
  
  return isNaN(floatVal) ? null : valString.includes('.') ? valString.split('.')[1].length : 0;
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

  if (parseFloat(valString) > maxAmount || decimalPlaces > assetDecimals)
    return null;

  return valString;
};


// const handleAmountChange = useCallback(
//   (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const changeAmount = getChangeAmount(ev.target.value, MAX_AMOUNT_NUMBER, assetInfo.decimals);

//     if (changeAmount === undefined) return;

//     setAmount(changeAmount);

//     if (changeAmount !== amount) {  
//       setAmountBN(ethers.utils.parseUnits(changeAmount, assetInfo.decimals));
//       estimateGasFee(gasPrice);
//     }
//   },
//   [address, gasLimit]
// );