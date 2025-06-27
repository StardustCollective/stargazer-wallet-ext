import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  box: {
    width: '100%',
  },
  content: {
    margin: 16,
    marginBottom: 10,
  },
  footer: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    margin: 16,
  },
  footer_section: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer__left: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 7,
  },
  footer__left_img: {
    marginRight: 10,
  },
  footer__right: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 7,
  },
  footer__right_img: {
    marginLeft: 8,
  },
});

export default styles;
