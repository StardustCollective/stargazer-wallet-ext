import React, { FC, memo, useState } from 'react';
import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import IconDropdown from 'components/IconDropdown';
import DotsIcon from 'assets/images/svg/dots-horizontal.svg';
import DiamondIcon from 'assets/images/svg/diamond.svg';
import ViewOffIcon from 'assets/images/svg/view-off.svg';
import { ELPACA_LARGE_LOGO } from 'constants/index';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { IIconDropdownOptions } from 'components/IconDropdown/types';
import ICardClaim from './types';
import styles from './CardClaim.scss';
import {
  DOTS_SIZE,
  HIDE_SIZE,
  WHATS_NEW,
  PACA_EMOJI,
  TITLE,
  TOTAL_CLAIMED,
  CLAIM_NOT_AVAILABLE,
  REWARDS_ENDED,
  THANKS,
} from './constants';

const CardClaim: FC<ICardClaim> = ({ totalEarned, handleWhatsNext, handleHideCard }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const options: IIconDropdownOptions = {
    icon: <img src={`/${DotsIcon}`} height={DOTS_SIZE} width={DOTS_SIZE} />,
    items: [
      {
        id: 'hide-paca-card',
        label: 'Hide PACA card',
        icon: <img src={`/${ViewOffIcon}`} height={HIDE_SIZE} width={HIDE_SIZE} />,
        onPressItem: handleHideCard,
      },
    ],
    isOpen: isMenuOpen,
    onPress: () => setIsMenuOpen(!isMenuOpen),
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title}>
            <TextV3.LabelSemiStrong extraStyles={styles.titleText}>
              {TITLE}
            </TextV3.LabelSemiStrong>
          </div>
          <IconDropdown options={options} />
        </div>

        <div className={styles.claimContent}>
          <div className={styles.image}>
            <img src={ELPACA_LARGE_LOGO} className={styles.logo} />
          </div>
          <div className={styles.info}>
            {totalEarned !== null && (
              <div className={styles.item}>
                <TextV3.Caption
                  color={COLORS_ENUMS.SECONDARY_TEXT}
                  extraStyles={styles.key}
                >
                  {TOTAL_CLAIMED}
                </TextV3.Caption>
                <TextV3.Caption
                  color={COLORS_ENUMS.PRIMARY_LIGHTER_1}
                  extraStyles={styles.value}
                >
                  {totalEarned}
                  {` `}
                  {PACA_EMOJI}
                </TextV3.Caption>
              </div>
            )}
            <div className={styles.card}>
              <div className={styles.cardTitleContainer}>
                <TextV3.CaptionStrong extraStyles={styles.cardTitle}>
                  {CLAIM_NOT_AVAILABLE}
                </TextV3.CaptionStrong>
                <img src={`/${DiamondIcon}`} height={16} width={16} />
              </div>
              <div className={styles.cardTextContainer}>
                <TextV3.CaptionRegular extraStyles={styles.cardText}>
                  {REWARDS_ENDED}
                </TextV3.CaptionRegular>
                <TextV3.CaptionRegular extraStyles={styles.cardText}>
                  {THANKS}
                </TextV3.CaptionRegular>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <ButtonV3
          extraStyle={styles.button}
          extraTitleStyles={styles.buttonText}
          type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
          size={BUTTON_SIZES_ENUM.SMALL}
          label={WHATS_NEW}
          onClick={handleWhatsNext}
        />
      </div>
    </div>
  );
};

export default memo(CardClaim);
