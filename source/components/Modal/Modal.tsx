import React, { FC } from 'react';
import clsx from 'clsx';
import ModalMUI from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { IModal } from './types';
import styles from './Modal.scss';

const Modal: FC<IModal> = ({
  visible,
  children,
  containerStyle = {},
  onBackdropPress = undefined,
}) => {
  return (
    <ModalMUI
      open={visible}
      className={styles.modal}
      onClose={onBackdropPress}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={visible}>
        <div className={clsx(styles.content, containerStyle)}>{children}</div>
      </Fade>
    </ModalMUI>
  );
};

export default Modal;
