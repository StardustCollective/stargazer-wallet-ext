/*
Wrapper to handle alerts between mobile and web
*/

import { Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useAlert } from 'react-alert';

exports.showAlert = ( message:string, type:string | undefined ) => {
    if( Platform.OS === 'web' ) {
        const alert = useAlert();

        alert.removeAll();

        if( type === 'error' ) {
            alert.error(message);
        } else {
            alert.show(message);
        }
    } else {
        const options= {
            message,
            type
        };

        showMessage(options);
    }
};

