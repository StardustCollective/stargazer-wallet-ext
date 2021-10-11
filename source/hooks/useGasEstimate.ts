import { useState, useMemo, useEffect } from 'react';
import { AssetType } from 'state/vault/types';
import { useController } from 'hooks/index';
import { BigNumber, ethers } from 'ethers';
import { IAssetInfoState } from 'state/assets/types';

type IUseGasEstimate = {
  toAddress?: string;
  amount?: string;
  asset?: IAssetInfoState;
};

function useGasEstimate({ toAddress, amount, asset }: IUseGasEstimate) {
  const controller = useController();
  const [gasPrice, setGasPrice] = useState<number>(0);
  const [gasPrices, setGasPrices] = useState<number[]>([]);
  const [gasFee, setGasFee] = useState<number>(0);
  const [gasLimit, setGasLimit] = useState<number>(0);

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
    controller.wallet.account.getLatestGasPrices().then((gas) => {
      let gasPrices: number[] = [...gas];
      let uniquePrices = [...new Set(gas)].length;
      if(uniquePrices === 1){
        let gp = gas[0];
        gasPrices = [gp-1, gp, gp+1];
      }
      setGasPrices(gasPrices);
      setGasPrice(gasPrices[2]);
      estimateGasFee(gasPrices[2]);
    })
  };

  useEffect(() => {
    const getGasLimit = async () => {
      let gasLimit = asset.type === AssetType.Ethereum ? 21000 : 0;

      if (gasLimit) {
        setGasLimit(gasLimit);
        handleGetTxFee();
      } else {
        controller.wallet.account.ethClient.estimateTokenTransferGasLimit(            
          toAddress,
          asset.address, 
          ethers.utils.parseUnits(amount, asset.decimals))
        .then(gasLimit => {
          setGasLimit(gasLimit);
        })
      }
    }
    getGasLimit();
  }, []);

  useEffect(() => {
    if(gasLimit > 0){
      handleGetTxFee();
    }
  }, [gasLimit])

  return {
    estimateGasFee,
    gasSpeedLabel,
    gasFee,
    gasPrice,
    gasPrices,
    setGasPrice,
    gasLimit,
  };
}

export default useGasEstimate;
