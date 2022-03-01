import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const buttonStyles = {
  width: 84,
  height: 24,
  borderWidth: 1,
  borderColor: COLORS.gray_dark,
  borderRadius: 6,
  backgroundColor: `${COLORS.gray_light_100}`,
  padding: 0,
  minWidth: 84,
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  file: {
    display: 'none',
  },
  buttonTitle: {
    fontSize: 10,
    color: COLORS.gray_dark,
    width: 84,
  },
  button: {
    ...buttonStyles,
  },
  chosen: {
    color: COLORS.purple,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    marginLeft: 12,
    flexWrap: 'wrap',
    overflow: 'hidden',
    maxWidth: 204,
  },
});

export default styles;
