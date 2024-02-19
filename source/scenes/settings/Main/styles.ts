import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  main: {
    overflow: 'scroll',
    flex: 1,
    flexDirection: 'column',
  },
  box: {
    width: '100%',
  },
  content: {
    margin: 16,
    marginBottom: 10,
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
  label: {
    fontSize: 16,
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
    marginLeft: 16,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  arrowRightContainer: {
    justifyContent: 'center',
    marginRight: 8,
  },
  footer: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    margin: 16,
  },
  footer_section: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginBottom: 7,
  },
  footer__right_img: {
    marginLeft: 8,
  },
  disabled: {
    backgroundColor: COLORS.grey_100,
  },
});

export default styles;
