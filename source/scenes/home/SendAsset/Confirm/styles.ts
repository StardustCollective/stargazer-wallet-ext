import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: COLORS.grey_light_100,
  },
  content: {
    marginHorizontal: 30,
  },
  confirm: {
    // flex: 1
  },
  header: {
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.gray_light,
    marginBottom: 10,
    paddingVertical: 10,
  },
  transcationFee: {
    paddingVertical: 20,
  },
  maxTotalSection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.gray_light,
  },
  maxTotalLabel: {
    flex: 1,
  },
  footer: {
    // flex: 1,
    // height: '100%',
    // backgroundColor: 'orange',
    // justifyContent: 'flex-',
    // alignItems: 'center',
  },
  footerButtons: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-evenly'
  },
  sendSuccessContent:{
    height: '100%',
    backgroundColor: COLORS.white,
  },
  button:{
    marginRight: 10
  },
  heading: {
    backgroundColor: COLORS.grey_light,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  checkIcon:{
    marginTop: 40,
    alignItems: 'center'
  },
  message: {
    paddingVertical: 30,
  },
  wrapper: {
    marginHorizontal: 30,
  },
  successButtonFooter:{

    justifyContent: 'flex-end',
    alignItems: 'center',
  }
})

export default styles;