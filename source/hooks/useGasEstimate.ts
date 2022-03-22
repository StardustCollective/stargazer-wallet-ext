import { useState, useMemo, useEffect } from 'react';
import { AssetType } from 'state/vault/types';
import { BigNumber, ethers } from 'ethers';
import { IAssetInfoState } from 'state/assets/types';
import { estimateGasLimit, estimateGasLimitForTransfer } from 'utils/ethUtil';
import { getAccountController } from 'utils/controllersUtils';

type IUseGasEstimate = {
  toAddress?: string;
  fromAddress?: string;
  asset?: IAssetInfoState;
  data?: string;
};

function useGasEstimate({ toAddress, fromAddress, asset, data }: IUseGasEstimate) {
  const [gasPrice, setGasPrice] = useState<number>(0);
  const [gasPrices, setGasPrices] = useState<number[]>([]);
  const [gasFee, setGasFee] = useState<number>(0);
  const [gasLimit, setGasLimit] = useState<number>(0);
  const [toEthAddress, setToEthAddress] = useState<string>(toAddress);
  const [sendAmount, setSendAmount] = useState<string>('');
  const accountController = getAccountController();

  const gasSpeedLabel = useMemo(() => {
    if (gasPrice >= gasPrices[2]) return 'Fastest';
    if (gasPrice >= Math.floor((gasPrices[1] + gasPrices[2]) / 2))
      return 'Fast';
    if (gasPrice > Math.floor((gasPrices[0] + gasPrices[1]) / 2))
      return 'Average';
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
    accountController.getLatestGasPrices().then((gas) => {
      let gasPrices: number[] = [...gas];
      let uniquePrices = [...new Set(gas)].length;
      if (uniquePrices === 1) {
        let gp = gas[0];
        gasPrices = [gp - 5, gp, gp + 5];
      }
      setGasPrices(gasPrices);
      setGasPrice(gasPrices[2]);
      estimateGasFee(gasPrices[2]);
    })
  };

  const getGasLimit = async () => {
    let gasLimit;
    try {
      if (asset.type === AssetType.ERC20) {
        if (data) {
          gasLimit = await estimateGasLimit({ to: asset.address, data })
        } else {
          gasLimit = await estimateGasLimitForTransfer({ from: fromAddress, amount: sendAmount, to: asset.address });
        }
      } else {
        gasLimit = await estimateGasLimit({ to: toEthAddress, data })
      }
    } catch (err: any) {
      console.log('estimateGas err: ', err);
      gasLimit = 0;
    }

    if (!!gasLimit) {
      setGasLimit(gasLimit);
    }
  }

  useEffect(() => {
    getGasLimit();
  }, [toEthAddress, sendAmount]);

  useEffect(() => {
    if (gasLimit > 0) {
      handleGetTxFee();
    }
  }, [gasLimit])

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

export default useGasEstimate;
