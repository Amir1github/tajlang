import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Lock, LogOut, MessageCircle } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

interface AccountActionsProps {
  onChangePassword: () => void;
  onSignOut: () => void;
  onChatsPress: () => void;
}

export default function AccountActions({ onChangePassword, onSignOut, onChatsPress }: AccountActionsProps) {
  const { t, colors } = useLanguage();

  return (
    <View style={styles.accountActions}>
      <Pressable
        style={[styles.actionButton, styles.chatsButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
        onPress={onChatsPress}
      >
        <MessageCircle size={20} color={colors.primary} />
        <Text style={[styles.actionButtonText, { color: colors.primary }]}>Чаты</Text>
      </Pressable>

      <Pressable
        style={[styles.actionButton, styles.changePasswordButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
        onPress={onChangePassword}
      >
        <Lock size={20} color={colors.primary} />
        <Text style={[styles.actionButtonText, { color: colors.primary }]}>{t('changePassword')}</Text>
      </Pressable>

      <Pressable
        style={[styles.actionButton, styles.signOutButton, { backgroundColor: colors.card, borderColor: colors.error }]}
        onPress={onSignOut}
      >
        <LogOut size={20} color={colors.error} />
        <Text style={[styles.actionButtonText, { color: colors.error }]}>{t('signOut')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  accountActions: {
    marginTop: 32,
    gap: 16,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    marginBottom: Platform.select({ 
      ios: 32, 
      android: 32, 
      default: 32 
    }),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  changePasswordButton: {
    // Styles handled by parent
  },
  signOutButton: {
    // Styles handled by parent
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});