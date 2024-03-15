import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  assetIcon: {
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
  },
  toggleContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  assetInfo: {
    flexGrow: 1,
    justifyContent: 'center',
    marginLeft: 12,
  },
});

export default styles;
