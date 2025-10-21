import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const TranslateButton = ({ onPress, isLoading, text, colors, t }) => {
  const styles = StyleSheet.create({
    translateBtn: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 16,
      minWidth: 140,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
    translateBtnDisabled: {
      backgroundColor: colors.textTertiary,
      shadowOpacity: 0.1,
    },
    translateBtnText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '700',
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading || !text.trim()}
      style={[
        styles.translateBtn,
        (isLoading || !text.trim()) && styles.translateBtnDisabled
      ]}
      activeOpacity={0.8}
    >
      <Text style={styles.translateBtnText}>
        {isLoading ? '🔄 ' + t('translating') : '🌐 ' + t('translate')}
      </Text>
    </TouchableOpacity>
  );
};

export default TranslateButton;