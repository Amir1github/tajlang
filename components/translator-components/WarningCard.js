import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WarningCard = ({ t }) => {
  const styles = StyleSheet.create({
    warningCard: {
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 193, 7, 0.3)',
    },
    warningText: {
      color: '#f59e0b',
      textAlign: 'center',
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
    },
  });

  return (
    <View style={styles.warningCard}>
      <Text style={styles.warningText}>
        ⚠️ {t('warning')}
      </Text>
    </View>
  );
};

export default WarningCard;