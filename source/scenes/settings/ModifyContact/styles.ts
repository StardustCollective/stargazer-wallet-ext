import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingRight: 36,
    paddingLeft: 36,
    paddingTop: 24,
    paddingBottom: 24,
  },
  input: {
    marginTop: 24,
    marginBottom: 24,
    marginRight: 0,
    marginLeft: 0,
  },
  inputWrap: {
    position: 'relative',
  },
  inputVerfied: {
    color: COLORS.purple,
    paddingLeft: 15,
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
    margin: '24 0',
    height: 60,
  },
  textareaText: {
    height: 56,
  },
  actions: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 56,
    justifyContent: 'space-between',
  },
  cancel: {
    backgroundColor: COLORS.gray_light,
    color: COLORS.gray_dark,
    width: 144,
    padding: 8,
  },
  save: {
    width: 144,
    padding: 8,
  },
});

export default styles;
