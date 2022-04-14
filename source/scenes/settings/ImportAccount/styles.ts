import { StyleSheet, Platform } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  import: {
    width: '100%',
    height: 468,
    position: 'relative',
    paddingHorizontal: 36,
    paddingVertical: 24,
    backgroundColor: COLORS.gray_light_100,
    flexGrow: 1,
  },
  generated: {
    paddingBottom: 36,
    width: '100%',
    flexGrow: 1,
    position: 'relative',
  },
  textMargin: {
    marginBottom: 24,
    display: 'flex',
  },
  error: {
    fontWeight: '500',
    color: COLORS.red_100,
  },
  address: {
    width: '100%',
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray_200,
    borderRadius: 6,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0.03,
    color: COLORS.gray_dark,
  },
  copied: {
    backgroundColor: COLORS.purple_medium,
    color: COLORS.purple,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  actionsAddress: {
    // left: 0,
    justifyContent: 'center',
  },
  warning: {
    width: '100%',
    height: 96,
    backgroundColor: COLORS.purple_light,
    paddingVertical: 24,
    paddingHorizontal: 36,
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.black,
    // wordWrap: 'break-word',
  },
  small: {
    color: COLORS.purple,
    fontWeight: '500',
    lineHeight: 18,
    fontSize: 12,
  },
  content: {
    paddingVertical: 24,
  },
  selectText: {
    marginBottom: 12,
    fontWeight: '400',
  },
  select: {
    zIndex: 1000, //dropdown to hover over
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 24,
  },
  descriptionText: {
    marginTop: 16,
    marginBottom: 16,
  },
  inner: {
    width: 156,
    marginLeft: 12,
  },
  span: {
    marginTop: 0,
  },
  textareaWrapper: {
    height: 60,
  },
  textarea: {
    height: 58,
  },

  // for hardware import step1
  hardwareList: {
    display: 'flex',
  },
  walletModel: {
    backgroundColor: COLORS.white,
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.gray_200,
    borderRadius: 6,
  },
  // for hardware import step2
  walletList: {
    display: 'flex',
    position: 'relative',
    height: 180,
    backgroundColor: COLORS.white,
    borderRadius: 6,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: COLORS.purple,
    width: 24,
    // -webkit-animation: spin 4s linear infinite,
    // -moz-animation: spin 4s linear infinite,
    // animation: spin 2s linear infinite,
  },
  iconSpan: {
    position: 'absolute',
    top: 127,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
  },
  wallet: {
    width: '100%',
    paddingTop: 2,
    paddingRight: 12,
    paddingBottom: 0,
    paddingLeft: 11,
  },
  table: {
    width: '100%',
  },
  row: {
    height: 33,
  },
  expand: {
    color: COLORS.gray_light_100,
  },
  svg: {
    width: 16,
  },
  pagination: {
    padding: 12,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  paginationText: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 10,
    lineHeight: 24,
    color: COLORS.purple,
  },
  previous: {
    marginRight: 12,
  },
  textSpan: {
    marginVertical: 18,
    marginHorizontal: 0,
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray_dark,
  },
  actions: {
    marginBottom: 24,
    marginTop: 24,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    flex: 1,
  },
  button: {
    marginHorizontal: Platform.OS === 'android' ? 16 : 0,
  },
});

export default styles;
