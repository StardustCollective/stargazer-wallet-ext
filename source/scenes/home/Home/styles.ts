import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  fiatBalanceContainer: {
    width: '100%',
    // height: 193, // do not use percentages messes up scrollview
    alignItems: 'center',
    paddingTop: 24,
  },
  fiatBalance: {
    maxWidth: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  fiatBalanceLabel: {
    marginHorizontal: 8,
  },
  fiatType: {
    fontSize: 20,
    lineHeight: 28,
  },
  bitcoinBalance: {
    opacity: 0.66,
    marginTop: 8,
  },
  balanceText: {
    fontSize: 16,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButton: {
    marginVertical: 32,
  },
  // TODO-421: Remove when Mainnet 2.0 is available 
  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalView: {
    margin: 16,
    marginTop: 130,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginTop: 12,
    marginBottom: 32,
  }
});

export default styles;
