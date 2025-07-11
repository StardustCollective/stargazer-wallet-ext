import { BigNumber, ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';

import { getNetworkFromChainId } from 'scripts/Background/controllers/EVMChainController/utils';

import { IAssetInfoState } from 'state/assets/types';
import { AssetType } from 'state/vault/types';

import { getAccountController } from 'utils/controllersUtils';
import { estimateGasLimit, estimateGasLimitForTransfer } from 'utils/ethUtil';
import { countSignificantDigits, fixedNumber } from 'utils/number';

type IUseGasEstimate = {
  toAddress?: string;
  fromAddress?: string;
  asset?: IAssetInfoState;
  data?: string;
  gas?: string;
};

function useGasEstimate({ toAddress, fromAddress, asset, data, gas }: IUseGasEstimate) {
  const [gasPrice, setGasPrice] = useState<number>(0);
  const [gasPrices, setGasPrices] = useState<number[]>([]);
  const [gasFee, setGasFee] = useState<number>(0);
  const [gasLimit, setGasLimit] = useState<number>(0);
  const [digits, setDigits] = useState<number>(0);
  const [toEthAddress, setToEthAddress] = useState<string>(toAddress);
  const [sendAmount, setSendAmount] = useState<string>('0');
  const accountController = getAccountController();

  const gasSpeedLabel = useMemo(() => {
    if (gasPrice >= gasPrices[2]) return 'Fastest';
    if (gasPrice >= gasPrices[1]) return 'Fast';
    if (gasPrice >= gasPrices[0]) return 'Average';
    return 'Slow';
  }, [gasPrice, gasPrices]);

  const estimateGasFee = (feeInGwei: number) => {
    if (!gasPrices) return;

    // 1. Convert fee in gwei from number to fixed string
    const feeGweiFixed = feeInGwei.toFixed(10);

    // 2. Convert fee in gwei to wei
    const feeInWei = ethers.utils.parseUnits(feeGweiFixed, 'gwei');

    // 3. Convert gas limit to wei
    const limitInWei = BigNumber.from(gasLimit);

    // 4. Multiply fee in wei by gas limit in wei to get total fee in wei
    const totalFeeInWei = feeInWei.mul(limitInWei);

    // 5. Convert total fee in wei to ether
    const feeInEth = ethers.utils.formatEther(totalFeeInWei);

    // 6. Convert fee in ether to number
    const feeNumber = Number(feeInEth.toString());

    setGasFee(feeNumber);
  };

  const estimateDiffAmount = (value: number): number => {
    if (value < 10) return 1;
    return Math.floor(value / 10);
  };

  const removeNegativeGasPrice = (prices: number[]): number[] => {
    const positiveGasPrices = [...prices];
    for (let i = 0; i < positiveGasPrices.length; i++) {
      if (positiveGasPrices[i] <= 0) {
        positiveGasPrices[i] = 0.01;
      }
    }

    return positiveGasPrices;
  };

  const handleGetTxFee = async () => {
    const network = asset?.network ? getNetworkFromChainId(asset?.network) : null;
    const gasValues = await accountController.getLatestGasPrices(network);
    const digit = countSignificantDigits(gasValues[1]);
    let prices: number[] = gasValues.map(g => fixedNumber(g, digit));
    const uniquePrices = [...new Set(gasValues)].length;
    if (uniquePrices === 1) {
      const gp = gasValues[0];
      const amount = estimateDiffAmount(gp);
      prices = [gp - amount, gp, gp + amount];
    }
    prices = removeNegativeGasPrice(prices);
    setDigits(digit);
    setGasPrices(prices);
    setGasPrice(prices[2]);
    estimateGasFee(prices[2]);
  };

  const getGasLimit = async () => {
    const network = asset?.network ? getNetworkFromChainId(asset?.network) : null;
    let limit;
    try {
      if (asset.type === AssetType.ERC20) {
        if (data) {
          limit = await estimateGasLimit({ to: asset.address, data, gas, network });
        } else {
          limit = await estimateGasLimitForTransfer({
            from: fromAddress,
            amount: sendAmount,
            to: toEthAddress,
            gas,
          });
        }
      } else {
        limit = await estimateGasLimit({ to: toEthAddress, data, gas, network });
      }
    } catch (err: any) {
      console.log('estimateGas err: ', err);
      limit = 0;
    }

    if (limit) {
      setGasLimit(limit);
    }
  };

  useEffect(() => {
    getGasLimit();
  }, [toEthAddress, sendAmount]);

  useEffect(() => {
    if (gasLimit > 0) {
      handleGetTxFee();
    }
  }, [gasLimit]);

  return {
    setGasPrice,
    setToEthAddress,
    setSendAmount,
    estimateGasFee,
    digits,
    gasSpeedLabel,
    gasFee,
    gasPrice,
    gasPrices,
    gasLimit,
  };
}

export default useGasEstimate;
