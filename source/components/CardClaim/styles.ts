import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4C2FB1',
    marginBottom: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    color: '#4C2FB1',
  },
  dots: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: '#4C2FB1',
    borderRadius: 4,
  },
  image: {
    height: '100%',
    width: 73,
    borderRadius: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconHeader: {
    marginRight: 6,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 16,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  claimWindowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  infoIconContainer: {
    marginLeft: 2,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenText: {
    color: '#059669',
  },
  border: {
    borderBottomWidth: 0.3,
    borderBottomColor: 'lightgray',
  },
  itemKey: {
    fontWeight: '500',
  },
  itemValue: {
    fontWeight: '500',
    color: '#4C2FB1',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    height: 34,
  },
  buttonTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  claimButton: {
    flex: 1,
    marginRight: 6,
  },
  learnMoreButton: {
    flex: 1,
    marginLeft: 6,
  },
});

export default styles;
