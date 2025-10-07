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

export default function Grammar() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const prepositions = [
    { english: 'and', tajik: 'ва', pronunciation: '[va]', audio: 'tajik_and' },
    { english: 'above', tajik: 'дар болои', pronunciation: '[dar Bolo]', audio: 'tajik_above' },
    { english: 'under', tajik: 'дар зери', pronunciation: '[dar zieri]', audio: 'tajik_under' },
    { english: 'before', tajik: 'пеш аз', pronunciation: '[pieš az]', audio: 'tajik_before' },
    { english: 'after', tajik: 'пасфардо', pronunciation: '[pasfardo]', audio: 'tajik_after' },
    { english: 'in front of', tajik: 'дар пеши', pronunciation: '[dar pieši]', audio: 'tajik_in_front_of' },
    { english: 'behind', tajik: 'дар паси', pronunciation: '[dar paśvi]', audio: 'tajik_behind' },
    { english: 'far from', tajik: 'дур аз', pronunciation: '[Dur az]', audio: 'tajik_far_from' },
    { english: 'near', tajik: 'дар наздикии', pronunciation: '[dar nazdikii]', audio: 'tajik_near' },
    { english: 'in', tajik: 'дар', pronunciation: '[dar]', audio: 'tajik_in' },
    { english: 'inside', tajik: 'дар дарун', pronunciation: '[dar darun]', audio: 'tajik_inside' },
    { english: 'outside', tajik: 'дар берун', pronunciation: '[dar bierun]', audio: 'tajik_outside' },
    { english: 'with', tajik: 'бо', pronunciation: '[bo]', audio: 'tajik_with' },
    { english: 'without', tajik: 'бе', pronunciation: '[be]', audio: 'tajik_without' },
    { english: 'about', tajik: 'дар назди', pronunciation: '[dar nazdi]', audio: 'tajik_about' },
    { english: 'between', tajik: 'дар байни', pronunciation: '[dar bajni]', audio: 'tajik_between' },
    { english: 'but', tajik: 'аммо', pronunciation: '[ammo]', audio: 'tajik_but' },
    { english: 'for', tajik: 'барои', pronunciation: '[Baro]', audio: 'tajik_for' },
    { english: 'from', tajik: 'аз', pronunciation: '[az]', audio: 'tajik_from' },
    { english: 'to', tajik: 'ба сӯи', pronunciation: '[ba sūi]', audio: 'tajik_to' },
  ];

  const prepositionExamples = [
    { english: 'I eat without a knife', tajik: 'ман бе корд хӯрок мехӯрам', pronunciation: '[man be kord chūrok miechūram]', rule: '[preposition + noun]', audio: 'tajik_I_eat_without_a_knife' },
    { english: 'she lives near the church', tajik: 'у дар назди калисо зиндагони мекунад', pronunciation: '[u dar nazdi kaliso zindahoni miekunad]', rule: '[verb + preposition]', audio: 'tajik_she_lives_near_the_church' },
    { english: 'he is taller than her', tajik: 'қади ӯ аз ман баландтар аст', pronunciation: '[k\'adi ū az man balandtar astra]', rule: '[adjective + preposition]', audio: 'tajik_he_is_taller_than_her' },
    { english: 'he came with his small dog', tajik: 'у бо саги хӯрдаш омад', pronunciation: '[u bo sahi chūrdaš omad]', rule: '[preposition + pronoun]', audio: 'tajik_he_came_with_his_small_dog' },
    { english: 'can you come with me?', tajik: 'шумо бо ман омада метавони?', pronunciation: '[šumo bo man omada mietavoni?]', rule: '[preposition + pronoun]', audio: 'tajik_can_you_come_with_me' },
  ];

  const negationExamples = [
    { english: 'I understand you', tajik: 'ман шуморо мефаҳмам', pronunciation: '[man šumoro miefaҳmam]', rule: '[affirmative form]', audio: 'tajik_I_understand_you' },
    { english: "I don't understand you", tajik: 'ман шуморо намефаҳмам', pronunciation: '[man šumoro namiefaҳmam]', rule: '[negation + verb]', audio: 'tajik_I_dont_understand_you' },
    { english: 'this is not the correct word', tajik: 'ин калимаи нодуруст аст', pronunciation: '[in kalimai nodurust astra]', rule: '[negation + adjective]', audio: 'tajik_this_is_not_the_correct_word' },
    { english: "don't leave me", tajik: 'меро ягона нагузоред', pronunciation: '[mierapryjemstva jahony nahuzoried]', rule: '[imperative negation]', audio: 'tajik_dont_leave_me' },
    { english: 'no problem', tajik: 'хуб шудааст', pronunciation: '[Chub šudaast]', rule: '[negation + noun]', audio: 'tajik_no_problem' },
  ];

  const negativeSentences = [
    { english: "I don't speak French", tajik: 'ман забони фаронсавиро намедонам', pronunciation: '[man zaboni faronsaviro namiedonam]', rule: '[negation + present tense]', audio: 'tajik_I_dont_speak_French' },
    { english: "she didn't visit Germany", tajik: 'ӯ ба Олмон нарафтааст', pronunciation: '[ū ba Olmon naraftaast]', rule: '[negation + past tense]', audio: 'tajik_she_didnt_visit_Germany' },
    { english: 'he cannot see us', tajik: 'ӯ моро намебинад', pronunciation: '[ū Mora namiebinad]', rule: '[negative modal verb]', audio: 'tajik_he_cannot_see_us' },
    { english: "can't she play chess?", tajik: 'ӯ шоҳмотбозӣ карда наметавонад?', pronunciation: '[ū šoҳmotbozī kard namietavonad?]', rule: '[interrogative negation]', audio: 'tajik_cant_she_play_chess' },
    { english: 'we will not come late', tajik: 'мо дер барнамегардем', pronunciation: '[mo der barnamiehardiem]', rule: '[negation + future tense]', audio: 'tajik_we_will_not_come_late' },
  ];

  const questions = [
    { english: 'how?', tajik: 'чӣ хел?', pronunciation: '[čī chiel?]', audio: 'tajik_how' },
    { english: 'what?', tajik: 'Чӣ?', pronunciation: '[Čī?]', audio: 'tajik_what' },
    { english: 'who?', tajik: 'Кӣ?', pronunciation: '[Kī?]', audio: 'tajik_who' },
    { english: 'why?', tajik: 'Барои чӣ?', pronunciation: '[Baro čī?]', audio: 'tajik_why' },
    { english: 'where?', tajik: 'Кучо?', pronunciation: '[Kučo?]', audio: 'tajik_where' },
  ];

  const questionExamples = [
    { english: 'where do you live?', tajik: 'шумо дар кучо зиндагонӣ мекунед?', pronunciation: '[šumo dar kučo zindahonī miekunied?]', rule: '[interrogative + verb]', audio: 'tajik_where_do_you_live' },
    { english: 'does she speak Chinese?', tajik: 'ӯ забони хитоиро медонад?', pronunciation: '[ū zaboni chitoiro miedonad?]', rule: '[interrogative verb]', audio: 'tajik_does_she_speak_Chinese' },
    { english: 'how much is this?', tajik: 'ин чанд пул меистад?', pronunciation: '[in čand pul mieistad?]', rule: '[interrogative preposition]', audio: 'tajik_how_much_is_this' },
    { english: 'can I help you?', tajik: 'лаббай?', pronunciation: '[labbaj?]', rule: '[interrogative modal verb]', audio: 'tajik_can_I_help_you' },
    { english: 'what is your name?', tajik: 'номи шумо чист?', pronunciation: '[naminalie šumo čysty?]', rule: '[interrogative preposition]', audio: 'tajik_what_is_your_name' },
  ];

  const adverbs = [
    { english: 'now', tajik: 'ҳозир', pronunciation: '[ҳozir]', audio: 'tajik_now' },
    { english: 'yesterday', tajik: 'дирўз', pronunciation: '[dirŭz]', audio: 'tajik_yesterday' },
    { english: 'today', tajik: 'имрўз', pronunciation: '[imrŭz]', audio: 'tajik_today' },
    { english: 'tonight', tajik: 'имшаб', pronunciation: '[imšab]', audio: 'tajik_tonight' },
    { english: 'tomorrow', tajik: 'пагоҳ', pronunciation: '[pahoҳ]', audio: 'tajik_tomorrow' },
    { english: 'soon', tajik: 'дар наздикӣ', pronunciation: '[dar nazdikī]', audio: 'tajik_soon' },
    { english: 'quickly', tajik: 'зуд', pronunciation: '[svierb]', audio: 'tajik_quickly' },
    { english: 'slowly', tajik: 'оҳиста', pronunciation: '[oҳista]', audio: 'tajik_slowly' },
    { english: 'together', tajik: 'якҷоя', pronunciation: '[jakҷoja]', audio: 'tajik_together' },
    { english: 'very', tajik: 'хеле', pronunciation: '[chielie]', audio: 'tajik_very' },
    { english: 'almost', tajik: 'тақрибан', pronunciation: '[tak\'riban]', audio: 'tajik_almost' },
    { english: 'always', tajik: 'доимо', pronunciation: '[doimo]', audio: 'tajik_always' },
    { english: 'usually', tajik: 'умуман', pronunciation: '[umuman]', audio: 'tajik_usually' },
    { english: 'sometimes', tajik: 'баъзан', pronunciation: '[baʺzan]', audio: 'tajik_sometimes' },
    { english: 'rarely', tajik: 'гоҳ-гоҳ', pronunciation: '[hoҳ-hoҳ]', audio: 'tajik_rarely' },
    { english: 'never', tajik: 'ҳеҷгоҳ', pronunciation: '[ҳjeҷhoҳ]', audio: 'tajik_never' },
  ];

  const adverbExamples = [
    { english: 'do you understand me now?', tajik: 'шумо щозир маро мефахмед?', pronunciation: '[šumo ŝozir Maro miefachmied?]', rule: '[pronoun + adverb]', audio: 'tajik_do_you_understand_me_now' },
    { english: 'I need help immediately', tajik: 'ба ман фавран ёрь лозим аст', pronunciation: '[ba man favran jeŕ lozim astra]', rule: '[noun + adverb]', audio: 'tajik_I_need_help_immediately' },
    { english: 'she is very intelligent', tajik: 'у бисёр зирак мебошад', pronunciation: '[ŭ bisier zirak miebošad]', rule: '[adverb + adjective]', audio: 'tajik_she_is_very_intelligent' },
    { english: 'I will always love you', tajik: 'ман шуморо щамеша дӯст медорам', pronunciation: '[man šumoro ŝamieša dūst miedoram]', rule: '[verb + adverb]', audio: 'tajik_I_will_always_love_you' },
    { english: 'can we learn German together?', tajik: 'Олмониро якҷоя меомӯзем?', pronunciation: '[Olmoniro jakҷoja mieomūziem?]', rule: '[adverb in a question]', audio: 'tajik_can_we_learn_German_together' },
  ];

  const personalPronouns = [
    { english: 'I', tajik: 'ман', pronunciation: '[man]', audio: 'tajik_I' },
    { english: 'you', tajik: 'ту, шумо', pronunciation: '[tuju, šumo]', audio: 'tajik_you' },
    { english: 'he', tajik: 'ӯ', pronunciation: '[ū]', audio: 'tajik_he' },
    { english: 'she', tajik: 'ӯ', pronunciation: '[ū]', audio: 'tajik_she' },
    { english: 'we', tajik: 'мо', pronunciation: '[mo]', audio: 'tajik_we' },
    { english: 'they', tajik: 'онҳо', pronunciation: '[onҳo]', audio: 'tajik_they' },
  ];

  const objectPronouns = [
    { english: 'me', tajik: 'маро', pronunciation: '[Maro]', audio: 'tajik_me' },
    { english: 'you', tajik: 'туро (pl.шуморо)', pronunciation: '[turo (pl.šumoro)]', audio: 'tajik_you2' },
    { english: 'him', tajik: 'ӯро', pronunciation: '[ūro]', audio: 'tajik_him' },
    { english: 'her', tajik: 'ӯро', pronunciation: '[ūro]', audio: 'tajik_her' },
    { english: 'us', tajik: 'моро', pronunciation: '[Mora]', audio: 'tajik_us' },
    { english: 'them', tajik: 'онҳоро', pronunciation: '[onҳoro]', audio: 'tajik_them' },
  ];

  const possessivePronouns = [
    { english: 'my', tajik: 'ман', pronunciation: '[man]', audio: 'tajik_my' },
    { english: 'your', tajik: 'ту', pronunciation: '[tuju]', audio: 'tajik_your' },
    { english: 'his', tajik: 'ӯ', pronunciation: '[ū]', audio: 'tajik_his' },
    { english: 'her', tajik: 'ӯ', pronunciation: '[ū]', audio: 'tajik_her2' },
    { english: 'our', tajik: 'мо', pronunciation: '[mo]', audio: 'tajik_our' },
    { english: 'their', tajik: 'онҳо', pronunciation: '[onҳo]', audio: 'tajik_their' },
  ];

  const personalPronounExamples = [
    { english: 'I am your friend', tajik: 'ман рафиқи шумо ҳастам', pronunciation: '[man rafik\'i šumo ҳastam]', rule: '[1st pronoun + verb]', audio: 'tajik_I_am_your_friend' },
    { english: 'you speak very fast', tajik: 'шумо зуд гап мезанед', pronunciation: '[šumo svierb HAP miezanied]', rule: '[2nd pronoun + adverb]', audio: 'tajik_you_speak_very_fast' },
    { english: 'he has three dogs', tajik: 'ӯ се саг дорад', pronunciation: '[ū sioje sah Dorada]', rule: '[3rd pronoun + verb]', audio: 'tajik_he_has_three_dogs' },
    { english: 'she can speak German', tajik: 'ӯ олмониро медонад', pronunciation: '[ū olmoniro miedonad]', rule: '[3rd pronoun + verb]', audio: 'tajik_she_can_speak_German' },
    { english: 'we will not come late', tajik: 'мо дер намеоем', pronunciation: '[mo der namieojem]', rule: '[1st plural pronoun]', audio: 'tajik_we_will_not_come_late' },
    { english: 'they bought milk and bread', tajik: 'онҳо шир ванонхариданд', pronunciation: '[onҳo šyr vanoncharidand]', rule: '[3rd plural pronoun]', audio: 'tajik_they_bought_milk_and_bread' },
  ];

  const objectPronounExamples = [
    { english: 'can you tell me your name?', tajik: 'номи шумо чист?', pronunciation: '[naminalie šumo čysty?]', rule: '[1st object pronoun]', audio: 'tajik_can_you_tell_me_your_name' },
    { english: 'I will give you money', tajik: 'манба шумо пул медиҳам', pronunciation: '[manba šumo pul miediҳam]', rule: '[2nd object pronoun]', audio: 'tajik_I_will_give_you_money' },
    { english: 'she wrote him a letter', tajik: 'ӯ ба вай нома навишт', pronunciation: '[ū ba vaj Noma navišt]', rule: '[3rd object pronoun]', audio: 'tajik_she_wrote_him_a_letter' },
    { english: 'they visited her yesterday', tajik: 'онҳо ӯро дирӯз хабар гирифта буданд', pronunciation: '[onҳo ūro dirūz Chabarov hirifta budand]', rule: '[3rd object pronoun]', audio: 'tajik_they_visited_her_yesterday' },
    { english: 'can she help us?', tajik: 'ӯ ба мо ёрӣ расониа метавонад?', pronunciation: '[ū ba mo jerī rasonia mietavonad?]', rule: '[1st pl. object pronoun]', audio: 'tajik_can_she_help_us' },
    { english: 'he gave them food', tajik: 'ӯ ба онҳо хӯрок дод', pronunciation: '[ū ba onҳo chūrok dod]', rule: '[3rd pl. object pronoun]', audio: 'tajik_he_gave_them_food' },
  ];

  const possessivePronounExamples = [
    { english: 'my name is Maya', tajik: 'номи ман Майя', pronunciation: '[naminalie man Majia]', rule: '[1st possessive pronoun]', audio: 'tajik_my_name_is_Maya' },
    { english: 'your brother lives here', tajik: 'бародаратондар инҷозиндагонӣ мекунад', pronunciation: '[barodaratondar inҷozindahonī miekunad]', rule: '[2nd possessive pronoun]', audio: 'tajik_your_brother_lives_here' },
    { english: 'her mother cooks for us', tajik: 'модари ӯ барои мо хӯрок мепазонад', pronunciation: '[modari ū Baro mo chūrok miepazonad]', rule: '[3rd possessive pronoun]', audio: 'tajik_her_mother_cooks_for_us' },
    { english: 'his hobby is reading books', tajik: 'касби дӯстдоштаи ӯ китобхонӣ аст', pronunciation: '[Kasbie dūstdoštai ū kitobchonī astra]', rule: '[3rd possessive pronoun]', audio: 'tajik_his_hobby_Is_reading_books' },
    { english: 'our dream is to visit Paris', tajik: 'орзу дорам, ки ба Париж саёҳат намоям', pronunciation: '[orzu doram, ki ba Paryž sajeҳat namojam]', rule: '[1st pl. possessive pronoun]', audio: 'tajik_our_dream_is_to_visit_Paris' },
    { english: 'their house is not far', tajik: 'хонаи онҳо дур нест', pronunciation: '[chonai onҳo Dur niesci]', rule: '[3rd pl. possessive pronoun]', audio: 'tajik_their_house_is_not_far' },
  ];

  const demonstrativePronouns = [
    { english: 'this is my house', tajik: 'ин хонаи ман аст', pronunciation: '[in chonai man astra]', audio: 'tajik_this_is_my_house' },
    { english: 'that restaurant is far', tajik: 'он ошхона дур аст', pronunciation: '[jon ošchona Dur astra]', audio: 'tajik_that_restaurant_is_far' },
    { english: 'these apples are delicious', tajik: 'ин себҳо бомазаанд', pronunciation: '[in siebҳo bomazaand]', audio: 'tajik_these_apples_are_delicious' },
    { english: 'those stars are shiny', tajik: 'он ситораҳо дурахшонанд', pronunciation: '[jon sitoraҳo durachšonand]', audio: 'tajik_those_stars_are_shiny' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <PageHeader
        title="Tajik Grammar"
        onBackPress={() => router.push('../grammar')}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <IntroSection
          title="Tajik Grammar"
          text="Welcome to the 8th lesson about Tajik grammar. We will first learn about prepositions, negation, questions, adverbs, and pronouns including: personal, object and possessive pronouns. To hear the pronunciation, just click on the sound icon."
          fadeAnim={fadeAnim}
          isSmallPhone={isSmallPhone}
        />

        {/* Prepositions Section */}
        <Section 
          title="Prepositions" 
          introText="In general, they are used to link words to other words. For example: I speak Tajik and English the preposition is [and] because it connects both words Tajik and English. The following is a list of the most used prepositions in Tajik."
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={prepositions}
            fadeAnim={fadeAnim}
            showRule={false}
          />
        </Section>

        {/* Preposition Grammar Rules */}
        <Section
          title="Preposition Grammar Rules"
          introText="The following examples use prepositions in different ways and places to demonstrate how they behave in a sentence."
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={prepositionExamples}
            fadeAnim={fadeAnim}
          />
        </Section>

        {/* Negation Section */}
        <Section
          title="Negation in Tajik"
          introText="Now let's learn how to make a negative sentence (negation). For example: Saying no, I can't, I don't ... The following examples use negation in different ways and places to demonstrate how they behave in a sentence."
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={negationExamples}
            fadeAnim={fadeAnim}
          />
        </Section>

        {/* Negative Sentences */}
        <Section title="Negative Sentences" isSmallPhone={isSmallPhone}>
          <ExamplesSection
            examples={negativeSentences}
            fadeAnim={fadeAnim}
          />
        </Section>

        {/* Questions Section */}
        <Section
          title="Questions in Tajik"
          introText="Now let's learn how to ask questions (interrogative). Such as: what, why, can you ...? Here are some common examples:"
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={questions}
            fadeAnim={fadeAnim}
            showRule={false}
          />
        </Section>

        {/* Question Examples */}
        <Section
          title="Questions in Sentences"
          introText="More of the interrogative form, now in a sentence:"
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={questionExamples}
            fadeAnim={fadeAnim}
          />
        </Section>

        {/* Adverbs Section */}
        <Section
          title="Adverbs in Tajik"
          introText="It's time to learn the adverbs in Tajik. But what is an adverb? In general, adverbs modify verbs and adjectives. For example: You speak fast. The adverb is [fast] because it describes the verb and answers the question how do you speak? Here is a list of the most common ones:"
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={adverbs}
            fadeAnim={fadeAnim}
            showRule={false}
          />
        </Section>

        {/* Adverb Examples */}
        <Section
          title="Adverbs in Sentences"
          introText="The following examples use the adverbs in different ways and places to demonstrate how it behaves in a sentence."
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={adverbExamples}
            fadeAnim={fadeAnim}
          />
        </Section>

        {/* Personal Pronouns */}
        <Section
          title="Pronouns in Tajik"
          introText="We're almost done! This time we will learn the pronouns in Tajik. In general, a pronoun can be used instead of a noun. For example instead of saying my teacher speaks 3 languages, you can use the pronoun he, and say he speaks 3 languages. Here is a list of the most common ones:"
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={personalPronouns}
            fadeAnim={fadeAnim}
            showRule={false}
          />
        </Section>

        {/* Object Pronouns */}
        <Section title="Object Pronouns" isSmallPhone={isSmallPhone}>
          <ExamplesSection
            examples={objectPronouns}
            fadeAnim={fadeAnim}
            showRule={false}
          />
        </Section>

        {/* Possessive Pronouns */}
        <Section title="Possessive Pronouns" isSmallPhone={isSmallPhone}>
          <ExamplesSection
            examples={possessivePronouns}
            fadeAnim={fadeAnim}
            showRule={false}
          />
        </Section>

        {/* Personal Pronoun Examples */}
        <Section
          title="Personal Pronouns in Sentences"
          introText="I think it's better to put the above example in a sentence to better assist you. The following examples use pronouns in different ways and places to demonstrate how they behave in a sentence. We will start with the personal pronouns."
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={personalPronounExamples}
            fadeAnim={fadeAnim}
          />
        </Section>

        {/* Object Pronoun Examples */}
        <Section
          title="Object Pronouns in Sentences"
          introText="The object pronoun is used as a target by a verb, and usually come after that verb. For example: I gave him my book. The object pronoun here is him. Here are more examples:"
          isSmallPhone={isSmallPhone}
          ><ExamplesSection
            examples={objectPronounExamples}
            fadeAnim={fadeAnim}
            />
        </Section>
        <Section
          title="Possessive Pronouns in Sentences"
          introText="The possessive pronoun is used to show ownership or possession. For example: This is my book. The possessive pronoun here is my. Here are more examples:"
          isSmallPhone={isSmallPhone}
          ><ExamplesSection
            examples={possessivePronounExamples}
            fadeAnim={fadeAnim}
            />
        </Section>
        <Section
          title="demonstrative pronouns in Sentences"
          introText="One more thing you need to know is the demonstrative pronouns. They're very easy to learn."
          isSmallPhone={isSmallPhone}
          ><ExamplesSection
            examples={demonstrativePronouns}
            fadeAnim={fadeAnim}
            />
        </Section>
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