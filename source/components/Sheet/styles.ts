import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables.native';

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  sheet: {
    flex: 1,
    backgroundColor: COLORS.gray_light_300,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
  },
  headerContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  headerLabel: {
    flex: 1,
  },
  headerCloseButton: {
    height: '100%',
    paddingLeft: 32,
    paddingRight: 6,
    justifyContent: 'center',
  },
  headerColumnOne: {
    flex: 1,
    marginLeft: 9,
  },
  headerColumnTwo: {
    flex: 4,
    alignItems: 'center',
  },
  headerColumnThree: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  children: {
    flexGrow: 1,
    marginTop: 12,
  }
});

export default styles;