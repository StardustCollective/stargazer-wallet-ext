import React, { FC, useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View, Easing } from 'react-native';
import TextV3 from 'components/TextV3';
import InfoIcon from 'assets/images/svg/info-outlined.svg';
import ErrorIcon from 'assets/images/svg/error-outlined.svg';
import CloseIcon from 'assets/images/svg/close.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { ToastProps, ToastType, ToastPosition } from '../../context/ToastContext';
import { BackgroundColorMap, BorderColorMap } from './constants';
import styles from './styles';

const DURATION = 5000; // 5 seconds

const INITIAL_TOP = -100;
const FINAL_TOP = 80;

const INITIAL_BOTTOM = 200;
const FINAL_BOTTOM = -100;

const ICON_SIZE = 24;
const CLOSE_SIZE = 10;

const Toast: FC<ToastProps & { visible: boolean }> = ({
  visible,
  type = ToastType.info,
  position = ToastPosition.bottom,
  containerStyle,
  title,
  titleStyle,
  message1,
  message1Style,
  message2,
  message2Style,
  onClose,
}) => {
  const INITIAL_POSITION = position === ToastPosition.top ? INITIAL_TOP : INITIAL_BOTTOM;
  const FINAL_POSITION = position === ToastPosition.top ? FINAL_TOP : FINAL_BOTTOM;

  const positionAnim = useRef(new Animated.Value(INITIAL_POSITION)).current;

  const POSITION_STYLES: { [type: string]: object } = {
    [ToastPosition.bottom]: styles.positionBottom,
    [ToastPosition.top]: styles.positionTop,
  };

  const ICON_TYPES: { [type: string]: JSX.Element } = {
    [ToastType.error]: <ErrorIcon height={ICON_SIZE} width={ICON_SIZE} color="#DC2626" />,
    [ToastType.warning]: <InfoIcon height={ICON_SIZE} width={ICON_SIZE} />,
    [ToastType.success]: <InfoIcon height={ICON_SIZE} width={ICON_SIZE} />,
    [ToastType.info]: <InfoIcon height={ICON_SIZE} width={ICON_SIZE} color="#363BD3" />,
  };

  const Icon = ICON_TYPES[type];

  const positionStyles = POSITION_STYLES[position];

  useEffect(() => {
    if (visible) {
      Animated.timing(positionAnim, {
        toValue: FINAL_POSITION,
        duration: 320,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();

      const timer = setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, DURATION);

      return () => clearTimeout(timer);
    }
    Animated.timing(positionAnim, {
      toValue: INITIAL_POSITION,
      duration: 320,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [visible]);

  const renderIcon = () => {
    return <View style={styles.iconContainer}>{Icon}</View>;
  };

  const renderTitle = () => {
    if (typeof title === 'string') {
      return (
        <TextV3.CaptionStrong
          color={COLORS_ENUMS.BLACK}
          extraStyles={[styles.title, titleStyle]}
        >
          {title}
        </TextV3.CaptionStrong>
      );
    }

    return title;
  };

  const renderMessage1 = () => {
    if (typeof message1 === 'string') {
      return (
        <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={message1Style}>
          {message1}
        </TextV3.Caption>
      );
    }

    return message1;
  };

  const renderMessage2 = () => {
    if (typeof message2 === 'string') {
      return (
        <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={message2Style}>
          {message2}
        </TextV3.Caption>
      );
    }

    return message2;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        positionStyles,
        {
          backgroundColor: BackgroundColorMap[type],
          borderColor: BorderColorMap[type],
          transform: [{ translateY: positionAnim }],
        },
      ]}
    >
      <View style={styles.toastContent}>
        {!!Icon && renderIcon()}
        <View style={styles.textContainer}>
          {!!title && renderTitle()}
          {!!message1 && renderMessage1()}
          {!!message2 && renderMessage2()}
        </View>
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeContainer}>
        <CloseIcon height={CLOSE_SIZE} width={CLOSE_SIZE} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Toast;
