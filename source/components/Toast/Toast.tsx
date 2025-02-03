import React, { FC, useEffect, useRef } from 'react';
import clsx from 'clsx';
import TextV3 from 'components/TextV3';
import { ToastProps, ToastType, ToastPosition } from 'context/ToastContext';
import InfoIcon from 'assets/images/svg/info-outlined-purple.svg';
import ErrorIcon from 'assets/images/svg/error-outlined.svg';
import CloseIcon from 'assets/images/svg/close.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './Toast.scss';

const DURATION = 5000; // Toast duration: 5 seconds
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
  const timerRef = useRef<NodeJS.Timeout>();

  // Auto-close logic
  useEffect(() => {
    if (visible) {
      timerRef.current = setTimeout(() => {
        if (onClose) onClose();
      }, DURATION);
    }

    return () => clearTimeout(timerRef.current);
  }, [visible, onClose]);

  const ICON_TYPES: { [type: string]: JSX.Element } = {
    [ToastType.error]: (
      <img src={`/${ErrorIcon}`} alt="Error" height={ICON_SIZE} width={ICON_SIZE} />
    ),
    [ToastType.warning]: (
      <img src={`/${InfoIcon}`} alt="Warning" height={ICON_SIZE} width={ICON_SIZE} />
    ),
    [ToastType.success]: (
      <img src={`/${InfoIcon}`} alt="Success" height={ICON_SIZE} width={ICON_SIZE} />
    ),
    [ToastType.info]: (
      <img
        src={`/${InfoIcon}`}
        alt="Info"
        height={ICON_SIZE}
        width={ICON_SIZE}
        color="#363BD3"
      />
    ),
  };

  const Icon = ICON_TYPES[type];

  const TYPE_STYLE = {
    [ToastType.info]: styles.toastInfo,
    [ToastType.success]: styles.toastSuccess,
    [ToastType.warning]: styles.toastWarning,
    [ToastType.error]: styles.toastError,
  };

  // Classes for position and type
  const topVisibleStlyes = visible ? styles.topVisible : styles.topHidden;
  const topStyles = clsx(styles.toastTop, topVisibleStlyes);

  const bottomVisibleStlyes = visible ? styles.bottomVisible : styles.bottomHidden;
  const bottomStyles = clsx(styles.toastBottom, bottomVisibleStlyes);

  const positionStyles = position === ToastPosition.top ? topStyles : bottomStyles;

  const typeStyle = TYPE_STYLE[type];

  const container = clsx(
    styles.toastContainer,
    positionStyles,
    typeStyle,
    containerStyle
  );

  const renderTitle = () => {
    if (typeof title === 'string') {
      return (
        <TextV3.CaptionStrong
          color={COLORS_ENUMS.BLACK}
          extraStyles={clsx(styles.title, titleStyle)}
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
    <div className={container}>
      <div className={styles.toastContent}>
        <div className={styles.iconContainer}>{Icon}</div>
        <div className={styles.textContainer}>
          {!!title && renderTitle()}
          {!!message1 && renderMessage1()}
          {!!message2 && renderMessage2()}
        </div>
        <div
          onClick={onClose}
          role="button"
          tabIndex={0}
          onKeyDown={onClose}
          className={styles.closeContainer}
        >
          <img src={`/${CloseIcon}`} alt="Close" height={CLOSE_SIZE} width={CLOSE_SIZE} />
        </div>
      </div>
    </div>
  );
};

export default Toast;
