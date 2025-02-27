import { useState, useMemo, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';
import { estimateNftGasLimit } from 'utils/ethUtil';
import { getAccountController } from 'utils/controllersUtils';
import { OpenSeaSupportedChains } from 'state/nfts/types';
import { OPENSEA_NETWORK_MAP } from 'utils/opensea';
import { countSignificantDigits, fixedNumber } from 'utils/number';

type IUseGasNftEstimate = {
  contractAddress: string;
  toAddress: string;
  tokenId: string;
  isERC721: boolean;
  chain: OpenSeaSupportedChains;
  amount?: number;
};

const ETH_ADDRESS_LENGTH = 42;

function useGasNftEstimate({
  contractAddress,
  toAddress,
  tokenId,
  isERC721,
  chain,
  amount,
}: IUseGasNftEstimate) {
  const [gasPrice, setGasPrice] = useState<number>(0);
  const [gasPrices, setGasPrices] = useState<number[]>([]);
  const [gasFee, setGasFee] = useState<number>(0);
  const [gasLimit, setGasLimit] = useState<number>(0);
  const [digits, setDigits] = useState<number>(0);
  const [toEthAddress, setToEthAddress] = useState<string>(toAddress);
  const [sendAmount, setSendAmount] = useState<number>(amount);
  const accountController = getAccountController();

  const gasSpeedLabel = useMemo(() => {
    if (gasPrice >= gasPrices[2]) return 'Fastest';
    if (gasPrice >= gasPrices[1]) return 'Fast';
    if (gasPrice >= gasPrices[0]) return 'Average';
    return 'Slow';
  }, [gasPrice, gasPrices]);

  const estimateGasFee = (gas: number) => {
    if (!gasPrices) return;

    const gasFixed = gas.toFixed(10);
    const feeBN = ethers.utils.parseUnits(gasFixed, 'gwei').mul(BigNumber.from(gasLimit));

    const fee = Number(ethers.utils.formatEther(feeBN).toString());

    setGasFee(fee);
  };

  const estimateDiffAmount = (value: number): number => {
    if (value < 10) return 1;
    return Math.floor(value / 10);
  };

  const removeNegativeGasPrice = (gasPrices: number[]): number[] => {
    const positiveGasPrices = [...gasPrices];
    for (let i = 0; i < positiveGasPrices.length; i++) {
      if (positiveGasPrices[i] <= 0) {
        positiveGasPrices[i] = 0.01;
      }
    }

    return positiveGasPrices;
  };

  const handleGetTxFee = async () => {
    const network = OPENSEA_NETWORK_MAP[chain].network;
    const gas = await accountController.getLatestGasPrices(network);
    const digits = countSignificantDigits(gas[1]);
    let gasPrices: number[] = gas.map((g) => fixedNumber(g, digits));
    let uniquePrices = [...new Set(gas)].length;
    if (uniquePrices === 1) {
      let gp = gas[0];
      const amount = estimateDiffAmount(gp);
      gasPrices = [gp - amount, gp, gp + amount];
    }
    gasPrices = removeNegativeGasPrice(gasPrices);
    setDigits(digits);
    setGasPrices(gasPrices);
    setGasPrice(gasPrices[2]);
    estimateGasFee(gasPrices[2]);
  };

  const getGasLimit = async () => {
    let gasLimit;
    try {
      if (!!toAddress && toAddress.length === ETH_ADDRESS_LENGTH) {
        const network = OPENSEA_NETWORK_MAP[chain].network;
        gasLimit = await estimateNftGasLimit({
          contractAddress,
          tokenId,
          toAddress,
          network,
          isERC721,
          amount: sendAmount,
        });
      }
    } catch (err: any) {
      console.log('estimateNftGasLimit err: ', err);
      gasLimit = 0;
    }
    if (!!gasLimit) {
      setGasLimit(gasLimit);
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
    gasSpeedLabel,
    gasFee,
    gasPrice,
    gasPrices,
    gasLimit,
    digits,
  };
}

export default useGasNftEstimate;
