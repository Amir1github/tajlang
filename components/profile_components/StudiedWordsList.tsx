import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, TextInput, Alert, Platform } from 'react-native';
import { BookOpen, Plus, X, Loader } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import WordCard from '@/components/WordCard';

interface Word {
  id: string;
  level_id: string;
  tajik: string;
  english: string;
  russian: string;
  explanation: string;
  ru_explanation: string;
  examples: string[];
}

interface StudiedWordsListProps {
  completedLevels: string[];
  colors: any;
  t: (key: string) => string;
}

export default function StudiedWordsList({ completedLevels, colors, t }: StudiedWordsListProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWord, setNewWord] = useState({
    tajik: '',
    english: '',
    russian: '',
    explanation: '',
    ru_explanation: '',
    examples: ''
  });
  const [addingWord, setAddingWord] = useState(false);

  // Загрузка изученных слов
  useEffect(() => {
    if (completedLevels.length > 0) {
      fetchStudiedWords();
    } else {
      setLoading(false);
    }
  }, [completedLevels]);

  const fetchStudiedWords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .in('level_id', completedLevels)
        .order('tajik');

      if (error) throw error;
      setWords(data || []);
    } catch (error) {
      console.error('Error fetching studied words:', error);
    } finally {
      setLoading(false);
    }
  };

  // Функция для получения автоматической дескрипции от Ameena
  const getAmeenaDescription = async (word: string, language: 'en' | 'ru' = 'en') => {
    try {
      const response = await fetch('/api/ameena/describe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word, language }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.description;
      }
      
      // Fallback - простая заглушка
      return language === 'ru' 
        ? `Описание слова "${word}" на таджикском языке`
        : `Description of the word "${word}" in Tajik language`;
    } catch (error) {
      console.error('Error getting Ameena description:', error);
      return language === 'ru' 
        ? `Описание слова "${word}"`
        : `Description of the word "${word}"`;
    }
  };

  const handleAddWord = async () => {
    if (!newWord.tajik.trim() || !newWord.english.trim()) {
      Alert.alert(t('error'), t('fillRequiredFields'));
      return;
    }

    try {
      setAddingWord(true);
      
      // Получаем автоматические описания от Ameena
      const [englishDescription, russianDescription] = await Promise.all([
        getAmeenaDescription(newWord.tajik, 'en'),
        getAmeenaDescription(newWord.tajik, 'ru')
      ]);

      const { data, error } = await supabase
        .from('words')
        .insert({
          level_id: null, // Пользовательские слова не привязаны к уровню
          tajik: newWord.tajik.trim(),
          english: newWord.english.trim(),
          russian: newWord.russian.trim() || newWord.english.trim(),
          explanation: newWord.explanation.trim() || englishDescription,
          ru_explanation: newWord.ru_explanation.trim() || russianDescription,
          examples: newWord.examples.trim() ? [newWord.examples.trim()] : []
        })
        .select()
        .single();

      if (error) throw error;

      setWords(prev => [data, ...prev]);
      setShowAddModal(false);
      setNewWord({
        tajik: '',
        english: '',
        russian: '',
        explanation: '',
        ru_explanation: '',
        examples: ''
      });
      
      Alert.alert(t('success'), t('wordAddedSuccessfully'));
    } catch (error) {
      console.error('Error adding word:', error);
      Alert.alert(t('error'), t('failedToAddWord'));
    } finally {
      setAddingWord(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <View style={styles.header}>
          <BookOpen size={24} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>{t('studiedWords')}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Loader size={20} color={colors.textSecondary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>{t('loading')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <BookOpen size={24} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>{t('studiedWords')}</Text>
        
      </View>

      {words.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {completedLevels.length === 0 
              ? t('completeLevelsToSeeWords')
              : t('noWordsStudiedYet')
            }
          </Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.wordsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.wordsListContent}
        >
          {words.map((word) => (
            <WordCard
              key={word.id}
              tajik={word.tajik}
              english={word.english}
              russian={word.russian}
              explanation={word.explanation}
              ru_explanation={word.ru_explanation}
              examples={word.examples}
            />
          ))}
        </ScrollView>
      )}

      {/* Модальное окно для добавления слова */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t('addNewWord')}</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowAddModal(false)}
              >
                <X size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>{t('tajikWord')} *</Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.border 
                  }]}
                  value={newWord.tajik}
                  onChangeText={(text) => setNewWord(prev => ({ ...prev, tajik: text }))}
                  placeholder={t('enterTajikWord')}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>{t('englishTranslation')} *</Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.border 
                  }]}
                  value={newWord.english}
                  onChangeText={(text) => setNewWord(prev => ({ ...prev, english: text }))}
                  placeholder={t('enterEnglishTranslation')}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>{t('russianTranslation')}</Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.border 
                  }]}
                  value={newWord.russian}
                  onChangeText={(text) => setNewWord(prev => ({ ...prev, russian: text }))}
                  placeholder={t('enterRussianTranslation')}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>{t('englishExplanation')}</Text>
                <TextInput
                  style={[styles.textArea, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.border 
                  }]}
                  value={newWord.explanation}
                  onChangeText={(text) => setNewWord(prev => ({ ...prev, explanation: text }))}
                  placeholder={t('enterEnglishExplanation')}
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>{t('russianExplanation')}</Text>
                <TextInput
                  style={[styles.textArea, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.border 
                  }]}
                  value={newWord.ru_explanation}
                  onChangeText={(text) => setNewWord(prev => ({ ...prev, ru_explanation: text }))}
                  placeholder={t('enterRussianExplanation')}
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>{t('examples')}</Text>
                <TextInput
                  style={[styles.textArea, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.border 
                  }]}
                  value={newWord.examples}
                  onChangeText={(text) => setNewWord(prev => ({ ...prev, examples: text }))}
                  placeholder={t('enterExamples')}
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={2}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
                  {t('cancel')}
                </Text>
              </Pressable>
              
              <Pressable
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={handleAddWord}
                disabled={addingWord}
              >
                {addingWord ? (
                  <Loader size={20} color="#fff" />
                ) : (
                  <Plus size={20} color="#fff" />
                )}
                <Text style={styles.addButtonText}>
                  {addingWord ? t('adding') : t('addWord')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    gap: 12,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  wordsList: {
    maxHeight: 300,
  },
  wordsListContent: {
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  modalBody: {
    paddingHorizontal: 20,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
