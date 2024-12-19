import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 15,
    elevation: 15,
    shadowOpacity: 1,
  },
  positionBottom: {
    bottom: 0,
  },
  positionTop: {
    top: 0,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  textContainer: {
    flex: 1,
  },
  closeContainer: {
    position: 'absolute',
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
    right: 0,
    top: 0,
    borderTopRightRadius: 8,
  },
});

export default styles;
