import { StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingTop: 24,
    paddingBottom: 24,
    paddingRight: 36,
    paddingLeft: 36,
    backgroundColor: COLORS.gray_light_100,
    flexGrow: 1,
  },
  qrCode: {
    position: 'absolute',
    width: 228,
    height: 264,
    backgroundColor: COLORS.white,
    border: `1px solid ${COLORS.gray_200}`,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    wordBreak: 'break-all',
    left: 66,
    top: 48,
    zIndex: 5,
    textAlign: 'center',
    padding: 24,
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.gray_100,
    opacity: 1,
    userSelect: 'none',
    pointerEvents: 'initial',
  },
  qrCodeHide: {
    opacity: 0,
  },
  codeText: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    color: COLORS.gray_dark,
  },
  section: {
    width: '100%',
    marginBottom: 48,
    display: 'flex',
    flexDirection: 'row',
    lineHeight: 24,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    color: COLORS.gray_dark,
    marginBottom: 14,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: COLORS.gray_dark_100,
    marginBottom: 14,
  },
  item: {
    width: '100%',
    marginBottom: 48,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: COLORS.gray_dark_100,
  },
  main: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    maxWidth: 204,
    marginBottom: 48,
    height: 56,
    overflow: 'hidden',
  },
  address: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  qrIcon: {
    height: 36,
    width: 36,
    display: 'flex',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButton: {
    backgroundColor: 'transparent',
    padding: 0,
    width: 36,
    height: 36,
  },
  actions: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 120,
    justifyContent: 'space-between',
  },
  delete: {
    backgroundColor: COLORS.gray_light,
    width: 144,
    padding: 8,
    fontSize: 14,
    border: `2px solid ${COLORS.gray_dark}`,
    boxShadow: SHADOWS.shadow_btn,
  },
  deleteTitleStyle: {
    color: COLORS.red,
    fontSize: 16,
    fontWeight: '500',
  },
  edit: {
    width: 144,
    padding: 8,
  },
  editTitleStyle: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default styles;