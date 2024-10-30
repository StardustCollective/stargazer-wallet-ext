import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9584eb',
    marginBottom: 8,
    flexDirection: 'row',
  },
  close: {
    position: 'absolute',
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    right: 0,
    top: 0,
    borderTopRightRadius: 7,
    zIndex: 1,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: '#9584eb',
    borderRadius: 4,
  },
  image: {
    height: 140,
    width: 98,
    borderRadius: 4,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  titleContainer: {
    marginBottom: 4,
  },
  info: {
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: 'lightgray',
    paddingVertical: 2,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  itemKey: {
    fontWeight: '500',
  },
  itemValue: {
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    height: 32,
    minWidth: 80,
  },
  buttonTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  claimButton: {
    flex: 1,
    marginRight: 4,
  },
  learnMoreButton: {
    flex: 1,
    marginLeft: 4,
  },
});

export default styles;
