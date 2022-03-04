import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingVertical: 0,
    paddingHorizontal: 24,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor: COLORS.gray_light_100,
    position: 'relative',
  },
  label: {
    fontSize: 10,
    fontWeight: '400',
    marginTop: 24,
    marginBottom: 12,
  },
  inputTextArea: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 24,
    minHeight: 90,
    paddingHorizontal: 10,
  },
  inputName: {
    fontSize: 14,
    paddingHorizontal: 10,
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 24,
    marginBottom: 0,
  },
  actions: {
    flex: 1,
    marginBottom: 24,
    paddingTop: 0,
    paddingVertical: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
  },
  cancel: {
    backgroundColor: COLORS.gray_light,
    color: COLORS.gray_dark,
  },
});

export default styles;
