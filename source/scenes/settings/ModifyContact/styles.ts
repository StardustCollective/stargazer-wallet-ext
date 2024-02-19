import { StyleSheet, Platform } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingRight: 36,
    paddingLeft: 36,
    paddingBottom: 24,
    paddingTop: 24,
    backgroundColor: COLORS.gray_light_100,
    flexGrow: 1,
  },
  inputWrapper: {
    padding: 0,
    paddingHorizontal: 0,
    position: 'relative',
  },
  input: {
    marginBottom: 0,
    marginRight: 0,
    marginLeft: 0,
    height: 40,
    lineHeight: 24,
  },
  inputVerfied: {
    color: COLORS.purple,
    fontSize: 15,
  },
  statusIcon: {},
  hide: {
    opacity: 0,
  },
  textareaWrapper: {
    height: 60,
    paddingHorizontal: 0,
    margin: 0,
    width: '100%',
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: 0,
  },
  textareaText: {
    height: 100,
    marginRight: 0,
    marginLeft: 0,
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
  textAreaContainer: {
    margin: 0,
    width: '100%',
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: 0,
  },
  actions: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 100,
    marginBottom: 24,
    justifyContent: 'space-evenly',
  },
  cancel: {
    backgroundColor: COLORS.gray_light,
    color: COLORS.gray_dark,
    width: 144,
    minWidth: 144,
    padding: 8,
    marginRight: Platform.OS === 'android' ? 16 : 0,
  },
  cancelTitle: {
    color: COLORS.gray_dark,
    backgroundColor: COLORS.gray_light,
  },
  save: {
    width: 144,
    minWidth: 144,
    padding: 8,
    marginLeft: Platform.OS === 'android' ? 16 : 0,
  },
  qrCodeButton: {
    marginHorizontal: 5,
  },
});

export default styles;
