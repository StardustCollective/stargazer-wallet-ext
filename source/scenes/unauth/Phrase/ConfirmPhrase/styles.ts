import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';
import { getDeviceId } from 'react-native-device-info';

const BUTTON_TITLE_FONT_SIZE = getDeviceId().includes('iPod') ? 12 : 15;

const styles = StyleSheet.create({
  section: {
    height: 133,
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sectionBorder: {
    borderBottomWidth: 1,
    borderColor: COLORS.grey_light,
  },
  wordButton: {
    minWidth: 0,
    width: getDeviceId().includes('iPod') ? 60 : 78,
    height: 35,
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 5,
    paddingHorizontal: 0,
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordButtonText: {
    color: COLORS.white,
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0.03,
  },
  wordButtonPurpleLight: {
    backgroundColor: COLORS.purple_light,
  },
  wordButtonTitleIdle: {
    fontSize: BUTTON_TITLE_FONT_SIZE,
  },
  wordButtonTitle: {
    color: COLORS.purple,
    fontSize: BUTTON_TITLE_FONT_SIZE,
  },
  wordButtonPressed: {
    backgroundColor: COLORS.grey_dark,
    fontSize: BUTTON_TITLE_FONT_SIZE,
  },
  wordButtonSelected: {
    backgroundColor: COLORS.grey_light,
    fontSize: BUTTON_TITLE_FONT_SIZE,
  },
  wordButtonSelectedTitle: {
    color: COLORS.grey_dark,
    fontSize: BUTTON_TITLE_FONT_SIZE,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  readyContainer: {
    alignItems: 'center',
  },
  checkIcon: {
    marginBottom: 40,
  },
  contentContainer: {
    flexGrow: 1,
  },
  nextButton: {
    marginTop: 30,
  },
});

export default styles;
