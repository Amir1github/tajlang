import React, { useRef } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';

// Импорт готовых компонентов
import PageHeader from './blocks/PageHeader';
import IntroSection from './blocks/IntroSection';
import Section from './blocks/Section';
import ExamplesSection from './blocks/ExamplesSection';
import QuoteSection from './blocks/QuoteSection';

const { width, height } = Dimensions.get('window');

// Responsive breakpoints
const isTablet = width >= 768;
const isSmallPhone = width < 350;
const isLandscape = width > height;

// Responsive utility functions
const getResponsiveValue = (small, medium, large) => {
  if (isSmallPhone) return small;
  if (isTablet) return large;
  return medium;
};

const getFontSize = (baseSize) => {
  const scaleFactor = isSmallPhone ? 0.9 : isTablet ? 1.2 : 1;
  return Math.round(baseSize * scaleFactor);
};

const getSpacing = (baseSpacing) => {
  return getResponsiveValue(baseSpacing * 0.8, baseSpacing, baseSpacing * 1.2);
};

export default function Phrases() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const holidayWishes = [
    { english: 'Happy birthday', tajik: 'Таваллудатон муборак', pronunciation: '[Tavalludaton muborak]', audio: 'tajik_Happy_birthday' },
    { english: 'Happy new year', tajik: 'Соли наватон муборак', pronunciation: '[Soli navaton muborak]', audio: 'tajik_Happy_new_year' },
    { english: 'Merry Christmas', tajik: 'Рӯзи мавлуди Исо муборак', pronunciation: '[Rūzi mavludi ISO muborak]', audio: 'tajik_Merry_Christmas' },
    { english: 'Good luck', tajik: 'Барори кор', pronunciation: '[Barori kor]', audio: 'tajik_Good_luck' },
    { english: 'Congratulations', tajik: 'Муборак шавад', pronunciation: '[Muborak šavad]', audio: 'tajik_Congratulations' },
  ];

  const travelPhrases = [
    { english: 'I have a reservation (hotel)', tajik: 'Ман ҷой банд карда будам', pronunciation: '[Man ҷoj band kard budam]', audio: 'tajik_I_have_a_reservation' },
    { english: 'Do you have rooms available?', tajik: 'Шумо ҳуҷраҳои холӣ доред?', pronunciation: '[Šumo ҳuҷraҳoi cholī doried?]', audio: 'tajik_Do_you_have_rooms_available' },
    { english: 'I would like a non-smoking room', tajik: 'Ба ман ҳуҷраи барои сигор намекашидагиҳо диҳед', pronunciation: '[Ba man ҳuҷrai Baro Sihor namiekašidahiҳo diҳjed]', audio: 'tajik_I_would_like_a_non_smoking_room' },
    { english: 'What is the charge per night?', tajik: 'Бароя як шаб чанд пул?', pronunciation: '[Baro jak šab čand pul?]', audio: 'tajik_What_is_the_charge_per_night' },
    { english: 'Is this seat taken?', tajik: 'Ин ҷои холист?', pronunciation: '[Jan ҷoi cholist?]', audio: 'tajik_Is_this_seat_taken' },
    { english: "I'm vegetarian", tajik: 'Ман гӯштхӯр нестам', pronunciation: '[Man hūštchūr niesci]', audio: 'tajik_Im_vegetarian' },
    { english: 'Waiter', tajik: 'Пешхизмат', pronunciation: '[Piešchizmat]', audio: 'tajik_Waiter' },
    { english: 'How much is this?', tajik: 'Ин чанд пул меистад?', pronunciation: '[Jan čand pul mieistad?]', audio: 'tajik_How_much_is_this' },
    { english: 'This is very expensive', tajik: 'Ин хеле қимат аст', pronunciation: '[Jan chielie k\'imat astra]', audio: 'tajik_This_is_very_expensive' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header с использованием PageHeader */}
      <PageHeader
        title="Tajik Phrases"
        onBackPress={() => router.push('../grammar')}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* IntroSection */}
        <IntroSection
          title="Tajik Phrases"
          text="Welcome to our seventh lesson about popular Tajik phrases. This page will include greetings, questions, emergency and survival expressions, asking for direction, language practice, introducing yourself, holiday wishes, and finally some travel phrases."
          fadeAnim={fadeAnim}
          isSmallPhone={isSmallPhone}
        />

        {/* Holiday Wishes Section */}
        <Section title="Holiday Wishes" isSmallPhone={isSmallPhone}>
          <ExamplesSection
            examples={holidayWishes}
            fadeAnim={fadeAnim}
            showRule={false}
            englishStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            tajikStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            pronunciationStyle={isSmallPhone ? { textAlign: 'center' } : {}}
          />
        </Section>

        {/* Travel Phrases Section */}
        <Section title="Travel Phrases" isSmallPhone={isSmallPhone}>
          <ExamplesSection
            examples={travelPhrases}
            fadeAnim={fadeAnim}
            showRule={false}
            englishStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            tajikStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            pronunciationStyle={isSmallPhone ? { textAlign: 'center' } : {}}
          />
        </Section>

        {/* Quote Section */}
        <QuoteSection
          quote="Every artist was first an amateur."
          author="R. W. Emerson"
          fadeAnim={fadeAnim}
          isSmallPhone={isSmallPhone}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: getSpacing(32),
  },
  bottomSpacer: {
    height: getSpacing(32),
  },
});