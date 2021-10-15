import { browser, Runtime } from 'webextension-polyfill-ts';
import { IMasterController } from '../';
import { Message } from './types';
import { initializeEvents, registerEvent, deregisterEvent } from './events';
import { enable } from './enable';
import { handleRequest } from './requests';

export const messagesHandler = (
    port: Runtime.Port,
    masterController: IMasterController
) => {
    let pendingWindow = false;

    const setPendingWindow = (isPending: boolean): void => {
        pendingWindow = isPending
    }

    const isPendingWindow = (): boolean => {
        return pendingWindow;
    }

    // Set up listeners once, then check origin/method based on registration in state
    initializeEvents(masterController, port);


    const listener = async (message: Message, connection: Runtime.Port) => {
        try {
            const response = await listenerHandler(message, connection);

            if (response) {
                const { id, result } = response;
                port.postMessage({ id, data: result });
            }
        } catch (e: any) {
            console.log('messagesHandler.ERROR', e.type, e.message, e.detail);
            console.log(JSON.stringify(e, null, 2));
            
            port.postMessage({ id: e.type, data: { error: e.detail } });
        }
    };

    const listenerHandler = async (
        message: Message,
        connection: Runtime.Port
    ) => {
        if (browser.runtime.lastError) {
            return Promise.reject('Runtime Last Error');
        }

        const url = connection.sender?.url as string;
        const origin = url && new URL(url as string).origin;

        switch (message.type) {
            case 'STARGAZER_EVENT_REG':
                return registerEvent(masterController, message);
            case 'STAGAZER_EVENT_DEREG':
                return deregisterEvent(masterController, message);
            case 'ENABLE_REQUEST':
                return enable(
                    port,
                    masterController,
                    message,
                    origin,
                    setPendingWindow,
                    isPendingWindow
                );
            case 'CAL_REQUEST':
                return handleRequest(
                    port,
                    masterController,
                    message,
                    origin,
                    setPendingWindow,
                    isPendingWindow
                );
            default:
                return Promise.resolve(null);
        }
    };

    port.onMessage.addListener(listener);
};
