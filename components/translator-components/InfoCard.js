import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoCard = ({ t, colors }) => {
  const styles = StyleSheet.create({
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    infoTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    infoText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 6,
      lineHeight: 16,
    },
    infoTip: {
      color: colors.error || '#ef4444',
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>ℹ️ Информация о сервисе</Text>
      <Text style={styles.infoText}>{t('infoApi')}</Text>
      <Text style={styles.infoText}>{t('infoLimit')}</Text>
      <Text style={[styles.infoText, styles.infoTip]}>
        💡 {t('infoTip')}
      </Text>
    </View>
  );
};

export default InfoCard;