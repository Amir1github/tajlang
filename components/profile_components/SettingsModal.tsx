import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Platform, Switch } from 'react-native';
import { Sun, Moon, MessageCircle } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { updateWantChats } from '@/lib/supabase';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  wantChats?: boolean;
  onWantChatsChange?: (value: boolean) => void;
}

export default function SettingsModal({ visible, onClose, wantChats = false, onWantChatsChange }: SettingsModalProps) {
  const { t, language, setLanguage, theme, setTheme, colors } = useLanguage();
  const { user } = useAuth();

  const handleWantChatsChange = async (value: boolean) => {
    if (!user?.id) return;
    
    try {
      const { error } = await updateWantChats(user.id, value);
      if (error) {
        console.error('Error updating want_chats:', error);
        return;
      }
      onWantChatsChange?.(value);
    } catch (error) {
      console.error('Error updating want_chats:', error);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('settings')}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={{ color: colors.textSecondary }}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('language')}</Text>
            <View style={styles.languageOptions}>
              <Pressable
                style={[
                  styles.languageOption, 
                  { borderColor: colors.border },
                  language === 'en' && styles.languageOptionActive,
                  language === 'en' && { backgroundColor: colors.secondary, borderColor: colors.primary },
                ]}
                onPress={() => setLanguage('en')}
              >
                <Text
                  style={[
                    styles.languageText, 
                    { color: colors.textSecondary },
                    language === 'en' && { color: colors.primary, fontWeight: '600' },
                  ]}
                >
                  English
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.languageOption, 
                  { borderColor: colors.border },
                  language === 'ru' && styles.languageOptionActive,
                  language === 'ru' && { backgroundColor: colors.secondary, borderColor: colors.primary },
                ]}
                onPress={() => setLanguage('ru')}
              >
                <Text
                  style={[
                    styles.languageText, 
                    { color: colors.textSecondary },
                    language === 'ru' && { color: colors.primary, fontWeight: '600' },
                  ]}
                >
                  Русский
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('theme')}</Text>
            <View style={styles.languageOptions}>
              <Pressable
                style={[
                  styles.languageOption, 
                  { borderColor: colors.border },
                  theme === 'light' && styles.languageOptionActive,
                  theme === 'light' && { backgroundColor: colors.secondary, borderColor: colors.primary },
                ]}
                onPress={() => setTheme('light')}
              >
                <Sun size={20} color={theme === 'light' ? colors.primary : colors.textSecondary} />
                <Text
                  style={[
                    styles.languageText, 
                    { color: colors.textSecondary },
                    theme === 'light' && { color: colors.primary, fontWeight: '600' },
                  ]}
                >
                  {t('lightMode')}
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.languageOption, 
                  { borderColor: colors.border },
                  theme === 'dark' && styles.languageOptionActive,
                  theme === 'dark' && { backgroundColor: colors.secondary, borderColor: colors.primary },
                ]}
                onPress={() => setTheme('dark')}
              >
                <Moon size={20} color={theme === 'dark' ? colors.primary : colors.textSecondary} />
                <Text
                  style={[
                    styles.languageText, 
                    { color: colors.textSecondary },
                    theme === 'dark' && { color: colors.primary, fontWeight: '600' },
                  ]}
                >
                  {t('darkMode')}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Общение</Text>
            <View style={[styles.chatSetting, { backgroundColor: colors.background }]}>
              <View style={styles.chatSettingLeft}>
                <MessageCircle size={20} color={colors.primary} />
                <View style={styles.chatSettingText}>
                  <Text style={[styles.chatSettingTitle, { color: colors.text }]}>
                    Разрешить чаты
                  </Text>
                  <Text style={[styles.chatSettingDescription, { color: colors.textSecondary }]}>
                    Другие пользователи смогут начать с вами чат
                  </Text>
                </View>
              </View>
              <Switch
                value={wantChats}
                onValueChange={handleWantChatsChange}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={wantChats ? '#fff' : colors.textSecondary}
              />
            </View>
          </View>
          
          <View style={styles.footerLinks}>
            <Pressable 
              onPress={() => {
                onClose();
                router.push('/privacy-policy');
              }}
              style={styles.footerLink}
            >
              <Text style={[styles.footerLinkText, { color: colors.primary }]}>
                {t('privacyPolicy')}
              </Text>
            </Pressable>
            
            <Text style={{ color: colors.textSecondary }}> • </Text>
            
            <Pressable 
              onPress={() => {
                onClose();
                router.push('/our-team');
              }}
              style={styles.footerLink}
            >
              <Text style={[styles.footerLinkText, { color: colors.primary }]}>
                {t('ourTeam')}
              </Text>
            </Pressable>
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
    padding: 16,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      },
    }),
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
  },
  closeButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  languageOptions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  languageOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  languageOptionActive: {
    // Active styles handled in component
  },
  languageText: {
    fontSize: 16,
  },
  chatSetting: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatSettingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  chatSettingText: {
    marginLeft: 12,
    flex: 1,
  },
  chatSettingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  chatSettingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  footerLink: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  footerLinkText: {
    fontSize: 14,
    fontWeight: '500',
  },
});