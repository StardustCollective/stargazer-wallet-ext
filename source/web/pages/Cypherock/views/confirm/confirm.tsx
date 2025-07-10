import type { IGetPublicKeysResult } from '@cypherock/sdk-app-evm';
import React from 'react';

import CopyIcon from 'assets/images/svg/copy.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';

import Menu from 'components/Menu';
import TextV3 from 'components/TextV3';

import { CONSTELLATION_LOGO, ETHEREUM_LOGO } from 'constants/index';

import { useCopyClipboard } from 'hooks/index';

import styles from './styles.scss';

type ConfirmDetailsProps = {
  walletName: string;
  ethPublicKeys: IGetPublicKeysResult;
  dagPublicKeys: IGetPublicKeysResult;
};

const ConfirmDetailsView = ({ walletName, ethPublicKeys, dagPublicKeys }: ConfirmDetailsProps) => {
  const [isDagCopied, copyDagAddress] = useCopyClipboard(1000);
  const [isEthCopied, copyEthAddress] = useCopyClipboard(1000);

  const dagMenuItems = [
    {
      containerStyle: styles.itemContainer,
      title: dagPublicKeys.addresses[0],
      titleStyles: styles.titleAddress,
      icon: CONSTELLATION_LOGO,
      iconSize: 24,
      iconContainerStyle: styles.iconContainerStyle,
      onClick: () => copyDagAddress(dagPublicKeys.addresses[0]),
      showArrow: false,
      rightIcon: !isDagCopied && <img src={`/${CopyIcon}`} alt="copy" />,
      rightIconContainerStyle: styles.rightIconContainerStyle,
      labelRight: isDagCopied ? 'Copied!' : '',
      labelRightStyles: styles.copiedLabel,
    },
  ];

  const ethMenuItems = [
    {
      containerStyle: styles.itemContainer,
      title: ethPublicKeys.addresses[0],
      titleStyles: styles.titleAddress,
      icon: ETHEREUM_LOGO,
      iconSize: 24,
      iconContainerStyle: styles.iconContainerStyle,
      onClick: () => copyEthAddress(ethPublicKeys.addresses[0]),
      showArrow: false,
      rightIcon: !isEthCopied && <img src={`/${CopyIcon}`} alt="copy" />,
      rightIconContainerStyle: styles.rightIconContainerStyle,
      labelRight: isEthCopied ? 'Copied!' : '',
      labelRightStyles: styles.copiedLabel,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.inputTitleContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.inputTitle}>
          Wallet name
        </TextV3.CaptionStrong>
      </div>
      <div className={styles.inputContainer}>
        <TextV3.LabelSemiStrong extraStyles={styles.walletText}>{walletName}</TextV3.LabelSemiStrong>
      </div>

      <Menu title="Your DAG address" titleStyles={styles.title} containerStyle={styles.menuContainer} items={dagMenuItems} />
      <Menu title="Your EVM address" titleStyles={styles.title} containerStyle={styles.menuContainer} items={ethMenuItems} />
    </div>
  );
};

export default ConfirmDetailsView;
