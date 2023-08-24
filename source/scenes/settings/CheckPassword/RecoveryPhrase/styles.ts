import { StyleSheet } from 'react-native';
import { NEW_COLORS, COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  recoveryContainer: {
    flex: 1,
    marginTop: 32,
  },
  phraseContainer: {
    marginTop: 8,
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 12,
    flexWrap: 'wrap',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: NEW_COLORS.gray_300,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  phraseItem: {
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: NEW_COLORS.indigo_50,
    marginHorizontal: 4,
    marginVertical: 6,
  },
  phraseText: {
    fontWeight: FONT_WEIGHTS.medium,
  },
  copyContainer: {
    paddingVertical: 24,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  copyText: {
    color: NEW_COLORS.primary_lighter_1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 32,
  },
  doneButton: {
    backgroundColor: NEW_COLORS.primary,
  },
});

export default styles;
