import React, { FC } from 'react';
import { View } from 'react-native';
import TextV3 from 'components/TextV3';
import Card from 'components/Card';
import ArrowRightIcon from 'assets/images/svg/arrow-rounded-right.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

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
  disabled = false,
}: INavigationItemProps) => {
  const disabledStyle = disabled ? styles.disabled : {};
  return (
    <Card
      id={id}
      onClick={onClick}
      disabled={disabled}
      disabledStyle={disabledStyle}
      style={styles.card}
    >
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <IconImageOrComponent />
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.labelContainer}>
          <TextV3.BodyStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.label}>
            {label}
          </TextV3.BodyStrong>
        </View>
        <View style={styles.arrowRightContainer}>
          <ArrowRightIcon width={24} />
        </View>
      </View>
    </Card>
  );
};

export default React.memo(NavigationItem);
