import InputDataDecoder from 'ethereum-input-data-decoder';
import store from 'state/store';
import IVaultState, { AssetType, IAssetState } from 'state/vault/types';
import erc20ABI from './erc20.json';
import { getWalletController } from './controllersUtils';
import { parseUnits } from 'ethers/lib/utils';

export const getERC20DataDecoder = () => {
    return new InputDataDecoder(erc20ABI as any);
}

export const estimateGasLimitForTransfer = async ({ to, from, amount: value, gas }: {to: string, from: string, amount: string, gas: string}): Promise<number> => {
    const walletController = getWalletController();
    const ethClient = walletController.account.ethClient;

    if (gas) {
        return parseInt(gas);
    } 

    if (value !== '' && to && from) {
        try {
            const contract = ethClient.createERC20Contract(from);
            const gasLimitBigNumber = await contract.estimateGas.transfer(to, parseUnits(value));
            const gasLimit = gasLimitBigNumber.toNumber();
            return Math.floor(gasLimit * 1.5);
        } catch(err) {
            return 90000;
        }
    }

    return 0;
}

export const estimateGasLimit = async ({ to, data, gas }: { to: string, data: string, gas: string }): Promise<number> => {
    const walletController = getWalletController();
    const ethClient = walletController.account.ethClient;
    const { activeWallet }: IVaultState = store.getState().vault;
    const ethAsset = activeWallet?.assets.find((asset: IAssetState) => asset.type === AssetType.Ethereum);
    const from = ethAsset.address;

    if (!ethAsset || !to || to?.toUpperCase().startsWith('DAG')) {
        return 0; // DAG? 
    }

    console.log('estimateGasLimit', { gas, data, from, to});
    
    // ETH asset
    if (gas) {
        return parseInt(gas);
    } 
    if (!data) {
        return 21000;
    } 

    try {
        const gasBigNumber = await ethClient.estimateGas(from, to, data);
        return gasBigNumber.toNumber();
    } catch(err) {
        console.error('Error estimating gas limit:', err);
        return 90000;
    }
}