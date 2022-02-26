export type Message = {
    id: string;
    type: string;
    data: {
        asset: string;
        method: string;
        args: any[];
        network: string;
        origin?: string;
        to?: string;
        from?: string;
        value?: string;
        gas?: string;
        data: string;
    };
};

export enum SUPPORTED_EVENT_TYPES {
    accountChanged = 'accountsChanged',
    chainChanged = 'chainChanged', // TODO: implement
    close = 'close'
}

export enum SUPPORTED_WALLET_METHODS {
    getChainId,
    getAccounts,
    getBlockNumber,
    estimateGas,
    sendTransaction,
    signMessage,
    isConnected,
    getNetwork,
    getAddress,
    getBalance,
    getPublicKey
}

export const SUPPORTED_CHAINS = [
    'constellation',
    'ethereum'
];