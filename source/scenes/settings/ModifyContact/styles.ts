import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingRight: 36,
    paddingLeft: 36,
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: COLORS.gray_light_100,
    flexGrow: 1,
  },
  inputWrapper: {
    padding: 0,
    paddingHorizontal: 0,
    position: 'relative',
    lineHeight: 24,
    marginBottom: -24,
  },
  input: {
    marginTop: 24,
    marginBottom: 24,
    marginRight: 0,
    marginLeft: 0,
    height: 40,
    lineHeight: 24,
  },
  inputWrap: {
    position: 'relative',
  },
  inputVerfied: {
    color: COLORS.purple,
    fontSize: 15,
    padding: 5,
    paddingLeft: 20,
  },
  statusIcon: {
    position: 'absolute',
    opacity: 1,
    top: 38,
    left: 15,
    zIndex: 1,
  },
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
    height: 60,
    marginTop: 24,
    marginBottom: 24,
    marginRight: 0,
    marginLeft: 0,
    lineHeight: 24,
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 100,
    justifyContent: 'space-between',
  },
  cancel: {
    backgroundColor: COLORS.gray_light,
    color: COLORS.gray_dark,
    width: 144,
    minWidth: 144,
    padding: 8,
  },
  cancelTitle: {
    color: COLORS.gray_dark,
    backgroundColor: COLORS.gray_light,
  },
  save: {
    width: 144,
    minWidth: 144,
    padding: 8,
  },
});

export default styles;
