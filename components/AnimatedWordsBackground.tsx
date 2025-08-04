import { View, Text, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import { useEffect, useRef } from 'react';

const { width, height } = Dimensions.get('window');
const WORDS = [
  'салом', 'дӯстӣ', 'зебо', 'омӯзиш', 'забон', 'муваффақият', 'хурсандӣ', 'оила', 'ватан', 'бародарӣ',
  'ишқ', 'умед', 'орзу', 'хаёт', 'рӯз', 'шаб', 'офтоб', 'ситора', 'дарё', 'кӯҳ',
  'гул', 'булбул', 'бахор', 'зимистон', 'тобистон', 'хазон', 'сабз', 'сурх', 'сафед', 'кабуд',
  'китоб', 'илм', 'донишманд', 'устод', 'шогирд', 'мактаб', 'донишгоҳ', 'тарих', 'фарҳанг', 'анъана',
  'мусиқӣ', 'рақс', 'суруд', 'достон', 'шеър', 'адабиёт', 'санъат', 'нақшинавис', 'ҳунармандӣ', 'созанда'
];

function getRandomPosition() {
  const padding = 120;
  return {
    top: Math.random() * (height - padding * 2) + padding,
    left: Math.random() * (width - padding * 2) + padding,
  };
}

function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function getRandomDuration(min, max) {
  return Math.random() * (max - min) + min;
}

export default function AnimatedWordsBackground() {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return null; // Не рендерим на мобильных
  }
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const position = useRef(getRandomPosition()).current;
  const wordRef = useRef(getRandomWord());
  
  useEffect(() => {
    const animateWord = () => {
      // Генерируем новые случайные значения для каждой анимации
      const fadeInDuration = getRandomDuration(1500, 3500);
      const stayDuration = getRandomDuration(2000, 6000);
      const fadeOutDuration = getRandomDuration(1500, 3500);
      const moveDuration = fadeInDuration + stayDuration + fadeOutDuration;
      const moveDistance = getRandomDuration(-60, -15);
      
      // Сброс значений
      opacity.setValue(0);
      translateY.setValue(0);
      
      // Обновляем позицию и слово каждый раз
      const newPosition = getRandomPosition();
      position.top = newPosition.top;
      position.left = newPosition.left;
      wordRef.current = getRandomWord();
      
      Animated.parallel([
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: fadeInDuration,
            useNativeDriver: true,
          }),
          Animated.delay(stayDuration),
          Animated.timing(opacity, {
            toValue: 0,
            duration: fadeOutDuration,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(translateY, {
          toValue: moveDistance,
          duration: moveDuration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Случайная пауза перед следующей анимацией
        const nextDelay = getRandomDuration(2000, 8000);
        setTimeout(animateWord, nextDelay);
      });
    };

    // Начальная задержка для каждого слова (больше разброс)
    const initialDelay = getRandomDuration(0, 12000);
    setTimeout(animateWord, initialDelay);
  }, []);

  return (
    <Animated.Text
      style={[
        styles.word,
        {
          opacity,
          top: position.top,
          left: position.left,
          transform: [{ translateY }],
        },
      ]}
    >
      {wordRef.current}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  word: {
    position: 'absolute',
    fontSize: 38,
    color: 'rgba(79, 70, 229, 0.20)',
    fontWeight: '400',
    zIndex: 0,
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    // Рукописный шрифт для iOS и Android
    fontFamily: Platform.OS === 'ios' ? 'Bradley Hand' : 'cursive',
    // Альтернативные рукописные шрифты
    ...(Platform.OS === 'ios' && {
      fontFamily: 'Snell Roundhand', // Еще один красивый рукописный шрифт для iOS
    }),
    fontStyle: 'italic', // курсив для более рукописного вида
  },
});