import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const ExampleCard = ({ 
  item, 
  index, 
  fadeAnim,
  cardStyle,
  ruleStyle,
  englishStyle,
  tajikStyle,
  pronunciationStyle,
  showRule = true
}) => (
  <Animated.View
    style={[
      styles.exampleCard,
      cardStyle,
      {
        opacity: fadeAnim,
        transform: [{
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          })
        }]
      }
    ]}
  >
    {showRule && item.rule && (
      <Text style={[styles.grammarRule, ruleStyle]}>{item.rule}</Text>
    )}
    {showRule && item.type && (
      <Text style={[styles.grammarRule, ruleStyle]}>{item.type}</Text>
    )}
    <Text style={[styles.englishExample, englishStyle]} numberOfLines={3} adjustsFontSizeToFit>
      {item.english}
    </Text>
    <Text style={[styles.tajikExample, tajikStyle]} numberOfLines={3} adjustsFontSizeToFit>
      {item.tajik}
    </Text>
    <Text style={[styles.pronunciationExample, pronunciationStyle]} numberOfLines={3} adjustsFontSizeToFit>
      {item.pronunciation}
    </Text>
  </Animated.View>
);

const styles = StyleSheet.create({
  exampleCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  grammarRule: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    textAlign: 'left',
  },
  englishExample: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'left',
  },
  tajikExample: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 4,
    textAlign: 'left',
  },
  pronunciationExample: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'left',
  },
});

export default ExampleCard;