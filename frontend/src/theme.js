import { extendTheme } from "@chakra-ui/react";
import "@fontsource/josefin-sans";
import "@fontsource/josefin-sans/700.css";

const theme = extendTheme({
  colors: {
    background: "#FFFCF3",
    lightGreen: "#B2C3AC",
    middleGreen: "#9DB295",
    darkGreen: "#00524E",
    card: "#FFFDF6",
    beige: "#FEF8EB",
    heading: "#004643",
    text: "#556A4D",
  },
  fonts: {
    heading: "'Josefin Sans', sans-serif",
    body: "system-ui, sans-serif",
  },
  styles: {
    global: {
      body: {
        fontFamily: "system-ui, sans-serif",
      },
      h1: {
        fontFamily: "'Josefin Sans', sans-serif",
      },
      h2: {
        fontFamily: "'Josefin Sans', sans-serif",
      },
      // Add other heading levels if needed
    },
  },
  breakpoints: {
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
  },
});

export default theme;
