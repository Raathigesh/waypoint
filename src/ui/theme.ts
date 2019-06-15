import { useContext } from "react";
import { ThemeContext } from "styled-components";

export interface ThemeColors {
  backgroundLight: string;
}
export interface Theme {
  colors: ThemeColors;
}

const DefaultTheme: Theme = {
  colors: {
    backgroundLight: "#ECF2F7"
  }
};

export default DefaultTheme;

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  return theme as Theme;
};

export const getThemeColors = () => {
  const theme = useTheme();
  return theme.colors;
};
