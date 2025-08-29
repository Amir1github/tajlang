import React from 'react';
import { View, StyleSheet } from 'react-native';
import ExampleCard from './ExampleCard';

const ExamplesSection = ({ 
  examples, 
  fadeAnim,
  containerStyle,
  cardStyle,
  ruleStyle,
  englishStyle,
  tajikStyle,
  pronunciationStyle,
  showRule = true
}) => (
  <View style={[styles.examplesContainer, containerStyle]}>
    {examples.map((item, index) => (
      <ExampleCard
        key={index}
        item={item}
        index={index}
        fadeAnim={fadeAnim}
        cardStyle={cardStyle}
        ruleStyle={ruleStyle}
        englishStyle={englishStyle}
        tajikStyle={tajikStyle}
        pronunciationStyle={pronunciationStyle}
        showRule={showRule}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  examplesContainer: {
    paddingHorizontal: 16,
  },
});

export default ExamplesSection;