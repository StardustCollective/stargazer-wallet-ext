import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.primary,
    overflow: 'scroll',
  },
  box: {
    width: '100%',
    backgroundColor: COLORS.grey_50,
    borderRadius: 8,
  },
  content: {
    margin: 16,
  },
  card: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  settingsItemIconWrapper: {
    display: 'flex',
    height: 47,
    width: 72,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    display: 'flex',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 24,
  },
  img: {
    width: 32,
    height: 32,
  },
  linkedIconImage: {
    width: 25,
    height: 25,
  },
  settingsItemLabelWrapper: {
    alignItems: 'center',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },
  footer__left: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 7,
  },
  footer__left_img: {
    marginRight: 10,
  },
  footer__right: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 7
  },
  footer__right_img: {
    marginLeft: 8,
  },
});

export default styles;
