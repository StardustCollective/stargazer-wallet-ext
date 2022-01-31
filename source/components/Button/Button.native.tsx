import React, { ReactNode, FC } from 'react';
<<<<<<< HEAD
import clsx from 'clsx';
// import MUIButton from '@material-ui/core/Button';
// import Spinner from '@material-ui/core/CircularProgress';
import { Button as RNEButton } from 'react-native-elements';
=======
import clsx from 'clsx';x
import { Button as RNEButton } from "react-native-elements";
>>>>>>> v1.0-mobile
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
  titleStyle?: object;
  variant?: object;
}

const Button: FC<IButton> = ({
  id,
  theme = 'primary',
  children,
  disabled = false,
  onPress,
  linkTo = '#',
  loading = false,
  variant = {},
  titleStyle = {},
  title = '',
  ...otherProps
}) => {
  const composedButtonStyles = [styles.button, styles[theme]];

  const composedButtonTitleStyles = [styles.buttonTitle, styles[theme + '_title']];

  const flatButtonStyles = StyleSheet.flatten([composedButtonStyles, variant]);

  const flayTitleStyles = StyleSheet.flatten([composedButtonTitleStyles, titleStyle]);

  const rnLinkTo = useLinkTo();

  const clickHandler = () => {
    if (linkTo !== '#') rnLinkTo(linkTo);
  };

  console.log('Button Native Styles');
  return (
    <RNEButton
      testID={id}
      title={title}
      loadingProps={{ color: COLORS.primary }}
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
