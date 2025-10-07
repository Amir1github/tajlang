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

export default function Verbs() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const presentTense = [
    { english: 'I speak English', tajik: 'ман англисиро медонам', pronunciation: '[man anhlisiro miedonam]', audio: 'tajik_I_speak_English' },
    { english: 'you speak French', tajik: 'ту фаронсавиро медони', pronunciation: '[tuju faronsaviro miedoni]', audio: 'tajik_you_speak_French' },
    { english: 'he speaks German', tajik: 'ӯ олмониро медонад', pronunciation: '[ū olmoniro miedonad]', audio: 'tajik_he_speaks_German' },
    { english: 'she speaks Italian', tajik: 'ӯ итолиёвиро медонад', pronunciation: '[ū itolijeviro miedonad]', audio: 'tajik_she_speaks_Italian' },
    { english: 'we speak Arabic', tajik: 'мо арабиро медонем', pronunciation: '[mo arabiro miedoniem]', audio: 'tajik_we_speak_arabic' },
    { english: 'they speak Chinese', tajik: 'онҳо чиниро медонанд', pronunciation: '[onҳo činiro miedonand]', audio: 'tajik_they_speak_Chinese' },
  ];

  const pastTense = [
    { english: 'I visited France', tajik: 'ман дар Фаронса зиндагонӣ мекунам', pronunciation: '[man dar Faronsa zindahonī miekunam]', audio: 'tajik_I_visited_France' },
    { english: 'you visited Italy', tajik: 'ту ба Италия рафта буди', pronunciation: '[tuju ba Italija raftach budzi]', audio: 'tajik_you_visited_Italy' },
    { english: 'he visited Morocco', tajik: 'ӯ ба Морокко рафта буд', pronunciation: '[ū ba Morokko raftach bud]', audio: 'tajik_he_visited_Morocco' },
    { english: 'she visited China', tajik: 'ӯ ба Чин рафта буд', pronunciation: '[ū ba Čyn raftach bud]', audio: 'tajik_she_visited_China' },
    { english: 'we visited Mexico', tajik: 'мо ба Мексико рафта будем', pronunciation: '[mo ba Mieksika raftach budziem]', audio: 'tajik_we_visited_Mexico' },
    { english: 'they visited Kenya', tajik: 'онҳо ба Кения рафта буданд', pronunciation: '[onҳo ba Kienija raftach budand]', audio: 'tajik_they_visited_Kenya' },
  ];

  const futureTense = [
    { english: 'I will drink milk', tajik: 'ман шир менӯшам', pronunciation: '[man šyr mienūšam]', audio: 'tajik_I_will_drink_milk' },
    { english: 'you will drink coffee', tajik: 'ту қаҳва менӯши', pronunciation: '[tuju k\'aҳva mienūši]', audio: 'tajik_you_will_drink_coffee' },
    { english: 'he will drink tea', tajik: 'ӯ чой менӯшад', pronunciation: '[ū čoj mienūšad]', audio: 'tajik_he_will_drink_tea' },
    { english: 'she will drink water', tajik: 'ӯ об менӯшад', pronunciation: '[ū ab mienūšad]', audio: 'tajik_she_will_drink_water' },
    { english: 'we will drink apple juice', tajik: 'мо шарбати себ менӯшем', pronunciation: '[mo šarbati sieb mienūšjem]', audio: 'tajik_we_will_drink_apple_juice' },
    { english: 'they will drink tea', tajik: 'онҳо чой менӯшанд', pronunciation: '[onҳo čoj mienūšand]', audio: 'tajik_they_will_drink_tea' },
  ];

  const bodyParts = [
    { english: 'ear', tajik: 'гўш', pronunciation: '[hŭš]', audio: 'tajik_ear', image: 'ear.png' },
    { english: 'eye', tajik: 'чашм', pronunciation: '[čašm]', audio: 'tajik_eye', image: 'eye.png' },
    { english: 'mouth', tajik: 'даҳон', pronunciation: '[daҳon]', audio: 'tajik_mouth', image: 'mouth.png' },
    { english: 'nose', tajik: 'бинӣ', pronunciation: '[binī]', audio: 'tajik_nose', image: 'nose.png' },
    { english: 'hair', tajik: 'мўй', pronunciation: '[mŭj]', audio: 'tajik_hair', image: 'hair.png' },
    { english: 'face', tajik: 'рўй', pronunciation: '[rŭj]', audio: 'tajik_face', image: 'face.png' },
    { english: 'head', tajik: 'сар', pronunciation: '[SAR]', audio: 'tajik_head', image: 'head.png' },
    { english: 'heart', tajik: 'дил', pronunciation: '[dil]', audio: 'tajik_heart', image: 'heart.png' },
    { english: 'hand', tajik: 'бозу', pronunciation: '[bozu]', audio: 'tajik_hand', image: 'hand.png' },
    { english: 'fingers', tajik: 'ангуштон', pronunciation: '[anhušton]', audio: 'tajik_fingers', image: 'fingers.png' },
    { english: 'leg', tajik: 'пой', pronunciation: '[spiavaj]', audio: 'tajik_leg', image: 'leg.png' },
    { english: 'feet', tajik: 'кафи пой', pronunciation: '[kafi spiavaj]', audio: 'tajik_feet', image: 'feet.png' },
  ];

  const travelPhrases = [
    { english: 'Can you help me?', tajik: 'шумо ба ман ёрӣ расонида метавонед?', pronunciation: '[šumo ba man jerī rasonida mietavonied?]', audio: 'tajik_Can_you_help_me' },
    { english: 'Can I help you?', tajik: 'лаббай?', pronunciation: '[labbaj?]', audio: 'tajik_Can_I_help_you' },
    { english: 'Where is the airport?', tajik: 'фурудгоҳ дар кучост?', pronunciation: '[furudhoҳ dar kučost?]', audio: 'tajik_Where_is_the_airport' },
    { english: 'Go straight', tajik: 'рост равед', pronunciation: '[rost ravied]', audio: 'tajik_Go_straight' },
    { english: 'Then', tajik: 'баъд', pronunciation: '[baʺd]', audio: 'tajik_Then' },
    { english: 'Turn left', tajik: 'дасти чап гардед', pronunciation: '[Dasci čap hardied]', audio: 'tajik_Turn_left' },
    { english: 'Turn right', tajik: 'дасти рост гардед', pronunciation: '[Dasci rost hardied]', audio: 'tajik_Turn_right' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <PageHeader
        title="Tajik Verbs"
        onBackPress={() => router.push('../grammar')}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <IntroSection
          title="Tajik Verbs"
          text="Welcome to the 10th lesson about verbs in Tajik. We will first learn about the present tense, followed by the past tense, and future tense. We will also analyze some grammar rules, and finally practice how to ask for direction in Tajik."
          fadeAnim={fadeAnim}
          isSmallPhone={isSmallPhone}
        />

        {/* Present Tense Section */}
        <Section
          title="Present Tense"
          introText="Verbs are used to express an action (I swim) or a state of being (I am). The present tense in Tajik conveys a situation or event in the present time. Here are some examples:"
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={presentTense}
            fadeAnim={fadeAnim}
            showRule={false}
            englishStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            tajikStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            pronunciationStyle={isSmallPhone ? { textAlign: 'center' } : {}}
          />
        </Section>

        {/* Past Tense Section */}
        <Section
          title="Past Tense"
          introText="The past tense in Tajik conveys a situation or event in the past time. Here are some examples:"
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={pastTense}
            fadeAnim={fadeAnim}
            showRule={false}
            englishStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            tajikStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            pronunciationStyle={isSmallPhone ? { textAlign: 'center' } : {}}
          />
        </Section>

        {/* Future Tense Section */}
        <Section
          title="Future Tense"
          introText="The future tense in Tajik conveys a situation or event which is anticipated to happen in the future. Here are some examples:"
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={futureTense}
            fadeAnim={fadeAnim}
            showRule={false}
            englishStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            tajikStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            pronunciationStyle={isSmallPhone ? { textAlign: 'center' } : {}}
          />
        </Section>

        {/* Body Parts Section */}
        <Section
          title="Body Parts"
          introText="Now let's take a break and refresh our vocabulary by learning the body parts."
          isSmallPhone={isSmallPhone}
        >
          <WordsGrid
            words={bodyParts}
            fadeAnim={fadeAnim}
            getCardWidth={getCardWidth}
            isTablet={isTablet}
            gridStyle={styles.wordsGrid}
          />
        </Section>

        {/* Travel Phrases Section */}
        <Section
          title="Travel Phrases in Tajik"
          introText="Imagine yourself in some Tajik speaking country. The following travel phrases are highly important and can help you avoid misunderstanding. Try to memorize them and practice!"
          isSmallPhone={isSmallPhone}
        >
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
          quote="Knowing is not enough; we must apply. Willing is not enough; we must do."
          author="Goethe"
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