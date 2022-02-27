import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: COLORS.grey_50,
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
  button:{
    marginRight: 10
  }
})

export default styles;