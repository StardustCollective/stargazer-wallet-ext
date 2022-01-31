import React, { FC } from 'react';
import Link from 'components/Link';
import LogoImage from 'assets/images/logo.svg';

import styles from './Start.scss';
import TextV3, { TEXT_ALIGN_ENUM }  from 'components/TextV3';
import ButtonV3, {BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM} from 'components/ButtonV3';
import IStart from './types';

const Start: FC<IStart> = ({
  onImportClicked,
  onGetStartedClicked
}) => {

  return (
    <div className={styles.home}>
      <TextV3.HeaderLarge
        align={TEXT_ALIGN_ENUM.CENTER}
      >
        Welcome to Stargazer Wallet
      </TextV3.HeaderLarge>
      <img src={`/${LogoImage}`} className={styles.logo} alt="Stargazer" />
      <ButtonV3
        id={'start-getStartedButton'}
        type={BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID}
        size={BUTTON_SIZES_ENUM.LARGE}
        label={'Get Started'}
        extraStyle={styles.started}
        onClick={onGetStartedClicked}
      />
      <Link id="link" color="monotoneOne" onClick={onImportClicked}>
        Import from recovery seed phrase
      </Link>
    </div>
  );
};

export default Start;
