import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const QuoteSection = ({ 
  quote, 
  author, 
  fadeAnim,
  containerStyle,
  labelStyle,
  textStyle,
  isSmallPhone = false
}) => (
  <Animated.View style={[styles.quoteSection, containerStyle, { opacity: fadeAnim }]}>
    <Text style={[styles.quoteLabel, labelStyle, { textAlign: isSmallPhone ? 'center' : 'left' }]}>
      Inspirational Quote:
    </Text>
    <Text style={[styles.quoteText, textStyle, { textAlign: isSmallPhone ? 'center' : 'left' }]}>
      {quote} {author ? `- ${author}` : ''}
    </Text>
  </Animated.View>
);

const styles = StyleSheet.create({
  quoteSection: {
    backgroundColor: '#fef3c7',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  quoteLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 15,
    color: '#a16207',
    fontStyle: 'italic',
    lineHeight: 22,
  },
});

export default QuoteSection;