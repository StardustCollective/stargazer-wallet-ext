import { useController } from 'hooks/index';
import InputDataDecoder from 'ethereum-input-data-decoder';
import Web3 from 'web3';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring'
import store from 'state/store';
import { ETHNetwork } from 'scripts/types';
import erc20ABI from './erc20.json'

export const getERC20DataDecoder = () => {
    return new InputDataDecoder(erc20ABI as any);
}

export const estimateGasPrice = async (): Promise<number> => {
    const controller = useController();

    const client = controller.wallet.account.ethClient;

    // Returns average, fast, or fastest
    const { fast } = await client.estimateGasPrices();
    return fast.amount().toNumber();
}

export const estimateGasLimit = async ({ to, data }: { to: string, data: string }): Promise<number> => {
    const { activeNetwork, activeWallet }: any = store.getState().vault;
    const network = activeNetwork[KeyringNetwork.Ethereum] as ETHNetwork;

    const ethAsset = activeWallet.assets.find((asset: any) => asset.type === 'ethereum');

    if (!ethAsset) {
        return 0;
    }

    const from = ethAsset.address;

    const infuraUrl = network === 'testnet' ? 'https://ropsten.infura.io/v3/' : 'https://mainnet.infura.io/v3/';

    const web3 = new Web3(
        new Web3.providers.HttpProvider(`${infuraUrl}${process.env.INFURA_CREDENTIAL}`)
    );

    const gasLimit = await web3.eth.estimateGas({
        to,
        from,
        data
    });

    // Gas limit tends to be ~2x too low - increase so we have enough
    return gasLimit * 4;
}