import { View, Text, StyleSheet, Pressable, Modal, Image } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { X } from 'lucide-react-native';

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('settings')}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6b7280" />
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('language')}</Text>
            <View style={styles.languageOptions}>
              <Pressable
                style={[
                  styles.languageOption,
                  language === 'en' && styles.languageOptionActive,
                ]}
                onPress={() => setLanguage('en')}
              >
                <Image
                  source={require('@/assets/images/united-states.png')}
                  style={styles.flag}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.languageText,
                    language === 'en' && styles.languageTextActive,
                  ]}
                >
                  English
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.languageOption,
                  language === 'ru' && styles.languageOptionActive,
                ]}
                onPress={() => setLanguage('ru')}
              >
                <Image
                  source={require('@/assets/images/russia.png')}
                  style={styles.flag}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.languageText,
                    language === 'ru' && styles.languageTextActive,
                  ]}
                >
                  Русский
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  languageOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  languageOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  languageOptionActive: {
    backgroundColor: '#f3f4f6',
    borderColor: '#6366f1',
  },
  flag: {
    width: 24,
    height: 16,
  },
  languageText: {
    fontSize: 16,
    color: '#6b7280',
  },
  languageTextActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
});
