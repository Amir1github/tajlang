import { useRef, useEffect } from 'react';
import { Animated, Dimensions } from 'react-native';
import { getResponsiveDimensions } from '@/utils/responsive';

export const useAnimations = (showChatList: boolean) => {
  const dimensions = getResponsiveDimensions();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-dimensions.width)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;

  // Handle orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const newDimensions = getResponsiveDimensions();
      
      if (showChatList) {
        slideAnim.setValue(0);
      } else {
        slideAnim.setValue(-newDimensions.width);
      }
    });

    return () => subscription?.remove();
  }, [showChatList, slideAnim]);

  // Initial fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const toggleChatListAnimation = (show: boolean) => {
    const toValue = show ? 0 : -dimensions.chatListWidth;
    
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const showToastAnimation = () => {
    return Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]);
  };

  return {
    fadeAnim,
    slideAnim,
    toastAnim,
    toggleChatListAnimation,
    showToastAnimation
  };
};