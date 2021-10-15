import { Runtime } from 'webextension-polyfill-ts';
import {Message, SUPPORTED_EVENT_TYPES} from './types';
import {IMasterController} from '../';

export const initializeEvents = (masterController: IMasterController, port: Runtime.Port,) => {
    Object.values(SUPPORTED_EVENT_TYPES).map((method) => {
        window.addEventListener(
            method,
            (event: any) => {
                let { data, origin } = event.detail;

                // Event listeners can be attached before connection but DApp must be connected to receive events
                const allowed = masterController.dapp.isDAppConnected(origin);

                // The event origin is checked to prevent sites that have not been
                // granted permissions to the user's account information from
                // receiving updates.
                if (allowed && masterController.dapp.isSiteListening(origin, method)) {
                    const id = `${origin}.${method}`; // mirrored in inject.ts
                    port.postMessage({ id, data });
                }
            },
            { passive: true }
        );
    })
};

export const registerEvent = (masterController: IMasterController, message: Message) => {
    const listenerOrigin = message.data.origin;
    const method = message.data.method;

    if (!Object.values(SUPPORTED_EVENT_TYPES).includes(method as SUPPORTED_EVENT_TYPES)) {
      return;
    }

    // Register the origin of the site that is listening for an event
    masterController.dapp.registerListeningSite(listenerOrigin, method);
};

export const deregisterEvent = (masterController: IMasterController, message: Message) => {
    const listenerOrigin = message.data.origin;
    const method = message.data.method;

    if (!Object.values(SUPPORTED_EVENT_TYPES).includes(method as SUPPORTED_EVENT_TYPES)) {
      return;
    }

    masterController.dapp.deregisterListeningSite(listenerOrigin, method);
};