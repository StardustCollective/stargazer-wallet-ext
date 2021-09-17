import { useState, useMemo, useEffect } from 'react';
import IVaultState, { AssetType } from 'state/vault/types';
import { useController } from 'hooks/index';
import { BigNumber, ethers } from 'ethers';
import { useSelector } from 'react-redux';
import IAssetListState from 'state/assets/types';
import { RootState } from 'state/store';

type IUseGasEstimate = {
  toAddress?: string;
  amount?: string
};

function useGasEstimate({ toAddress, amount }: IUseGasEstimate) {
  const controller = useController();
  const [gasPrice, setGasPrice] = useState<number>(0);
  const [gasPrices, setGasPrices] = useState<number[]>([]);
  const [gasFee, setGasFee] = useState<number>(0);
  const [gasLimit, setGasLimit] = useState<number>(0);

  const { activeAsset }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );

  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );

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
      const gasPrice = gas[1];
      setGasPrices(gas);
      setGasPrice(gasPrice);
      estimateGasFee(gasPrice);
    })
  };

  useEffect(() => {
    const getGasLimit = async () => {
      let gasLimit = activeAsset.type === AssetType.Ethereum ? 21000 : 0;

      if (gasLimit) {
        setGasLimit(gasLimit);
        handleGetTxFee();
      } else {
        const assetInfo = assets[activeAsset.id];
        controller.wallet.account.ethClient.estimateTokenTransferGasLimit(            
          toAddress,
          assetInfo.address, 
          ethers.utils.parseUnits(amount, assetInfo.decimals))
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
    setGasPrice,
  };
}

export default useGasEstimate;
