import InputDataDecoder from 'ethereum-input-data-decoder';
import * as ethers from 'ethers';

import { IAssetInfoState } from 'state/assets/types';
import store from 'state/store';
import IVaultState, { AssetType, IAssetState } from 'state/vault/types';

import { getWalletController } from './controllersUtils';
import erc20ABI from './erc20.json';

export const getERC20DataDecoder = () => {
  return new InputDataDecoder(erc20ABI as any);
};

export const estimateGasLimitForTransfer = async ({ to, from, amount: value, gas }: { to: string; from: string; amount: string; gas: string }): Promise<number> => {
  const walletController = getWalletController();
  const { networkController } = walletController.account;
  const { assets } = store.getState();
  const { activeAsset }: IVaultState = store.getState().vault;
  const assetAddress = activeAsset?.contractAddress;

  if (gas) {
    return parseInt(gas);
  }

  if (value !== '' && to && from && assetAddress) {
    try {
      const contract = networkController.createERC20Contract(assetAddress);
      const assetInfo = Object.values(assets).find((asset: IAssetInfoState) => asset.address === assetAddress);
      const decimals = assetInfo?.decimals || 18;
      const amount = ethers.utils.parseUnits(value, decimals).toString();
      const gasLimitBigNumber = await contract.estimateGas.transfer(to, amount, { from });
      const gasLimit = gasLimitBigNumber.toNumber();
      return Math.floor(gasLimit * 1.5);
    } catch (err) {
      return 90000;
    }
  }

  return 0;
};

export const estimateNftGasLimit = async ({
  contractAddress,
  tokenId,
  toAddress,
  network,
  isERC721,
  amount,
}: {
  contractAddress: string;
  tokenId: string;
  toAddress: string;
  network: string;
  isERC721: boolean;
  amount: number;
}): Promise<number> => {
  const { networkController } = getWalletController().account;
  const { activeWallet }: IVaultState = store.getState().vault;
  const ethAsset = activeWallet?.assets.find((asset: IAssetState) => asset.type === AssetType.Ethereum);
  const fromAddress = ethAsset.address;

  if (!contractAddress || !tokenId || !toAddress || !network) {
    return 0;
  }

  try {
    const contract = isERC721 ? networkController.createERC721Contract(contractAddress, network) : networkController.createERC1155Contract(contractAddress, network);
    const gasLimitBigNumber = isERC721 ? await contract.estimateGas.transferFrom(fromAddress, toAddress, tokenId) : await contract.estimateGas.safeTransferFrom(fromAddress, toAddress, tokenId, amount, '0x');
    const gasLimit = gasLimitBigNumber.toNumber();

    return gasLimit;
  } catch (err) {
    console.error('Error estimateNftGasLimit:', err);
    return 0;
  }
};

export const estimateGasLimit = async ({ to, data, gas, network }: { to: string; data: string; gas: string; network: string }): Promise<number> => {
  const walletController = getWalletController();
  const { networkController } = walletController.account;
  const { activeWallet }: IVaultState = store.getState().vault;
  const ethAsset = activeWallet?.assets.find((asset: IAssetState) => asset.type === AssetType.Ethereum);
  const from = ethAsset.address;

  if (!ethAsset || !to || to?.toUpperCase().startsWith('DAG')) {
    return 0; // DAG?
  }

  // ETH asset
  if (gas) {
    return parseInt(gas);
  }
  if (!data) {
    return 21000;
  }

  try {
    const gasBigNumber = await networkController.estimateGas({ from, to, data }, network);
    return gasBigNumber.toNumber();
  } catch (err) {
    console.error('Error estimating gas limit:', err);
    return 90000;
  }
};
