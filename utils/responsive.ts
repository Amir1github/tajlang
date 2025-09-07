import { Dimensions } from 'react-native';
import { ResponsiveDimensions } from '../types/chat';

export const getResponsiveDimensions = (): ResponsiveDimensions => {
  const { width, height } = Dimensions.get('window');
  const isTablet = width >= 768;
  const isDesktop = width >= 1200;
  const isLandscape = width > height;
  
  return {
    width,
    height,
    isTablet,
    isDesktop,
    isLandscape,
    headerPadding: isDesktop ? 12 : isTablet ? 16 : 16,
    contentPadding: isDesktop ? 16 : isTablet ? 20 : 16,
    fontSize: {
      large: isDesktop ? 20 : isTablet ? 24 : 20,
      medium: isDesktop ? 14 : isTablet ? 16 : 14,
      small: isDesktop ? 12 : isTablet ? 14 : 12,
      tiny: isDesktop ? 11 : isTablet ? 12 : 11,
    },
    spacing: {
      large: isDesktop ? 12 : isTablet ? 16 : 12,
      medium: isDesktop ? 8 : isTablet ? 12 : 8,
      small: isDesktop ? 6 : isTablet ? 8 : 6,
    },
    borderRadius: {
      large: isDesktop ? 12 : isTablet ? 16 : 12,
      medium: isDesktop ? 8 : isTablet ? 12 : 8,
      small: isDesktop ? 6 : isTablet ? 8 : 6,
    },
    messageMaxWidth: isDesktop ? '65%' : isTablet ? '70%' : '80%',
    chatListWidth: isTablet && isLandscape ? width * 0.4 : width,
    buttonHeight: isDesktop ? 32 : isTablet ? 36 : 36,
    inputHeight: isDesktop ? 36 : isTablet ? 40 : 40,
  };
};