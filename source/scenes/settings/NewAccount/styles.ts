import { StyleSheet, Platform } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  newAccount: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 36,
    paddingVertical: 0,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.gray_light_100,
    flexGrow: 1,
  },
  newAccountSubWrapper: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray_200,
    width: '100%',
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: COLORS.gray_200,
    borderStyle: 'solid',
    marginTop: 24,
    marginHorizontal: -10,
    marginBottom: -24,
    paddingHorizontal: 0,
  },
  actions: {
    marginTop: 50,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'space-evenly',
  },
  centered: {
    justifyContent: 'center',
  },
  button: {
    marginBottom: 20,
    marginHorizontal: Platform.OS === 'android' ? 16 : 0,
  },
});

export default styles;
