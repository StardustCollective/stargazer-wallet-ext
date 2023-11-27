import { useState, useMemo, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';
import { estimateNftGasLimit } from 'utils/ethUtil';
import { getAccountController } from 'utils/controllersUtils';
import { OpenSeaSupportedChains } from 'state/nfts/types';
import { OPENSEA_NETWORK_MAP } from 'utils/opensea';

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
  const [toEthAddress, setToEthAddress] = useState<string>(toAddress);
  const [sendAmount, setSendAmount] = useState<number>(amount);
  const accountController = getAccountController();

  const gasSpeedLabel = useMemo(() => {
    if (gasPrice >= gasPrices[2]) return 'Fastest';
    if (gasPrice >= Math.floor((gasPrices[1] + gasPrices[2]) / 2)) return 'Fast';
    if (gasPrice > Math.floor((gasPrices[0] + gasPrices[1]) / 2)) return 'Average';
    if (gasPrice > gasPrices[0]) return 'Slow';
    return 'Turtle';
  }, [gasPrice, gasPrices]);

  const estimateGasFee = (gas: number) => {
    if (!gasPrices) return;
    const feeBN = ethers.utils
      .parseUnits(gas.toString(), 'gwei')
      .mul(BigNumber.from(gasLimit));

    const fee = Number(ethers.utils.formatEther(feeBN).toString());

    setGasFee(fee);
  };

  const handleGetTxFee = async () => {
    const network = OPENSEA_NETWORK_MAP[chain].network;
    const gas = await accountController.getLatestGasPrices(network);
    let gasPrices: number[] = [...gas];
    let uniquePrices = [...new Set(gas)].length;
    if (uniquePrices === 1) {
      let gp = gas[0];
      gasPrices = [gp - 5, gp, gp + 5];
    }
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
  };
}

export default useGasNftEstimate;
