import { useContext } from "react";
import { ThemeContext } from "styled-components";

const getVariableValue = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name);

export interface ThemeColors {}
export interface Theme {
  colors: ThemeColors;
}

const DefaultTheme: Theme = {
  colors: {}
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
