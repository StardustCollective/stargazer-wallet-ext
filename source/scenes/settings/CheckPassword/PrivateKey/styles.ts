import { StyleSheet } from 'react-native';
import { NEW_COLORS, COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  privateKeyContainer: {
    flex: 1,
    marginTop: 32,
  },
  dropdownContainer: {
    height: 64,
    marginBottom: 24,
    marginTop: 8,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 32,
  },
  extraButtonContainer: {
    width: '100%',
  },
  extraButtonStyles: {
    width: 170,
    marginHorizontal: 6,
  },
});

export default styles;
