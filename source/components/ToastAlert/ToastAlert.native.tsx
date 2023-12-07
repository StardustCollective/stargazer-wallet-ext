import React, { FC } from 'react';
import { TouchableWithoutFeedback, View, StyleSheet, Text } from 'react-native';
import styles from './styles';

interface IAlertTemplate {
  close: () => void;
  message: any;
  options: any;
  style: object;
}

const ToastAlert: FC<IAlertTemplate> = ({ message, options = {}, style = {}, close }) => {
  const _styles = StyleSheet.flatten([
    styles.toast,
    options.type === 'error' ? styles.toastError : {},
    style,
    {
      marginBottom: 80,
      width: 300,
    },
    styles.alert,
  ]);

  return (
    <TouchableWithoutFeedback onPress={close}>
      <View style={_styles}>
        {/* options.type === 'error' && <Icon iconStyle={styles.toastIcon} name="cancel"/> */}
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ToastAlert;
