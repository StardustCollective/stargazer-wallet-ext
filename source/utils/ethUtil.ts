import { useController } from 'hooks/index';
import InputDataDecoder from 'ethereum-input-data-decoder';
import Web3 from 'web3';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring'
import store from 'state/store';
import { ETHNetwork } from 'scripts/types';
import IVaultState, { AssetType, IAssetState } from 'state/vault/types';
import erc20ABI from './erc20.json'
import { getContractDetails } from './etherscan';

export const getERC20DataDecoder = () => {
    return new InputDataDecoder(erc20ABI as any);
}

export const estimateGasPrice = async (): Promise<number> => {
    const controller = useController();

    const client = controller.wallet.account.ethClient;

    if (!client) {
        return 0;
    }

    // Returns average, fast, or fastest
    const { fast } = await client.estimateGasPrices();
    return fast.amount().toNumber();
}

const _getWeb3 = (network: 'testnet' | 'mainnet') => {
    const infuraUrl = network === 'testnet' ? 'https://ropsten.infura.io/v3/' : 'https://mainnet.infura.io/v3/';

    return new Web3(
        new Web3.providers.HttpProvider(`${infuraUrl}${process.env.INFURA_CREDENTIAL}`)
    );
}

const _getAbi = async ({ to }: {to: string}) => {

    const { activeNetwork, activeWallet }: IVaultState = store.getState().vault;
    const network = activeNetwork[KeyringNetwork.Ethereum] as ETHNetwork;
    const knownERC20Asset = activeWallet.assets.find((asset: IAssetState) => asset.contractAddress === to && asset.type === AssetType.ERC20);

    let abi: Array<any> | false;
    if (knownERC20Asset) {
        abi = erc20ABI;
    } else {
        abi = await getContractDetails(to, network);
    }

    return abi;
}

export const estimateGasLimitForTransfer = async ({ to, from, amount: value }: {to: string, from: string,  amount: string}) => {
    const { activeNetwork }: IVaultState = store.getState().vault;
    const network = activeNetwork[KeyringNetwork.Ethereum] as ETHNetwork;
    const abi = await _getAbi({ to });
    const web3 = _getWeb3(network);
    const contract = new web3.eth.Contract(abi as any, to);

    if(value !== '0' && value !== ''){
        const val = parseInt(value); // transfer throws error on decimals, int amount estimate should be basically the same
        const gasLimit = await contract.methods.transfer(to, val).estimateGas({ from });
        return Math.floor(gasLimit * 1.5);
    }
    
    return 0;
}

export const estimateGasLimit = async ({ to, data }: { to: string, data: string }): Promise<number> => {
    const { activeNetwork, activeWallet }: IVaultState = store.getState().vault;
    const network = activeNetwork[KeyringNetwork.Ethereum] as ETHNetwork;
    const ethAsset = activeWallet?.assets.find((asset: IAssetState) => asset.type === AssetType.Ethereum);

    if (!ethAsset || !to || to?.toUpperCase().startsWith('DAG')) {
        return 0; // DAG? 
    }
    
    const from = ethAsset.address;
    const abi = await _getAbi({to});

    // Not a contract -> 21,000 standard gasLimit
    if (!abi) {
        return 21000;
    }

    const web3 = _getWeb3(network);

    const decoder = new InputDataDecoder(abi);

    const contract = new web3.eth.Contract(abi, to);

    const { method, inputs, types } = decoder.decodeData(data);

    // The decoder package strips 0x from addresses which breaks web3
    for (let i = 0; i < inputs.length; i++) {
        if (types[i] === 'address') {
            inputs[i] = '0x' + inputs[i];
        }
    }

    const gasLimit = await contract.methods[method](...inputs).estimateGas({ from });

    // Increase to be sure we have enough
    return Math.floor(gasLimit * 1.5);
}