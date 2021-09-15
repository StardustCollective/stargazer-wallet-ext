import {useState, useMemo, useEffect } from 'react';
import IVaultState, { AssetType } from 'state/vault/types';
import { useController } from 'hooks/index';
import { BigNumber, ethers } from 'ethers';
import { useSelector } from 'react-redux';
// import IAssetListState from 'state/assets/types';
import { RootState } from 'state/store';

function useGasEstimate(initialGasPrice?: number) {

  const controller = useController();
  const [gasPrice, setGasPrice] = useState<number>(0);
  const [gasPrices, setGasPrices] = useState<number[]>([]);
  const [gasFee, setGasFee] = useState<number>(0);
  const [gasLimit, setGasLimit] = useState<number>(0);
  // const [asset, setAsset] = useState<string>('');


  // const assets: IAssetListState = useSelector(
  //   (state: RootState) => state.assets
  // );
  const { activeAsset }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );

  const gasSpeedLabel = useMemo(() => {
    if (gasPrice >= gasPrices[2]) return 'Fastest';
    if(gasPrice >= Math.floor((gasPrices[1] + gasPrices[2]) / 2)) return 'Fast';
    if(gasPrice > Math.floor((gasPrices[0] + gasPrices[1]) / 2)) return 'Average';
    if(gasPrice > gasPrices[0]) return 'Slow';
    return 'Turtle';
  }, [gasPrice, gasPrices])


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
    });
  };

  useEffect(() => {

    let gasLimit = activeAsset.type === AssetType.Ethereum ? 21000 : 0

    if (gasLimit) {
      setGasLimit(gasLimit);
    }

    if(initialGasPrice){
      estimateGasFee(initialGasPrice);
    }

  }, []);
  
  useEffect(() => {
    handleGetTxFee();
  }, []);
 
  return {
    estimateGasFee,
    gasSpeedLabel, 
    gasFee,
    gasPrice,
    setGasPrice,
    // setAsset,
  };

}


export default useGasEstimate;