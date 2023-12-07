import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  testnetsContainer: {
    marginTop: 16,
  },
  subtitle: {
    fontWeight: FONT_WEIGHTS.semibold,
    marginBottom: 8,
  },
  chainWrapper: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.gray_light_100,
  },
  chainInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 12,
  },
  chainLabelContainer: {
    flex: 1,
  },
  checkContainer: {
    justifyContent: 'center',
  },
  firstChild: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderTopWidth: 1,
  },
  lastChild: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  chainIconWrapper: {
    height: 36,
    width: 36,
    borderWidth: 1,
    borderColor: COLORS.gray_light_100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  chainIcon: {
    height: 24,
    width: 24,
  },
});

export default styles;
