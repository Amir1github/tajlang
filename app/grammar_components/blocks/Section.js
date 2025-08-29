import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Section = ({ 
  title, 
  children, 
  titleStyle,
  containerStyle,
  introText,
  introStyle,
  isSmallPhone = false
}) => (
  <View style={[styles.section, containerStyle]}>
    <Text style={[
      styles.sectionTitle, 
      titleStyle, 
      { textAlign: isSmallPhone ? 'center' : 'left' }
    ]}>
      {title}
    </Text>
    {introText && (
      <Text style={[
        styles.introText, 
        introStyle, 
        { textAlign: isSmallPhone ? 'center' : 'left' }
      ]}>
        {introText}
      </Text>
    )}
    {children}
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  introText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

export default Section;