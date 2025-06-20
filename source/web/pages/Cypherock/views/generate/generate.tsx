import React from 'react';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import { ReactComponent as CypherockCard } from 'assets/images/svg/cypherock-card.svg';
import styles from './styles.scss';

const GenerateAddressView = ({ text }: { text: string }) => {
  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <CypherockCard className={styles.cypherockCard} />
      </div>

      <TextV3.HeaderLargeRegular extraStyles={styles.text} align={TEXT_ALIGN_ENUM.CENTER}>
        {text}
      </TextV3.HeaderLargeRegular>
    </div>
  );
};

export default GenerateAddressView;
