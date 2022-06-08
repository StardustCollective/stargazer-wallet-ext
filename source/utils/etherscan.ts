import Etherscan from 'etherscan-api';
import { EthNetworkId } from 'scripts/Background/controllers/EthChainController/types';

export const getContractDetails = async (address: string, network: EthNetworkId): Promise<Array<any> | null> => {
    const etherscan = Etherscan.init(process.env.ETHERSCAN_API_KEY, network);

    try {
        console.log('fetching ABI for address: ', address);
        const response = await etherscan.contract.getabi(address);

        if (response && response.status === '1') {
            return JSON.parse(response.result);
        }

        // Not a smart contract
        if (response.message.includes('Contract source code not verified')) {
            return null;
        }

        throw response;
    } catch (err: any) {
        if (err.includes('Contract source code not verified')) {
            return null;
        }

        throw err;
    }
}