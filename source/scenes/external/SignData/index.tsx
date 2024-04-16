import React from 'react';
import clsx from 'clsx';
import queryString from 'query-string';
import { browser } from 'webextension-polyfill-ts';
import { useController } from 'hooks/index';
import styles from './index.module.scss';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';

const SignData = () => {
  const controller = useController();

  const current = controller.dapp.getCurrent();
  const origin = current && current.origin;

  const { data: stringData, windowId } = queryString.parse(window.location.search);

  const {
    dataEncoded,
    chainLabel,
    walletLabel,
  }: {
    dataEncoded: string;
    chainLabel: string;
    walletLabel: string;
  } = JSON.parse(stringData as string);

  // Decode base64 data
  let dataDecoded = window.atob(dataEncoded);
  let message = dataDecoded;

  try {
    // Try to parse and check if it's a JSON object
    const parsedData = JSON.parse(dataDecoded);
    if (parsedData) {
      // Pretty-print JSON object
      message = JSON.stringify(parsedData, null, 4);
    }
  } catch (err) {
    // Decoded data is not a valid JSON
    console.log('data to parse is not valid JSON');
    message = dataDecoded;
  }

  const onNegativeButtonClick = async () => {
    const background = await browser.runtime.getBackgroundPage();
    const cancelEvent = new CustomEvent('dataSigned', {
      detail: { windowId, result: false },
    });

    background.dispatchEvent(cancelEvent);
    window.close();
  };

  const onPositiveButtonClick = async () => {
    const signature = await controller.stargazerProvider.signData(dataEncoded);
    const background = await browser.runtime.getBackgroundPage();

    const signatureEvent = new CustomEvent('dataSigned', {
      detail: {
        windowId,
        result: true,
        signature: {
          hex: signature,
          dataEncoded,
        },
      },
    });

    background.dispatchEvent(signatureEvent);
    window.close();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <img src={current.logo} className={styles.logo} alt="site logo" />
        </div>
        <div className={styles.siteContainer}>
          <TextV3.CaptionStrong extraStyles={styles.site}>{origin}</TextV3.CaptionStrong>
        </div>
        <div className={styles.titleContainer}>
          <TextV3.BodyStrong extraStyles={styles.title}>
            Sign Data Transaction
          </TextV3.BodyStrong>
        </div>
      </div>
      <div className={styles.content}>
        <div className={clsx(styles.infoContainer, styles.box)}>
          <div className={styles.infoItem}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
              Network:
            </TextV3.CaptionStrong>
            <TextV3.CaptionRegular extraStyles={styles.value}>
              {chainLabel}
            </TextV3.CaptionRegular>
          </div>
          <div className={clsx(styles.infoItem, styles.wallet)}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
              Wallet:
            </TextV3.CaptionStrong>
            <TextV3.CaptionRegular extraStyles={styles.value}>
              {walletLabel}
            </TextV3.CaptionRegular>
          </div>
        </div>
        <div className={clsx(styles.txData, styles.box)}>
          <div>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
              Transaction data:
            </TextV3.CaptionStrong>
          </div>
          <div className={styles.messageContainer}>
            <TextV3.CaptionRegular extraStyles={styles.message}>
              {message}
            </TextV3.CaptionRegular>
          </div>
        </div>
        <div className={clsx(styles.infoContainer, styles.box)}>
          <div className={styles.infoItem}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>Fee:</TextV3.CaptionStrong>
            <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK}>
              0 DAG {` `}
              <TextV3.CaptionRegular extraStyles={styles.value}>
                ≈ $0.00 USD
              </TextV3.CaptionRegular>
            </TextV3.CaptionRegular>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.note}>
          <TextV3.Caption color={COLORS_ENUMS.RED}>
            Only approve transactions from sites you trust.
          </TextV3.Caption>
        </div>
        <div className={styles.buttons}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
            size={BUTTON_SIZES_ENUM.MEDIUM}
            label="Reject"
            extraStyle={styles.secondary}
            onClick={onNegativeButtonClick}
          />
          <ButtonV3
            type={BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID}
            size={BUTTON_SIZES_ENUM.MEDIUM}
            label="Sign and Approve"
            onClick={onPositiveButtonClick}
          />
        </div>
      </div>
    </div>
  );
};

export default SignData;
