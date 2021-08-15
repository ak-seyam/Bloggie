import { createContext } from "react";

/**
 * The theme context contains the theme postfix that is used in the component in this
 * application
 */
const ThemeContext = createContext({
  dark: false,
  themeChanger: () => {},
});

export default ThemeContext;
