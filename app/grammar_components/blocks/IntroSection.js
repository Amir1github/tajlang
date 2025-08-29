import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const IntroSection = ({ 
  title, 
  text, 
  fadeAnim,
  containerStyle,
  titleStyle,
  textStyle,
  isSmallPhone = false
}) => (
  <Animated.View style={[styles.introSection, containerStyle, { opacity: fadeAnim }]}>
    <Text style={[
      styles.introTitle, 
      titleStyle, 
      { textAlign: isSmallPhone ? 'center' : 'left' }
    ]}>
      {title}
    </Text>
    <Text style={[
      styles.introText, 
      textStyle, 
      { textAlign: isSmallPhone ? 'center' : 'left' }
    ]}>
      {text}
    </Text>
  </Animated.View>
);

const styles = StyleSheet.create({
  introSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  introText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
});

export default IntroSection;