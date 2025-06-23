import { BigNumber, ethers } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { TransactionType } from 'scenes/external/SignTransaction/types';

import EVMChainController from 'scripts/Background/controllers/EVMChainController';
import { EthSendTransaction } from 'scripts/Provider/evm/utils/handlers';

import vaultSelectors from 'selectors/vaultSelectors';

import { countSignificantDigits, fixedNumber } from 'utils/number';

type IUseExternalGasEstimate = {
  type: TransactionType;
  transaction: EthSendTransaction;
};

function useExternalGasEstimate({ type, transaction }: IUseExternalGasEstimate) {
  const activeEVMNetwork = useSelector(vaultSelectors.getCurrentEvmNetwork);

  const [gasPrice, setGasPrice] = useState<number>(0);
  const [gasPrices, setGasPrices] = useState<number[]>([]);
  const [gasFee, setGasFee] = useState<number>(0);
  const [gasLimit, setGasLimit] = useState<number>(0);
  const [digits, setDigits] = useState<number>(0);
  const { chainId, gas } = transaction;
  const chain = chainId || activeEVMNetwork;

  const chainController = useMemo(() => new EVMChainController({ chain }), [chain]);

  const gasSpeedLabel = useMemo(() => {
    if (gasPrice >= gasPrices[2]) return 'Fastest';
    if (gasPrice >= gasPrices[1]) return 'Fast';
    if (gasPrice >= gasPrices[0]) return 'Average';
    return 'Slow';
  }, [gasPrice, gasPrices]);

  const estimateGasFee = useCallback(
    (feeInGwei: number) => {
      if (!feeInGwei || !gasLimit) return;

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
    },
    [gasLimit]
  );

  const estimateDiffAmount = (amount: number): number => {
    if (amount < 10) return 1;
    return Math.floor(amount / 10);
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

  const getGasPrices = useCallback(async () => {
    const gasPricesArray = await chainController.estimateGasPrices();
    const gasPricesInGwei = Object.values(gasPricesArray).map(gasValue => Number(ethers.utils.formatUnits(gasValue.amount().toString(), 'gwei')));

    const significantDigits = countSignificantDigits(gasPricesInGwei[1]);

    let pricesFixed: number[] = gasPricesInGwei.map(g => fixedNumber(g, significantDigits));
    const uniquePrices = [...new Set(gasPricesInGwei)].length;

    if (uniquePrices === 1) {
      const gp = gasPricesInGwei[0];
      const amount = estimateDiffAmount(gp);
      pricesFixed = [gp - amount, gp, gp + amount];
    }

    pricesFixed = removeNegativeGasPrice(pricesFixed);

    setDigits(significantDigits);
    setGasPrices(pricesFixed);
    setGasPrice(pricesFixed[2]);
    estimateGasFee(pricesFixed[2]);
  }, [chainController, gasLimit]);

  const estimateTransactionGasLimit = useCallback(async () => {
    try {
      const limit = await chainController.estimateGas({ ...transaction, gasLimit: transaction.gas });
      const limitNumber = limit.toNumber();

      return Math.floor(limitNumber * 1.2);
    } catch (err: unknown) {
      console.error('Error getting gas limit for ERC20 transfer:', err);
      return 90000;
    }
  }, [chainController, transaction]);

  const getGasLimit = useCallback(async () => {
    let limit = 0;

    if (gas) {
      const radix = gas && gas.startsWith('0x') ? 16 : 10;
      limit = parseInt(gas, radix);
    }

    if (!limit) {
      if (type === TransactionType.EvmNative) {
        limit = 21000;
      }

      if ([TransactionType.Erc20Transfer, TransactionType.Erc20Approve, TransactionType.EvmContractInteraction].includes(type)) {
        limit = await estimateTransactionGasLimit();
      }
    }

    if (limit) {
      setGasLimit(limit);
    }
  }, [type, gas, transaction, chainController]);

  useEffect(() => {
    getGasLimit();
  }, []);

  useEffect(() => {
    if (gasLimit > 0 && !gasPrices.length) {
      getGasPrices();
    }
  }, [gasLimit, gasPrices?.length]);

  return {
    setGasPrice,
    estimateGasFee,
    digits,
    gasSpeedLabel,
    gasFee,
    gasPrice,
    gasPrices,
    gasLimit,
  };
}

export default useExternalGasEstimate;
