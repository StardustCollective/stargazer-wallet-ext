/*
Wrapper to handle alerts between mobile and web
*/

import { Platform } from 'react-native';
import { showMessage, MessageType } from 'react-native-flash-message';
import { useAlert } from 'react-alert';

export const showAlert = (message: string, type: MessageType | undefined | null) => {
    if (Platform.OS === 'web') {
        const alert = useAlert();
        alert.removeAll();

        if (type === 'danger') {
            alert.error(message);
        } else {
            alert.show(message);
        }
    } else {
        showMessage({
            message,
            type,
            duration: 4000,
            hideStatusBar: true,
            style: { height: 90, justifyContent: 'center' }
        });
    }
};
