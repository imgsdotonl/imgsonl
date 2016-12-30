import { fade } from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';
import { lightGreen500, grey100, grey500, green500, green100, green700,
  darkBlack, white, grey300, grey900, fullBlack } from 'material-ui/styles/colors';

export const primary1Color = green500;
export const primary2Color = green700;
export const primary3Color = green100;
export const accent1Color = lightGreen500;
export const accent2Color = grey100;
export const accent3Color = grey500;
export const textColor = grey900;
export const alternateTextColor = white;
export const canvasColor = white;
export const borderColor = grey300;
export const disabledColor = fade(darkBlack, 0.3);
export const pickerHeaderColor = '#0376a3';
export const clockCircleColor = fade(darkBlack, 0.07);
export const shadowColor = fullBlack;

const materialStyle = {
  spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color,
    primary2Color,
    primary3Color,
    accent1Color,
    accent2Color,
    accent3Color,
    textColor,
    alternateTextColor,
    canvasColor,
    borderColor,
    disabledColor,
    pickerHeaderColor,
    clockCircleColor,
    shadowColor,
  },
};

export default materialStyle;
