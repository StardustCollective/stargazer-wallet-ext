import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
  },
  contacts: {
    flex: 1,
  },
  contactsContentContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  addContactLabel: {
    width: '100%',
    padding: 30,
    textAlign: 'center',
    flexGrow: 1,
    margin: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addContactText: {
    color: COLORS.black,
  },
  add: {
    padding: 8,
    width: 144,
  },
  export: {
    backgroundColor: COLORS.gray_light,
    color: `${COLORS.gray_dark} !important`,
    width: 144,
    padding: 8,
  },
  list: {
    margin: 0,
    padding: 0,
    width: '100%',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 84,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 36,
    paddingLeft: 36,
  },
  contact: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 12,
  },
  contactName: {
    color: COLORS.gray_dark,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
  },
  small: {
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.gray_100,
    marginTop: 4,
    width: 204,
    overflow: 'hidden',
  },
  avatar: {
    width: 14,
    height: 14,
    marginLeft: 2,
  },
});

export default styles;
