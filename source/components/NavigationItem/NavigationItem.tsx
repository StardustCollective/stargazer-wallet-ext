import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import Card from 'components/Card';
import ArrowRightIcon from 'assets/images/svg/arrow-rounded-right.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './NavigationItem.scss';

export type INavigationItemProps = {
  id: string;
  label: string;
  IconImageOrComponent: FC | string;
  onClick: () => void;
  imageStyles?: string;
  disabled?: boolean;
};

const NavigationItem = ({
  id,
  label,
  IconImageOrComponent,
  onClick,
  imageStyles,
  disabled,
}: INavigationItemProps) => {
  return (
    <Card id={id} key={id} onClick={onClick} disabled={disabled} style={styles.card}>
      <div className={styles.iconContainer}>
        <div className={styles.iconCircle}>
          <img src={'/' + IconImageOrComponent} className={imageStyles} />
        </div>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.labelContainer}>
          <TextV3.BodyStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.label}>
            {label}
          </TextV3.BodyStrong>
        </div>
        <div className={styles.arrowRightContainer}>
          <img src={`/${ArrowRightIcon}`} />
        </div>
      </div>
    </Card>
  );
};

export default React.memo(NavigationItem);
