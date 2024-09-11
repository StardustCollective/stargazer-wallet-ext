import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS, NEW_COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 16,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: NEW_COLORS.gray_300,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  disabled: {
    opacity: 0.5,
  },
  firstChild: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  lastChild: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomWidth: 1,
  },
  contentContainer: {
    flex: 1,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconComponent: {
    marginRight: 12,
  },
  title: {
    color: NEW_COLORS.secondary_text,
    marginBottom: 8,
  },
  largeTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: FONT_WEIGHTS.medium,
  },
  smallTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FONT_WEIGHTS.medium,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: FONT_WEIGHTS.medium,
    color: NEW_COLORS.secondary_text,
  },
  labelRight: {
    marginRight: 4,
    lineHeight: 24,
    fontWeight: FONT_WEIGHTS.regular,
    color: NEW_COLORS.secondary_text,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default styles;
