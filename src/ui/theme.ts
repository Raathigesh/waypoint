import { useContext } from "react";

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
