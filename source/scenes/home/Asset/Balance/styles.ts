import { StyleSheet } from 'react-native';
import { FONT_WEIGHTS } from 'assets/styles/_variables.native';

const styles = StyleSheet.create({
  root: {
    borderWidth: 1,
    borderColor: '#B5B4E41F',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    
    // Shadow styles to match CSS box-shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 15,
    shadowOpacity: 0.1,
    elevation: 10, // For Android shadow
  },
  headerSection: {
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 6,
  },
  headerTitle: {
    color: '#FFFFFFA8',
    fontWeight: FONT_WEIGHTS.bold as any
  },
  contentSection: {
  },
  tokenAmount: {
    fontWeight: '500',
    letterSpacing: -0.8,
  },
  fiatAmount: {
    color: '#FFFFFFA8',
    marginTop: 4,
  },
  footerSection: {
    marginTop: 28,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 32,
  },
  buttonIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF14',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 6,
    elevation: 6,
    shadowOpacity: 0.1,
  },
  buttonLabel: {
    letterSpacing: -0.12,
  },
});

export default styles;
