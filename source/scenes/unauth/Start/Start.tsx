import React from 'react';
import Button from 'components/Button';
import Link from 'components/Link';
import LogoImage from 'assets/images/svg/stargazerLogoV3.svg';
import { useLinkTo } from '@react-navigation/native';
import styles from './Start.scss';
import TextV3, { TEXT_ALIGN_ENUM }  from 'components/TextV3';
import ButtonV3, {BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM} from 'components/ButtonV3';

const Start = () => {
  const linkTo = useLinkTo();

  const onImportClicked = () => {
    linkTo('/import');
  }

  const onGetStartedClicked = () => {
    linkTo('/create/pass');
  }

  return (
    <div className={styles.home}>
      <TextV3.HeaderLarge
        align={TEXT_ALIGN_ENUM.CENTER}
      >
        Welcome to Stargazer Wallet
      </TextV3.HeaderLarge>
      <img src={`/${LogoImage}`} className={styles.logo} alt="Stargazer" />
      <ButtonV3
        type={BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID}
        size={BUTTON_SIZES_ENUM.LARGE}
        label={'Get Started'}
        extraStyle={styles.started}
        onClick={onGetStartedClicked}
      />
      <Link color="monotoneOne" onClick={onImportClicked}>
        Import from recovery seed phrase
      </Link>
    </div>
  );
};

export default Start;
