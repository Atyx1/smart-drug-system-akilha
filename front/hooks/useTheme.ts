import { useColorScheme } from 'react-native';

const lightColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF2D55',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
    tertiary: '#E5E5EA',
  },
  text: {
    primary: '#000000',
    secondary: '#8E8E93',
    inverse: '#FFFFFF',
  },
  border: {
    primary: '#C6C6C8',
    secondary: '#E5E5EA',
  },
  modal: 'rgba(0, 0, 0, 0.5)',
};

const darkColors = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  accent: '#FF375F',
  success: '#30D158',
  warning: '#FFD60A',
  error: '#FF453A',
  background: {
    primary: '#000000',
    secondary: '#1C1C1E',
    tertiary: '#2C2C2E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#8E8E93',
    inverse: '#000000',
  },
  border: {
    primary: '#38383A',
    secondary: '#2C2C2E',
  },
  modal: 'rgba(0, 0, 0, 0.7)',
};

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  return { colors };
}; 