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
import WordsGrid from './blocks/WordsGrid';
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

const getCardWidth = () => {
  if (isTablet) {
    return isLandscape ? (width - 64) / 4 : (width - 48) / 3;
  }
  return isSmallPhone ? width - 32 : (width - 48) / 2;
};

const getFontSize = (baseSize) => {
  const scaleFactor = isSmallPhone ? 0.9 : isTablet ? 1.2 : 1;
  return Math.round(baseSize * scaleFactor);
};

const getSpacing = (baseSpacing) => {
  return getResponsiveValue(baseSpacing * 0.8, baseSpacing, baseSpacing * 1.2);
};

export default function Vocabulary() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const clothes = [
    { english: 'shirt', tajik: 'курта', pronunciation: '[kurta]', audio: 'tajik_shirt', image: 'shirt.png' },
    { english: 'sweater', tajik: 'ҷемпер', pronunciation: '[ҷjempier]', audio: 'tajik_sweater', image: 'sweater.png' },
    { english: 'jacket', tajik: 'пиҷак', pronunciation: '[piҷak]', audio: 'tajik_jacket', image: 'jacket.png' },
    { english: 'coat', tajik: 'плаш', pronunciation: '[plaš]', audio: 'tajik_coat', image: 'coat.png' },
    { english: 'socks', tajik: 'ҷўроб', pronunciation: '[ҷŭrob]', audio: 'tajik_socks', image: 'socks.png' },
    { english: 'shoes', tajik: 'пойафзол', pronunciation: '[pojafzol]', audio: 'tajik_shoes', image: 'shoes.png' },
    { english: 'trousers', tajik: 'шим', pronunciation: '[šim]', audio: 'tajik_trousers', image: 'trousers.png' },
    { english: 'pajamas', tajik: 'хонапӯш', pronunciation: '[chonapūš]', audio: 'tajik_pajamas', image: 'pajamas.png' },
    { english: 'belt', tajik: 'тасма', pronunciation: '[tasma]', audio: 'tajik_belt', image: 'belt.png' },
    { english: 'underwear', tajik: 'тагпӯш', pronunciation: '[tahpūš]', audio: 'tajik_underwear', image: 'underwear.png' },
    { english: 'hat', tajik: 'кулоҳ', pronunciation: '[kuloҳ]', audio: 'tajik_hat', image: 'hat.png' },
    { english: 'skirt', tajik: 'юбка', pronunciation: '[spadnica]', audio: 'tajik_skirt', image: 'skirt.png' },
  ];

  const languagesAndCountries = [
    { english: 'Arabic', tajik: 'арабӣ', pronunciation: '[arabī]', audio: 'tajik_arabic' },
    { english: 'Morocco', tajik: 'Марокко', pronunciation: '[Maroka]', audio: 'tajik_Morocco' },
    { english: 'Chinese', tajik: 'чинӣ', pronunciation: '[činī]', audio: 'tajik_Chinese' },
    { english: 'China', tajik: 'Чин', pronunciation: '[Čyn]', audio: 'tajik_China' },
    { english: 'English', tajik: 'англисӣ', pronunciation: '[anhlisī]', audio: 'tajik_English' },
    { english: 'England', tajik: 'Англия', pronunciation: '[Anhlija]', audio: 'tajik_England' },
    { english: 'French', tajik: 'фаронсавӣ', pronunciation: '[faronsavī]', audio: 'tajik_French' },
    { english: 'France', tajik: 'Фаронса', pronunciation: '[Faronsa]', audio: 'tajik_France' },
    { english: 'German', tajik: 'олмонӣ', pronunciation: '[olmonī]', audio: 'tajik_German' },
    { english: 'Germany', tajik: 'Олмон', pronunciation: '[Olmon]', audio: 'tajik_Germany' },
    { english: 'Greek', tajik: 'юнонӣ', pronunciation: '[junonī]', audio: 'tajik_Greek' },
    { english: 'Greece', tajik: 'Юнон', pronunciation: '[Junona]', audio: 'tajik_Greece' },
    { english: 'Portuguese', tajik: 'португалӣ', pronunciation: '[portuhalī]', audio: 'tajik_Portuguese' },
    { english: 'Portugal', tajik: 'Португалия', pronunciation: '[Partuhalija]', audio: 'tajik_Portugal' },
    { english: 'Hindi', tajik: 'ҳинбӣ', pronunciation: '[ҳinbī]', audio: 'tajik_Hindi' },
    { english: 'India', tajik: 'Ҳиндустон', pronunciation: '[Ҳinduston]', audio: 'tajik_India' },
    { english: 'Italian', tajik: 'италиявӣ', pronunciation: '[italijavī]', audio: 'tajik_Italian' },
    { english: 'Italy', tajik: 'Италия', pronunciation: '[Italija]', audio: 'tajik_Italy' },
    { english: 'Japanese', tajik: 'ҷопонӣ', pronunciation: '[ҷoponī]', audio: 'tajik_Japanese' },
    { english: 'Japan', tajik: 'Ҷопон', pronunciation: '[Ҷopon]', audio: 'tajik_Japan' },
    { english: 'Russian', tajik: 'забони русӣ', pronunciation: '[zaboni rusī]', audio: 'tajik_Russian' },
    { english: 'Russia', tajik: 'Русия', pronunciation: '[Rusija]', audio: 'tajik_Russia' },
    { english: 'Spanish', tajik: 'испанӣ', pronunciation: '[ispanī]', audio: 'tajik_Spanish' },
    { english: 'Spain', tajik: 'Испания', pronunciation: '[Ispanija]', audio: 'tajik_Spain' },
    { english: 'Swedish', tajik: 'шведӣ', pronunciation: '[šviedī]', audio: 'tajik_Swedish' },
    { english: 'Sweden', tajik: 'Шветсия', pronunciation: '[Švietsija]', audio: 'tajik_Sweden' },
  ];

  const travelAndSurvival = [
    { english: 'airport', tajik: 'фурудгоҳ', pronunciation: '[furudhoҳ]', audio: 'tajik_airport' },
    { english: 'doctor', tajik: 'духтур', pronunciation: '[duchtur]', audio: 'tajik_doctor' },
    { english: 'airplane', tajik: 'таёра', pronunciation: '[tajera]', audio: 'tajik_airplane' },
    { english: 'medicines', tajik: 'дору', pronunciation: '[Doru]', audio: 'tajik_medicines' },
    { english: 'train', tajik: 'қатора', pronunciation: '[k\'atora]', audio: 'tajik_train' },
    { english: 'pharmacy', tajik: 'дорухона', pronunciation: '[doruchona]', audio: 'tajik_pharmacy' },
    { english: 'taxi', tajik: 'такси', pronunciation: '[taksi]', audio: 'tajik_taxi' },
    { english: 'hospital', tajik: 'беморхона', pronunciation: '[biemorchona]', audio: 'tajik_hospital' },
    { english: 'bus', tajik: 'автобус', pronunciation: '[aŭtobus]', audio: 'tajik_bus' },
    { english: 'ambulance', tajik: 'мошини ёрии таъҷилӣ', pronunciation: '[mošini jerii taʺҷilī]', audio: 'tajik_ambulance' },
    { english: 'car', tajik: 'мошин', pronunciation: '[mošin]', audio: 'tajik_car' },
    { english: 'poison', tajik: 'заҳр', pronunciation: '[zaҳr]', audio: 'tajik_poison' },
    { english: 'ticket', tajik: 'чипта', pronunciation: '[čipta]', audio: 'tajik_ticket' },
    { english: 'help me', tajik: 'ёрӣ расонед', pronunciation: '[jerī rasonied]', audio: 'tajik_help_me' },
    { english: 'hotel', tajik: 'меҳмонхона', pronunciation: '[mieҳmonchona]', audio: 'tajik_hotel' },
    { english: 'danger', tajik: 'хатар', pronunciation: '[chatar]', audio: 'tajik_danger' },
    { english: 'reservation', tajik: 'захира', pronunciation: '[Zachir]', audio: 'tajik_reservation' },
    { english: 'accident', tajik: 'садама', pronunciation: '[Sadam]', audio: 'tajik_accident' },
    { english: 'passport', tajik: 'шиноснома', pronunciation: '[šinosnoma]', audio: 'tajik_passport' },
    { english: 'police', tajik: 'милитсия', pronunciation: '[militsija]', audio: 'tajik_police' },
    { english: 'luggage', tajik: 'бағоч', pronunciation: '[baġoč]', audio: 'tajik_luggage' },
    { english: 'headache', tajik: 'дарди сар', pronunciation: '[Dard SAR]', audio: 'tajik_headache' },
    { english: 'tourism', tajik: 'туризм', pronunciation: '[turyzm]', audio: 'tajik_tourism' },
    { english: 'stomach ache', tajik: 'шикамдард', pronunciation: '[šikamdard]', audio: 'tajik_stomach_ache' },
  ];

  const classAndHouse = [
    { english: 'books', tajik: 'китобхона', pronunciation: '[kitobchona]', audio: 'tajik_books' },
    { english: 'toilet', tajik: 'ҳоҷатхона', pronunciation: '[ҳoҷatchona]', audio: 'tajik_toilet' },
    { english: 'pen', tajik: 'ручка', pronunciation: '[ručka]', audio: 'tajik_pen' },
    { english: 'bed', tajik: 'кат', pronunciation: '[kat]', audio: 'tajik_bed' },
    { english: 'dictionary', tajik: 'луғат', pronunciation: '[luġat]', audio: 'tajik_dictionary' },
    { english: 'bedroom', tajik: 'хобгоҳ', pronunciation: '[chobhoҳ]', audio: 'tajik_bedroom' },
    { english: 'library', tajik: 'китобхона', pronunciation: '[kitobchona]', audio: 'tajik_library' },
    { english: 'furniture', tajik: 'мебел, бисоти хона', pronunciation: '[mebli, bisoti chona]', audio: 'tajik_furniture' },
    { english: 'desk', tajik: 'мизи корӣ', pronunciation: '[mizi korī]', audio: 'tajik_desk' },
    { english: 'house', tajik: 'хона', pronunciation: '[chona]', audio: 'tajik_house' },
    { english: 'student', tajik: 'донишҷӯ', pronunciation: '[donišҷū]', audio: 'tajik_student' },
    { english: 'kitchen', tajik: 'ошхона', pronunciation: '[ošchona]', audio: 'tajik_kitchen' },
    { english: 'teacher', tajik: 'омўзгор, муаллим', pronunciation: '[omŭzhor, Mualiem]', audio: 'tajik_teacher' },
    { english: 'plate', tajik: 'табақ', pronunciation: '[tabak\']', audio: 'tajik_plate' },
    { english: 'chair', tajik: 'курсӣ', pronunciation: '[kursī]', audio: 'tajik_chair' },
    { english: 'refrigerator', tajik: 'яхдон', pronunciation: '[jachdon]', audio: 'tajik_refrigerator' },
    { english: 'paper', tajik: 'коғаз', pronunciation: '[koġaz]', audio: 'tajik_paper' },
    { english: 'room', tajik: 'ҳуҷра', pronunciation: '[ҳuҷra]', audio: 'tajik_room' },
    { english: 'page', tajik: 'саҳифа', pronunciation: '[saҳifa]', audio: 'tajik_page' },
    { english: 'table', tajik: 'миз', pronunciation: '[miz]', audio: 'tajik_table' },
    { english: 'pencil', tajik: 'қалам', pronunciation: '[k\'alam]', audio: 'tajik_pencil' },
    { english: 'window', tajik: 'тиреза', pronunciation: '[tirieza]', audio: 'tajik_window' },
    { english: 'question', tajik: 'савол', pronunciation: '[savol]', audio: 'tajik_question' },
    { english: 'television', tajik: 'ойнаи нилгун', pronunciation: '[ojnai nilhun]', audio: 'tajik_television' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <PageHeader
        title="Tajik Vocabulary"
        onBackPress={() => router.push('../grammar')}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <IntroSection
          title="Tajik Vocabulary"
          text="Welcome to the 9th lesson about the Tajik vocabulary. We're dedicating this page to the most important and most used words in Tajik. For example: clothes, languages, countries, travel, survival words, class, and house components. The sound is also provided."
          fadeAnim={fadeAnim}
          isSmallPhone={isSmallPhone}
        />

        {/* Clothes Section */}
        <Section title="Clothes" isSmallPhone={isSmallPhone}>
          <WordsGrid
            words={clothes}
            fadeAnim={fadeAnim}
            getCardWidth={getCardWidth}
            isTablet={isTablet}
            gridStyle={styles.wordsGrid}
          />
        </Section>

        {/* Languages and Countries Section */}
        <Section
          title="Languages and Countries"
          introText="The following words are related to languages and countries."
          isSmallPhone={isSmallPhone}
        >
          <WordsGrid
            words={languagesAndCountries}
            fadeAnim={fadeAnim}
            getCardWidth={getCardWidth}
            isTablet={isTablet}
            gridStyle={styles.wordsGrid}
          />
        </Section>

        {/* Travel and Survival Section */}
        <Section
          title="Travel and Survival"
          introText="The following vocabulary is related to travel and survival."
          isSmallPhone={isSmallPhone}
        >
          <WordsGrid
            words={travelAndSurvival}
            fadeAnim={fadeAnim}
            getCardWidth={getCardWidth}
            isTablet={isTablet}
            gridStyle={styles.wordsGrid}
          />
        </Section>

        {/* Class and House Section */}
        <Section
          title="Class and House"
          introText="The following list of words is related to a class environment and the components of a house."
          isSmallPhone={isSmallPhone}
        >
          <WordsGrid
            words={classAndHouse}
            fadeAnim={fadeAnim}
            getCardWidth={getCardWidth}
            isTablet={isTablet}
            gridStyle={styles.wordsGrid}
          />
        </Section>

        {/* Quote Section */}
        <QuoteSection
          quote="You are never given a wish without also being given the power to make it come true. You have to work for it, however."
          author="Richard Bach"
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
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: isTablet ? 'flex-start' : 'space-between',
    paddingHorizontal: getSpacing(16),
    gap: isTablet ? getSpacing(16) : 0,
  },
  bottomSpacer: {
    height: getSpacing(32),
  },
});