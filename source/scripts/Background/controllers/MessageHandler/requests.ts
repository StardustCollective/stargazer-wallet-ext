import { browser, Runtime } from 'webextension-polyfill-ts';
import { v4 as uuid } from 'uuid';
import { Message } from './types';
import { IMasterController } from '../';
import { getERC20DataDecoder } from 'utils/ethUtil';
import { SUPPORTED_WALLET_METHODS } from './types';

export const handleRequest = async (
    port: Runtime.Port,
    masterController: IMasterController,
    message: Message,
    origin: string,
    setPendingWindow: (isPending: boolean) => void,
    isPendingWindow: () => boolean
) => {
    const { method, args, asset } = message.data;

    console.log('CAL_REQUEST.method:', method, args);

    const allowed = masterController.dapp.isDAppConnected(origin);
    const walletIsLocked = !masterController.wallet.isUnlocked();

    const provider = asset === 'DAG' ? masterController.stargazerProvider : masterController.ethereumProvider;

    const windowId = uuid();

    let result: any = undefined;
    switch (+method) {
        case SUPPORTED_WALLET_METHODS.isConnected:
            result = { connected: !!allowed && !walletIsLocked };
            break;
        case SUPPORTED_WALLET_METHODS.getAddress:
            result = provider.getAddress();
            break;
        case SUPPORTED_WALLET_METHODS.getAccounts:
            result = provider.getAccounts();
            break;
        case SUPPORTED_WALLET_METHODS.getChainId:
            result = provider.getChainId();
            break;
        case SUPPORTED_WALLET_METHODS.getBlockNumber:
            result = provider.getBlockNumber();
            break;
        case SUPPORTED_WALLET_METHODS.estimateGas:
            result = await provider.getGasEstimate();
            break;
        case SUPPORTED_WALLET_METHODS.getNetwork:
            result = provider.getNetwork();
            break;
        case SUPPORTED_WALLET_METHODS.getBalance:
            result = provider.getBalance();
            break;
        case SUPPORTED_WALLET_METHODS.signMessage:{
            const data = {
                origin,
                signingAddress: args[0],
                message: args[1]
            }

            const popup = await masterController.createPopup(
                windowId,
                message.data.network,
                'signMessage',
                { ...data }
            );

            setPendingWindow(true);

            window.addEventListener(
                'messageSigned',
                (ev: any) => {
                    console.log('Connect window addEventListener', ev.detail);
                    if (ev.detail.windowId === windowId) {
                        port.postMessage({
                            id: message.id,
                            data: {result: ev.detail.result, data: {signature: ev.detail.signature ?? null}},
                        });
                        setPendingWindow(false);
                    }
                },
                { once: true, passive: true }
            );
            
            const handler = (id: number)=>{
                if (popup && id === popup.id) {
                    port.postMessage({ id: message.id, data: { result: false, data: {signature: null} } });
                    setPendingWindow(false);
                    browser.windows.onRemoved.removeListener(handler);
                }    
            }

            browser.windows.onRemoved.addListener(handler);

            return;
        }
        case SUPPORTED_WALLET_METHODS.getPublicKey:{
            if(asset === 'DAG'){
                result = masterController.stargazerProvider.getPublicKey();
            }else{
                throw new Error('getPublicKey method is not allowed in chain:ethereum')
            }
            break;
        }
        case SUPPORTED_WALLET_METHODS.sendTransaction:
            const data = args[0] ? args[0] : {};
            const decoder = getERC20DataDecoder();
            const decodedTxData = data?.data ? decoder.decodeData(data?.data) : null;

            const sendTransaction = async () => {
                await masterController.createPopup(
                    windowId,
                    message.data.network,
                    'sendTransaction',
                    { ...data }
                );

                setPendingWindow(true);

                window.addEventListener(
                    'transactionSent',
                    (ev: any) => {
                        console.log('Connect window addEventListener', ev.detail);
                        if (ev.detail.windowId === windowId) {
                            port.postMessage({
                                id: message.id,
                                data: {result: ev.detail.result, data: {}},
                            });
                            setPendingWindow(false);
                        }
                    },
                    { once: true, passive: true }
                );
            }

            const approveSpend = async () => { //special case transaction
                await masterController.createPopup(
                    windowId,
                    message.data.network,
                    'approveSpend',
                    { ...data }
                );

                setPendingWindow(true);

                window.addEventListener(
                    'spendApproved',
                    (ev: any) => {
                        console.log('Connect window addEventListener', ev.detail);
                        if (ev.detail.windowId === windowId) {
                            port.postMessage({
                                id: message.id,
                                data: {result: ev.detail.result, data: {}},
                            });
                            setPendingWindow(false); //prevents popup?
                        }
                    },
                    { once: true, passive: true }
                );
            }

            if (decodedTxData?.method === 'approve') {
                return approveSpend();
            } else {
                return sendTransaction();
            }

        // } else if (method === 'wallet.setLedgerAccounts') {
        //     await window.controller.stargazerProvider.importLedgerAccounts(args[0]);
        //     // port.postMessage({ id: message.id, data: { result: "success" } });
        //   return Promise.resolve({ id: message.id, result: "success" });
        // } else if (method === 'wallet.postTransactionResult') {
        //   await window.controller.stargazerProvider.postTransactionResult(args[0]);
        //   return Promise.resolve({ id: message.id, result: "success" });
    }

    if (result !== undefined) {
        return Promise.resolve({id: message.id, result});
    }

    return Promise.reject(new CustomEvent(message.id, {detail: 'Unknown Request' }));
}
