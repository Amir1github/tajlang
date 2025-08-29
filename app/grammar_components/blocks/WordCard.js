import React from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';

const WordCard = ({ 
  item, 
  index, 
  showImage = true, 
  fadeAnim,
  cardStyle,
  imageStyle,
  englishStyle,
  tajikStyle,
  pronunciationStyle
}) => (
  <Animated.View
    style={[
      styles.wordCard,
      cardStyle,
      {
        opacity: fadeAnim,
        transform: [{
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })
        }]
      }
    ]}
  >
    {showImage && item.image && (
      <Image
        source={{ uri: `https://learn101.org/images/${item.image}` }}
        style={[styles.wordImage, imageStyle]}
        resizeMode="contain"
      />
    )}
    <Text style={[styles.englishWord, englishStyle]} numberOfLines={2} adjustsFontSizeToFit>
      {item.english}
    </Text>
    <Text style={[styles.tajikWord, tajikStyle]} numberOfLines={2} adjustsFontSizeToFit>
      {item.tajik}
    </Text>
    <Text style={[styles.pronunciation, pronunciationStyle]} numberOfLines={2} adjustsFontSizeToFit>
      {item.pronunciation}
    </Text>
  </Animated.View>
);

const styles = StyleSheet.create({
  wordCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
    minHeight: 160,
    justifyContent: 'center',
  },
  wordImage: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  englishWord: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center',
  },
  tajikWord: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 4,
    textAlign: 'center',
  },
  pronunciation: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default WordCard;