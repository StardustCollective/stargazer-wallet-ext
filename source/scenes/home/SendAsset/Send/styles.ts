import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  layout: {
    backgroundColor: COLORS.grey_light_100,
    flexGrow: 1,
  },
  content: {
    flex: 1,
    marginHorizontal: 16,
  },
  balance: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 16,
  },
  form: {},
  input: {
    marginBottom: 0,
  },
  inputRightIcon: {
    marginHorizontal: 15,
    color: 'orange',
  },
  estimate: {
    marginBottom: 20,
  },
  error: {
    marginBottom: 20,
  },
  gasSettings: {
    marginTop: 0,
    backgroundColor: COLORS.gray_light,
    padding: 5,
    borderRadius: 10,
  },
  gasSettingsLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gasSettingInputContainer: {
    backgroundColor: COLORS.white,
    width: 110,
    height: 30,
    borderRadius: 10,
    padding: 6,
    marginTop: 10,
    borderWidth: 1,
  },
  gasSettingInputText: {
    fontSize: 14,
  },
  gasSettingLabelLeft: {
    flex: 1,
  },
  gasSettingLabelRight: {
    paddingTop: 10,
  },
  gasSettingsSlider: {},
  gasSettingsEstimate: {
    marginTop: 20,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  footerButtons: {
    flexDirection: 'row',
    marginVertical: 24,
    justifyContent: 'space-evenly',
  },
  button: {
    marginRight: 10,
  },
  qrCodeButton: {
    marginLeft: 10,
  },
  recipientButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
