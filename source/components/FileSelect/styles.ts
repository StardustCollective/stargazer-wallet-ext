import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const buttonStyles = {
    width: 84,
    height: 24,
    border: `1px solid ${COLORS.gray_dark}`,
    borderRadius: 6,
    fontSize: 10,
    lineHeight: 24,
    color: COLORS.gray_dark,
    background: `${COLORS.gray_light_100}`,
    padding: 0,
    boxSizing: 'border-box',
    boxShadow: 'none',
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
  button: {
    ...buttonStyles,
    '&:hover': buttonStyles,
  },
  chosen: {
    color: COLORS.purple,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    marginLeft: 12,
    // whiteSpace: 'no-wrap', //throws error
    // textOverflow: 'ellipsis',
    flexWrap: 'wrap',
    overflow: 'hidden',
    maxWidth: 204,
  },
});

export default styles;
