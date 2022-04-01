import { StyleSheet, Platform } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  content: {
    backgroundColor: COLORS.grey_50,
    flexGrow: 1,
    marginBottom: -50, // This line removes the margin bottom that's added in the Modal component. TODO: Look for a better solution.
  },
  header: {
    flexDirection: 'row',
    height: 65,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray_medium,
    alignItems: 'center',
  },
  headerWhiteSpace: {
    flex: 1,
    backgroundColor: 'orange',
  },
  headerLabel: {
    flex: 1,
    alignItems: 'center',
  },
  closeButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
  contacts: {
    flex: 1,
    backgroundColor: COLORS.gray_light_100,
  },
  contactsContentContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.gray_light_100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 24 : 64,
    paddingRight: 0,
    paddingLeft: 0,
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
    marginTop: 12,
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
