import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { X } from 'lucide-react-native';

type WordCardProps = {
  tajik: string;
  english: string;
  examples?: string[] | null | string;
  explanation?: string;
  ru_explanation: string;
  russian: string;
};
const parseExamples = (
  examples: string[] | null | string
): { tajik: string }[] => {
  if (!examples) return [];

  if (Array.isArray(examples)) {
    return examples.map((item) => {
      if (typeof item === 'string') {
        const parts = item.split(' - ');
        return {
          tajik: parts[0]?.trim() || ''
        };
      }

      return {
        tajik: item.tajik || ''
      };
    });
  }

  if (typeof examples === 'string') {
    try {
      const cleaned = examples.replace(/^\{|\}$/g, '');
      const items = cleaned.split('","').map((item) =>
        item.replace(/^"|"$/g, '')
      );

      return items.map((item) => {
        const parts = item.split(' - ');
        return {
          tajik: parts[0]?.trim() || ''
        };
      });
    } catch (error) {
      console.error('Error parsing examples:', error);
      return [];
    }
  }

  return [];
};

export default function WordCard({ 
  tajik, 
  english, 
  examples = [], 
  explanation = '',
  ru_explanation,
  russian
}: WordCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { t, language, setLanguage, theme, setTheme, colors } = useLanguage();

  // Функции для выбора языка
  const getTranslation = () => {
    const isRussian = language === 'ru' || 
                     language === 'russian' || 
                     language?.toLowerCase().includes('ru');
    return isRussian ? russian : english;
  };

  const getExplanation = () => {
    const isRussian = language === 'ru' || 
                     language === 'russian' || 
                     language?.toLowerCase().includes('ru');
    return isRussian ? ru_explanation : explanation;
  };

  

  const safeExamples = parseExamples(examples);
  const currentTranslation = getTranslation();
  const currentExplanation = getExplanation();

  return (
    <>
      <Pressable 
        style={[styles.wordCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.tajikWord, { color: colors.text }]}>{tajik}</Text>
        <Text style={[styles.translationWord, { color: colors.textSecondary }]}>{currentTranslation}</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {/* Кнопка закрытия с крестиком вверху справа */}
            <Pressable
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <X size={24} color={colors.textSecondary} />
            </Pressable>
            
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{tajik}</Text>
              <Text style={[styles.modalTranslation, { color: colors.textSecondary }]}>{currentTranslation}</Text>
              
              {currentExplanation && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('explanation')}</Text>
                  <Text style={[styles.sectionText, { color: colors.textSecondary }]}>{currentExplanation}</Text>
                </View>
              )}

              {safeExamples.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('examples')}</Text>
                  <View style={styles.examplesContainer}>
                    {safeExamples.map((example, index) => (
                      <View key={index} style={styles.exampleItem}>
                        <Text style={[styles.exampleText, { color: colors.textSecondary }]}>
                          <Text style={[styles.tajikPart, { color: colors.text }]}>{example.tajik}</Text>
                          {example.translation && (
                            <Text style={[styles.translationPart, { color: colors.textSecondary }]}> — {example.translation}</Text>
                          )}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wordCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tajikWord: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  translationWord: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    position: 'relative',
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 48,
  },
  closeIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalTranslation: {
    fontSize: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  examplesContainer: {
    marginTop: 8,
  },
  exampleItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: '#6b7280',
    marginRight: 8,
    lineHeight: 24,
  },
  exampleText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  tajikPart: {
    fontWeight: '600',
  },
  translationPart: {
    fontStyle: 'italic',
  }
});