import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Modal, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';

import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Letter = {
  letter: string;
  transcription: string;
  examples: string[];    
  examples_en: string[];  
};

const TAJIK_ALPHABET: Letter[] = [
  { letter: 'А а', transcription: '[a]', examples: ['ангур - виноград', 'абр - облако'], examples_en: ['angur - grape', 'abr - cloud'] },
  { letter: 'Б б', transcription: '[b]', examples: ['бозор - рынок', 'барф - снег'], examples_en: ['bozor - market', 'barf - snow'] },
  { letter: 'В в', transcription: '[v]', examples: ['вақт - время', 'варақ - лист'], examples_en: ['vaqt - time', 'varaq - page'] },
  { letter: 'Г г', transcription: '[g]', examples: ['гул - цветок', 'гарм - горячий'], examples_en: ['gul - flower', 'garm - hot'] },
  { letter: 'Ғ ғ', transcription: '[ɣ]', examples: ['ғам - печаль', 'ғалаба - победа'], examples_en: ['gham - sorrow', 'ghalaba - victory'] },
  { letter: 'Д д', transcription: '[d]', examples: ['дил - сердце', 'дарахт - дерево'], examples_en: ['dil - heart', 'daraxt - tree'] },
  { letter: 'Е е', transcription: '[je]', examples: ['ему - волосы', 'енгил - лёгкий'], examples_en: ['emu - hair', 'engil - light (not heavy)'] },
  { letter: 'Ё ё', transcription: '[jo]', examples: ['ёр - друг', 'ёд - память'], examples_en: ['yor - friend', 'yod - memory'] },
  { letter: 'Ж ж', transcription: '[ʒ]', examples: ['жола - град', 'журнал - журнал'], examples_en: ['jola - hail', 'zhurnal - magazine'] },
  { letter: 'З з', transcription: '[z]', examples: ['забон - язык', 'зебо - красивый'], examples_en: ['zabon - language', 'zebo - beautiful'] },
  { letter: 'И и', transcription: '[i]', examples: ['имрӯз - сегодня', 'илм - наука'], examples_en: ['imruz - today', 'ilm - science'] },
  { letter: 'Ӣ ӣ', transcription: '[i:]', examples: ['мурғобӣ - утка', 'моҳӣ - рыба'], examples_en: ['murghobi - duck', 'mohi - fish'] },
  { letter: 'Й й', transcription: '[j]', examples: ['йод - йод', 'май - май'], examples_en: ['yod - iodine', 'may - May'] },
  { letter: 'К к', transcription: '[k]', examples: ['китоб - книга', 'кор - работа'], examples_en: ['kitob - book', 'kor - work'] },
  { letter: 'Қ қ', transcription: '[q]', examples: ['қалам - ручка', 'қанд - сахар'], examples_en: ['qalam - pen', 'qand - sugar'] },
  { letter: 'Л л', transcription: '[l]', examples: ['лаб - губа', 'лола - тюльпан'], examples_en: ['lab - lip', 'lola - tulip'] },
  { letter: 'М м', transcription: '[m]', examples: ['модар - мать', 'мактаб - школа'], examples_en: ['modar - mother', 'maktab - school'] },
  { letter: 'Н н', transcription: '[n]', examples: ['нон - хлеб', 'нав - новый'], examples_en: ['non - bread', 'nav - new'] },
  { letter: 'О о', transcription: '[o]', examples: ['об - вода', 'осмон - небо'], examples_en: ['ob - water', 'osmon - sky'] },
  { letter: 'П п', transcription: '[p]', examples: ['падар - отец', 'пагоҳ - завтра'], examples_en: ['padar - father', 'pagoҳ - tomorrow'] },
  { letter: 'Р р', transcription: '[r]', examples: ['рӯз - день', 'роҳ - дорога'], examples_en: ['ruz - day', 'roh - road'] },
  { letter: 'С с', transcription: '[s]', examples: ['сар - голова', 'соат - час'], examples_en: ['sar - head', 'soat - hour'] },
  { letter: 'Т т', transcription: '[t]', examples: ['тир - стрела', 'тоза - свежий'], examples_en: ['tir - arrow', 'toza - fresh'] },
  { letter: 'У у', transcription: '[u]', examples: ['умр - жизнь', 'устод - учитель'], examples_en: ['umr - life', 'ustod - teacher'] },
  { letter: 'Ӯ ӯ', transcription: '[u:]', examples: ['кӯҳ - гора', 'рӯз - день'], examples_en: ['kuh - mountain', 'ruz - day'] },
  { letter: 'Ф ф', transcription: '[f]', examples: ['фикр - мысль', 'фардо - завтра'], examples_en: ['fikr - thought', 'fardo - tomorrow'] },
  { letter: 'Х х', transcription: '[x]', examples: ['хона - дом', 'хуб - хороший'], examples_en: ['khona - house', 'khub - good'] },
  { letter: 'Ҳ ҳ', transcription: '[h]', examples: ['ҳаво - воздух', 'ҳаёт - жизнь'], examples_en: ['havo - air', 'hayot - life'] },
  { letter: 'Ч ч', transcription: '[tʃ]', examples: ['чашм - глаз', 'чор - четыре'], examples_en: ['chashm - eye', 'chor - four'] },
  { letter: 'Ҷ ҷ', transcription: '[dʒ]', examples: ['ҷон - душа', 'ҷавон - молодой'], examples_en: ['jon - soul', 'javon - young'] },
  { letter: 'Ш ш', transcription: '[ʃ]', examples: ['шаб - ночь', 'шир - молоко'], examples_en: ['shab - night', 'shir - milk'] },
  { letter: 'Ъ ъ', transcription: '[ʔ]', examples: ['съезд - съезд', 'объект - объект'], examples_en: ['syezd - congress', 'obyekt - object'] },
  { letter: 'Э э', transcription: '[e]', examples: ['эҳсос - чувство', 'эълон - объявление'], examples_en: ['ehsos - feeling', 'elon - announcement'] },
  { letter: 'Ю ю', transcription: '[ju]', examples: ['юнон - греческий', 'июл - июль'], examples_en: ['Yunon - Greek', 'Iyul - July'] },
  { letter: 'Я я', transcription: '[ja]', examples: ['яхдон - холодильник', 'ях - лёд'], examples_en: ['yakhdon - refrigerator', 'yakh - ice'] },
];

// Определяем размеры экрана для адаптивности
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isMobile = screenWidth < 768; // Считаем мобильным устройством экраны меньше 768px

export default function AlphabetScreen() {
  const { t, colors, language } = useLanguage();
  const router = useRouter();
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Улучшенная система озвучки с приоритетом для таджикского языка
  const speakLetter = async (letter: string) => {
    setIsSpeaking(true);
    
    try {
      if (Platform.OS === 'web') {
        // Веб-версия с ResponsiveVoice
        if (typeof (window as any).responsiveVoice !== 'undefined') {
          (window as any).responsiveVoice.speak(letter, "Russian Female", {
            pitch: 0.8,
            rate: 0.5,
            onend: () => setIsSpeaking(false)
          });
        } else {
          // Fallback для веб-версии
          await speakWithWebAPI(letter);
        }
      } else {
        // Мобильные устройства - используем нативный Speech Synthesis с улучшенными настройками
        await speakWithNativeAPI(letter);
      }
    } catch (error) {
      console.error('Ошибка озвучки:', error);
      setIsSpeaking(false);
    }
  };

  const speakWithWebAPI = async (letter: string) => {
    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(letter);
      
      // Ждем загрузки голосов
      const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        
        // Приоритет голосов: таджикский -> русский -> английский
        const preferredVoices = [
          voices.find(v => v.lang.includes('tg') || v.lang.includes('tj')),
          voices.find(v => v.lang.includes('ru-RU') || v.lang.includes('ru')),
          voices.find(v => v.lang.includes('en') && v.name.includes('Female')),
          voices.find(v => v.lang.includes('en'))
        ].filter(Boolean);

        if (preferredVoices.length > 0) {
          utterance.voice = preferredVoices[0]!;
          utterance.lang = preferredVoices[0]!.lang;
        }
        
        utterance.pitch = 0.8;
        utterance.rate = 0.5;
        utterance.volume = 1;
        
        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };
        
        utterance.onerror = () => {
          setIsSpeaking(false);
          resolve();
        };
        
        window.speechSynthesis.speak(utterance);
      };

      // Проверяем, загружены ли голоса
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoiceAndSpeak();
      } else {
        window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
      }
    });
  };

  const speakWithNativeAPI = async (letter: string) => {
    return new Promise<void>((resolve) => {
      // Для React Native используем Expo Speech API (если доступно)
      // Или стандартный Speech Synthesis API
      
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(letter);
        
        // Настройки для более естественного звучания на мобильных
        utterance.pitch = 0.9;
        utterance.rate = 0.4; // Медленнее для мобильных
        utterance.volume = 1;
        
        // Пытаемся найти лучший доступный голос
        const voices = window.speechSynthesis.getVoices();
        const bestVoice = voices.find(v => 
          v.lang.includes('ru') || v.lang.includes('tg') || v.lang.includes('tj')
        ) || voices.find(v => v.name.toLowerCase().includes('male')) || voices[0];
        
        if (bestVoice) {
          utterance.voice = bestVoice;
          utterance.lang = bestVoice.lang;
        }
        
        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };
        
        utterance.onerror = () => {
          setIsSpeaking(false);
          resolve();
        };
        
        // Останавливаем предыдущую озвучку
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
        resolve();
      }
    });
  };

  // Добавляем скрипт ResponsiveVoice только для веб-версии
  useEffect(() => {
    if (Platform.OS === 'web' && !document.getElementById('responsive-voice-script')) {
      const script = document.createElement('script');
      script.id = 'responsive-voice-script';
      script.src = 'https://code.responsivevoice.org/responsivevoice.js';
      script.onload = () => {
        console.log('ResponsiveVoice loaded');
        (window as any).responsiveVoice.init();
      };
      document.head.appendChild(script);
    }

    // Предзагрузка голосов для мобильных устройств
    if (Platform.OS !== 'web' && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const handleLetterPress = (letter: Letter) => {
    if (isSpeaking) return;
    
    setSelectedLetter(letter);
    
    // На мобильных показываем модалку
    if (isMobile) {
      setModalVisible(true);
    }
    
    // Озвучиваем букву
    const letterToSpeak = letter.letter.split(' ')[0];
    speakLetter(letterToSpeak);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedLetter(null);
  };

  const speakSelectedLetter = () => {
    if (selectedLetter && !isSpeaking) {
      const letterToSpeak = selectedLetter.letter.split(' ')[0];
      speakLetter(letterToSpeak);
    }
  };

  // Компонент с деталями буквы
  const LetterDetails = ({ letter, isModal = false }: { letter: Letter; isModal?: boolean }) => (
    <View style={[
      styles.detailsCard, 
      { backgroundColor: colors.card, borderColor: colors.border },
      isModal && styles.modalCard
    ]}>
      {isModal && (
        <Pressable 
          style={styles.closeButton}
          onPress={closeModal}
          hitSlop={10}
        >
          <Ionicons name="close" size={24} color={colors.textSecondary} />
        </Pressable>
      )}
      
      <Pressable 
        onPress={speakSelectedLetter}
        style={({ pressed }) => [
          styles.letterPressable,
          pressed && styles.letterPressablePressed
        ]}
      >
        <Text style={[styles.detailsLetter, { color: colors.text }]}>
          {letter.letter}
        </Text>
        <View style={[styles.speakerIcon, { backgroundColor: colors.primary }]}>
          <Ionicons 
            name={isSpeaking ? "volume-high" : "volume-medium"} 
            size={16} 
            color="#ffffff" 
          />
        </View>
      </Pressable>
      
      <Text style={[styles.detailsTranscription, { color: colors.textSecondary }]}>
        {t('transcription')}: <Text style={[styles.transcriptionText, { color: colors.primary }]}>
          {letter.transcription}
        </Text>
      </Text>
      
      <Text style={[styles.examplesTitle, { color: colors.text }]}>
        {t('examples')}:
      </Text>
      
      <View style={styles.examplesContainer}>
        {(language === 'en' ? letter.examples_en : letter.examples).map((example, index) => (
          <View key={index} style={styles.exampleItem}>
            <View style={[styles.bulletPoint, { backgroundColor: colors.primary }]} />
            <Text style={[styles.exampleText, { color: colors.textSecondary }]}>
              {example}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with back button */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.push('/')}
          hitSlop={20}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textSecondary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('tajikAlphabet')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('clickLetterInfo')}
        </Text>
        
        <View style={styles.lettersGrid}>
          {TAJIK_ALPHABET.map((item, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.letterCard,
                { backgroundColor: colors.card, borderColor: colors.border },
                pressed && styles.letterCardPressed,
                !isMobile && selectedLetter?.letter === item.letter && { 
                  backgroundColor: colors.primary, 
                  borderColor: colors.primary 
                }
              ]}
              onPress={() => handleLetterPress(item)}
            >
              <Text style={[
                styles.letterText,
                { color: colors.text },
                !isMobile && selectedLetter?.letter === item.letter && { color: '#ffffff' }
              ]}>
                {item.letter}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Показываем детали только на больших экранах */}
        {!isMobile && selectedLetter && (
          <LetterDetails letter={selectedLetter} />
        )}
      </ScrollView>

      {/* Модальное окно для мобильных устройств */}
      <Modal
        visible={modalVisible && isMobile}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.modalContainer}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              {selectedLetter && <LetterDetails letter={selectedLetter} isModal={true} />}
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  lettersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  letterCard: {
    width: isMobile ? Math.min(64, (screenWidth - 80) / 6) : 64,
    height: isMobile ? Math.min(64, (screenWidth - 80) / 6) : 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
      },
    }),
    borderWidth: 1,
  },
  letterCardPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.8,
  },
  letterText: {
    fontSize: isMobile ? 18 : 22,
    fontWeight: '600',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
  detailsCard: {
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
      },
    }),
    borderWidth: 1,
  },
  modalCard: {
    margin: 0,
    maxHeight: screenHeight * 0.8,
  },
  letterPressable: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    position: 'relative',
  },
  letterPressablePressed: {
    backgroundColor: '#f3f4f6',
  },
  detailsLetter: {
    fontSize: isMobile ? 42 : 52,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
  speakerIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsTranscription: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 16,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  transcriptionText: {
    fontWeight: '600',
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
  examplesContainer: {
    gap: 8,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 10,
  },
  exampleText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  
  // Стили для модального окна
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: screenWidth * 0.9,
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});