import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  assetIcon: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  subtitleContainer: {
    flexDirection: 'row',
  },
  imageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.16)',
  },
  networkIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    right: -4,
    bottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.16)',
    backgroundColor: 'white',
  },
  toggleContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  assetInfo: {
    flexGrow: 1,
    justifyContent: 'center',
    marginLeft: 16,
  },
});

export default styles;
