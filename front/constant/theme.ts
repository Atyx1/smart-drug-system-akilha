// src/constants/theme.ts

export const lightColors = {
  primary: "#3B6790",
  secondary: "#4C7B8B",
  accent: "#FFB200",
  success: "#4CAF50",
  error: "#FF3B30",
  warning: "#FFB200",

  successBackground: "rgba(76, 175, 80, 0.1)",
  errorBackground: "rgba(255, 59, 48, 0.1)",

  // Background colors
  background: {
    primary: "#FFFFFF",
    secondary: "#F5F5F5",
    tertiary: "#E7E7E7",
  },

  // Text colors
  text: {
    primary: "#3B6790",
    secondary: "#4C7B8B",
    tertiary: "#666666",
    inverse: "#FFFFFF",
  },

  // Border colors
  border: {
    primary: "#E0E0E0",
    secondary: "#F5F5F5",
  },

  // Component specific
  card: {
    background: "#FFFFFF",
    border: "#E0E0E0",
  },
  input: {
    background: "#F5F5F5",
    border: "#E0E0E0",
    text: "#3B6790",
    placeholder: "#999999",
  },
  modal: {
    background: "#FFFFFF",
    overlay: "rgba(0, 0, 0, 0.5)",
  },
};

export const darkColors = {
  primary: "#4A7AAC",
  secondary: "#5E8FA0",
  accent: "#FFB200",
  success: "#4CAF50",
  error: "#FF5252",
  warning: "#FFB200",

  successBackground: "rgba(76, 175, 80, 0.15)",
  errorBackground: "rgba(255, 82, 82, 0.15)",

  // Background colors
  background: {
    primary: "#121212",
    secondary: "#1E1E1E",
    tertiary: "#333333",
  },

  // Text colors
  text: {
    primary: "#FFFFFF",
    secondary: "#CCCCCC",
    tertiary: "#AAAAAA",
    inverse: "#121212",
  },

  // Border colors
  border: {
    primary: "#3D3D3D",
    secondary: "#2A2A2A",
  },

  // Component specific
  card: {
    background: "#1E1E1E",
    border: "#3D3D3D",
  },
  input: {
    background: "#2D2D2D",
    border: "#444444",
    text: "#FFFFFF",
    placeholder: "#999999",
  },
  modal: {
    background: "#1E1E1E",
    overlay: "rgba(0, 0, 0, 0.75)",
  },
};

// ============================================
//              FONTS, SPACING, SHADOWS, ETC.
// ============================================
export const FONTS = {
  size: {
    xs: "3%",
    sm: "3.5%",
    md: "4%",
    lg: "4.5%",
    xl: "5%",
    xxl: "6%",
  },
  weight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

export const SPACING = {
  xs: "1%",
  sm: "2%",
  md: "3%",
  lg: "4%",
  xl: "5%",
};

export const SHADOWS = {
  light: {
    small: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
  dark: {
    small: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 3.84,
      elevation: 4,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.4,
      shadowRadius: 3.84,
      elevation: 7,
    },
  },
};

export const COLORS = {
  primary: {
    main: "#3B6790",
    light: "#E3F2FD",
    dark: "#2C4E6C",
  },
  background: {
    primary: "#FFFFFF",
    secondary: "#F5F8FA",
    tertiary: "#E3F2FD",
  },
  text: {
    primary: "#2D3748",
    secondary: "#666666",
    tertiary: "#999999",
    inverse: "#FFFFFF",
  },
  border: {
    light: "#F0F0F0",
  },
};