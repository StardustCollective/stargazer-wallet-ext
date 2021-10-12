import { useController } from 'hooks/index';
import InputDataDecoder from 'ethereum-input-data-decoder';
import erc20ABI from './erc20.json'

export const getERC20DataDecoder = () => {
    return new InputDataDecoder(erc20ABI as any);
}

export const estimateGas = async ({to, data} : {to: string, data: string}): Promise<number> => {
    const controller = useController();

    const client = controller.wallet.account.ethClient;

    const decodedData = data ? getERC20DataDecoder().decodeData(data) as any : null;

    // Returns average, fast, or fastest
    const { fast } = await client.estimateGasPrices();

    if (!decodedData) {
        console.log('not a contract, returning generic gas price');

        return fast.amount().toNumber();
    }

    if (decodedData.method === 'transfer') {
        return client.estimateTokenTransferGasLimit(
            decodedData.inputs[0],
            to,
            decodedData.inputs[1]
        )
    }

    return fast.amount().toNumber();
}