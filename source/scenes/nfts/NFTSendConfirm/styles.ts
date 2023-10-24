import { StyleSheet } from 'react-native';
import { FONT_WEIGHTS, NEW_COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    flexGrow: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 8,
  },
  title: {
    fontWeight: FONT_WEIGHTS.semibold,
    marginTop: 8,
  },
  detailsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: NEW_COLORS.gray_300,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: NEW_COLORS.gray_300,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default styles;
