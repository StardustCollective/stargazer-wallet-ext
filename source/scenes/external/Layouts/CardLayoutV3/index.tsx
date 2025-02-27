import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import styles from './index.scss';

type ICardLayoutV3Props = {
  logo: string;
  title: string;
  subtitle: string;
  negativeButtonLabel?: string;
  positiveButtonLabel?: string;
  isPositiveButtonDisabled?: boolean;
  children: React.ReactChild | React.ReactChild[];
  onNegativeButtonClick: () => void;
  onPositiveButtonClick: () => void;
};

const CardLayoutV3: FC<ICardLayoutV3Props> = ({
  logo,
  title,
  subtitle,
  negativeButtonLabel = 'Reject',
  positiveButtonLabel = 'Approve',
  isPositiveButtonDisabled = false,
  children,
  onNegativeButtonClick,
  onPositiveButtonClick,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={logo} className={styles.logo} />
        <div className={styles.titleContainer}>
          <TextV3.LabelSemiStrong extraStyles={styles.title}>
            {title}
          </TextV3.LabelSemiStrong>
          <TextV3.Caption extraStyles={styles.subtitle}>{subtitle}</TextV3.Caption>
        </div>
      </div>

      <div className={styles.content}>{children}</div>

      <div className={styles.actions}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
          size={BUTTON_SIZES_ENUM.MEDIUM}
          extraStyle={styles.button}
          label={negativeButtonLabel}
          onClick={onNegativeButtonClick}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID}
          size={BUTTON_SIZES_ENUM.MEDIUM}
          label={positiveButtonLabel}
          onClick={onPositiveButtonClick}
          disabled={isPositiveButtonDisabled}
        />
      </div>
    </div>
  );
};

export default CardLayoutV3;
