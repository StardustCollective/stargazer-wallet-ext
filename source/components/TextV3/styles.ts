import { StyleSheet } from 'react-native';
import { FONTS, FONT_WEIGHTS, COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  base: {
    fontFamily: FONTS.rubik,
    overflow: "hidden",
  },
  headerDisplay: {
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: 49,
    lineHeight: 64,
  },
  headerLarge: {
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: 32,
    lineHeight: 48,
  },
  headerLargeRegular: {
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: 32,
    lineHeight: 48,
  },
  header: {
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: 24,
    lineHeight: 32,
  },
  body: {
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: 18,
    lineHeight: 24,
  },
  bodyStrong: {
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: 18,
    lineHeight: 24,
  },
  caption: {
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: 14,
    lineHeight: 20
  },
  captionStrong: {
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  alignLeft: {
    textAlign: 'left'
  },
  alignCenter: {
    textAlign: 'center'
  },
  alignRight: {
    textAlign: 'right'
  },
  whiteFont: {
    color: COLORS.white
  },
  blackFont: {
    color: COLORS.black
  }
});

export default styles;


/*
* Text Alignment
*/

// .alignLeft {
//   text-align: left;
// }

// .alignCenter {
//   text-align: center;
// }

// .alignRight {
//   text-align: right;
// }

