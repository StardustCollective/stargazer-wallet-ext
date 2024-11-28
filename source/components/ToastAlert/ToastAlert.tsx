import React, { FC } from 'react';
import clsx from 'clsx';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import WarningIcon from 'assets/images/svg/warning-circle.svg';
import styles from './ToastAlert.scss';

interface IAlertTemplate {
  close: () => void;
  message: any;
  options: any;
  style: any;
}

const ToastAlert: FC<IAlertTemplate> = ({ message, options, style, close }) => {
  return (
    <div
      className={clsx(styles.toast, {
        [styles.error]: options.type === 'error',
      })}
      style={{
        ...style,
        marginBottom: '80px',
        textAlign: 'left',
      }}
      onClick={close}
    >
      {/* {options.type === 'info' && <InfoIcon style={{ fontSize: '15px' }} />} */}
      {/* {options.type === 'success' && <SuccessIcon />} */}
      {options.type === 'error' && (
        <img src={`/${WarningIcon}`} className={styles.icon} />
      )}
      <TextV3.CaptionRegular color={COLORS_ENUMS.WHITE} extraStyles={styles.message}>
        {message}
      </TextV3.CaptionRegular>
    </div>
  );
};

export default ToastAlert;
