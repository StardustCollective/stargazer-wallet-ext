import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: COLORS.grey_light_100,
  },
  content: {
    marginHorizontal: 30,
    backgroundColor: COLORS.grey_light_100,
  },
  confirm: {},
  header: {
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.grey_light,
    marginBottom: 10,
    paddingVertical: 10,
  },
  transcationFee: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
  transcationFeeText: {
    flex: 1,
  },
  transcationFeePrice: {
    flex: 1,
  },
  maxTotalSection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.grey_light,
  },
  maxTotalLabel: {
    flex: 1,
  },
  footer: {
    backgroundColor: COLORS.grey_light_100,
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  footerButtons: {
    flexDirection: 'row',
    marginVertical: 24,
    justifyContent: 'space-evenly',
  },
  sendSuccessContent: {
    height: '100%',
    backgroundColor: COLORS.white,
  },
  button: {
    marginRight: 10,
  },
  heading: {
    backgroundColor: COLORS.grey_light,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  checkIcon: {
    marginTop: 40,
    alignItems: 'center',
  },
  message: {
    paddingVertical: 30,
  },
  wrapper: {
    marginHorizontal: 30,
  },
  successButtonFooter: {
    backgroundColor: COLORS.white,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalContent: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  modalTitle: {
    marginBottom: 12,
  },
  modalDescription: {
    marginBottom: 12,
  },
  textBold: {
    fontWeight: '600',
  },
  modalButton: {
    marginTop: 24,
    width: '100%',
  },
});

export default styles;
