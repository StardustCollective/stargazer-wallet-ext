import { browser, Runtime } from 'webextension-polyfill-ts';
import { v4 as uuid } from 'uuid';
import { KeyringWalletState, KeyringNetwork, KeyringWalletType, KeyringWalletAccountState} from '@stardust-collective/dag4-keyring';

import store from 'state/store';
import { getERC20DataDecoder } from 'utils/ethUtil';
import { IMasterController } from '../';
import { SUPPORTED_WALLET_METHODS, Message } from './types';

// Constants
const LEDGER_URL = '/ledger.html';
const EXTERNAL_URL  = '/external.html';
const WINDOW_TYPES = {
    popup: 'popup',
    normal: 'normal'
}

export const handleRequest = async (
    port: Runtime.Port,
    masterController: IMasterController,
    message: Message,
    origin: string,
    setPendingWindow: (isPending: boolean) => void
) => {
    const { vault } = store.getState();
    const allWallets = [...vault.wallets.local, ...vault.wallets.ledger];
    const activeWallet: KeyringWalletState | null = 
        vault?.activeWallet ? allWallets.find(
            (wallet: any) => wallet.id === vault.activeWallet.id
        ) : null;
    const { method, args, asset } = message.data;

    console.log('CAL_REQUEST.method:', method, args);

    const allowed = masterController.dapp.isDAppConnected(origin);
    const walletIsLocked = !masterController.wallet.isUnlocked();
    const provider = asset === 'DAG' ? masterController.stargazerProvider : masterController.ethereumProvider;
    const network = asset === 'DAG' ? KeyringNetwork.Constellation : KeyringNetwork.Ethereum;
    const windowUrl = activeWallet.type ===  KeyringWalletType.LedgerAccountWallet ? LEDGER_URL : EXTERNAL_URL;
    const windowType = activeWallet.type === KeyringWalletType.LedgerAccountWallet ? WINDOW_TYPES.normal : WINDOW_TYPES.popup;
    const windowSize = activeWallet.type === KeyringWalletType.LedgerAccountWallet ? { width: 1000, height: 1000 } : { width: 372, height: 600 }
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
            if(!activeWallet){
                return Promise.reject(new CustomEvent(message.id, {
                    detail: 'There is no active wallet'
                }));
            }

            const assetAccount = activeWallet.accounts.find(account=>account.network===network);
            if(!assetAccount){
                return Promise.reject(new CustomEvent(message.id, {
                    detail: 'No active account for the request asset type'
                }));
            }

            if(assetAccount.address !== args[0]){
                return Promise.reject(new CustomEvent(message.id, {
                    detail: 'The active account is not the requested'
                }));
            }

            let signatureRequestEncoded: string;
            try{
                signatureRequestEncoded = provider.normalizeSignatureRequest(args[1]);
            }catch(e){
                return Promise.reject(new CustomEvent(message.id, {
                    detail: e instanceof Error ? e.message : 'signMessage-error'
                }));
            }
        
            const data = {
                origin,
                asset,
                signatureRequestEncoded,
                walletId: activeWallet.id,
                walletLabel: activeWallet.label,
                publicKey: "",
            }

            // If the type of account is Ledger send back the public key so the
            // signature can be verified by the requester.
            let accounts: KeyringWalletAccountState[] = activeWallet?.accounts;
            if(activeWallet.type === KeyringWalletType.LedgerAccountWallet &&
               accounts && 
               accounts[0]){
                data.publicKey = accounts[0].publicKey;
            }

            const popup = await masterController.createPopup(
                windowId,
                message.data.network,
                'signMessage',
                { ...data },
                windowType,
                windowUrl,
                windowSize,
            );

            setPendingWindow(true);

            window.addEventListener(
                'messageSigned',
                (ev: any) => {
                    console.log('Connect window addEventListener', ev.detail);
                    if (ev.detail.windowId === windowId) {
                        
                        if (ev.detail.result) {
                            port.postMessage({
                                id: message.id,
                                data: ev.detail.signature.hex,
                            });
                        } else {
                            port.postMessage({
                                id: message.id,
                                data: {result: ev.detail.result},
                            });
                        }
                        setPendingWindow(false);
                    }
                },
                { once: true, passive: true }
            );
            
            const handler = (id: number)=>{
                if (popup && id === popup.id) {
                    port.postMessage({ id: message.id, data: { result: false } });
                    setPendingWindow(false);
                    browser.windows.onRemoved.removeListener(handler);
                }    
            }

            browser.windows.onRemoved.addListener(handler);

            return;
        }
        case SUPPORTED_WALLET_METHODS.getPublicKey:{
            if(asset === 'DAG'){
                if(!activeWallet){
                    return Promise.reject(new CustomEvent(message.id, {
                        detail: 'There is no active wallet'
                    }));
                }
    
                const assetAccount = activeWallet.accounts.find(account=>account.network===network);
                if(!assetAccount){
                    return Promise.reject(new CustomEvent(message.id, {
                        detail: 'No active account for the request asset type'
                    }));
                }
    
                if(assetAccount.address !== args[0]){
                    return Promise.reject(new CustomEvent(message.id, {
                        detail: 'The active account is not the requested'
                    }));
                }

                try{
                    result = masterController.stargazerProvider.getPublicKey();
                }catch(e){
                    port.postMessage({ id: message.id, data: { result: false, data: null } });
                }
                
            }else{
                return Promise.reject(new CustomEvent(message.id, {
                    detail: 'getPublicKey method is not allowed in chain:ethereum'
                }));
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
