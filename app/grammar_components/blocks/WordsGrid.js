import React from 'react';
import { View, StyleSheet } from 'react-native';
import WordCard from './WordCard'

const WordsGrid = ({ 
  words, 
  fadeAnim,
  gridStyle,
  cardStyle,
  imageStyle,
  englishStyle,
  tajikStyle,
  pronunciationStyle,
  showImages = true,
  getCardWidth,
  isTablet = false
}) => (
  <View style={[styles.wordsGrid, gridStyle]}>
    {words.map((item, index) => (
      <WordCard
        key={index}
        item={item}
        index={index}
        showImage={showImages}
        fadeAnim={fadeAnim}
        cardStyle={[{ width: getCardWidth ? getCardWidth() : 'auto' }, cardStyle]}
        imageStyle={imageStyle}
        englishStyle={englishStyle}
        tajikStyle={tajikStyle}
        pronunciationStyle={pronunciationStyle}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});

export default WordsGrid;