import React, { ReactNode, FC } from 'react';
import clsx from 'clsx';
// import MUIButton from '@material-ui/core/Button';
// import Spinner from '@material-ui/core/CircularProgress';
import { Button as RNEButton } from "react-native-elements";
import { useLinkTo } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

import styles from './styles';

interface IButton {
  id?: string;
  disabled?: boolean;
  linkTo?: string;
  onPress?: () => void;
  theme?: 'primary' | 'secondary';
  loading?: boolean;
  title?: string;
}

const Button: FC<IButton> = ({
  id,
  theme = 'primary',
  children,
  disabled = false,
  onPress,
  linkTo = '#',
  loading = false,
  title = "",
  ...otherProps
}) => {

  const composedButtonStyles  = [
    styles.button,
    styles[theme],
  ]

  const composedButtonTitleStyles = [
    styles.buttonTitle,
    styles[theme+'_title']
  ]

  const flatButtonStyles = StyleSheet.flatten([
    composedButtonStyles
  ])

  const flayTitleStyles = StyleSheet.flatten([
    composedButtonTitleStyles
  ])

  const rnLinkTo = useLinkTo();

  const clickHandler = () => {
    if (linkTo !== '#') rnLinkTo(linkTo);
  };

  console.log("Button Native Styles");
;
  return (
    <RNEButton
      testID={id}
      title={title}
      loadingProps={{color: COLORS.primary}}
      buttonStyle={flatButtonStyles}
      titleStyle={flayTitleStyles}
      disabledStyle={styles.disabled}
      disabledTitleStyle={styles.disabledTitle}
      onPress={onPress}
      disabled={loading || disabled}
      loading={loading}
      {...otherProps}
    />
  );
};

export default Button;
