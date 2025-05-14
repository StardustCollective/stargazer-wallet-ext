import React from 'react';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import styles from './styles.scss';
import { COLORS_ENUMS } from 'assets/styles/colors';

const ConfirmDetailsView = ({
  ethAddress,
  dagAddress,
}: {
  ethAddress: string;
  dagAddress: string;
}) => {
  return (
    <div className={styles.container}>
      <TextV3.Body color={COLORS_ENUMS.BLACK} align={TEXT_ALIGN_ENUM.CENTER}>
        {ethAddress}
      </TextV3.Body>
      <TextV3.Body color={COLORS_ENUMS.BLACK} align={TEXT_ALIGN_ENUM.CENTER}>
        {dagAddress}
      </TextV3.Body>
    </div>
  );
};

export default ConfirmDetailsView;
