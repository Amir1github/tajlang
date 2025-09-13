import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({ t, colors }) => {
  const styles = StyleSheet.create({
    header: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 4,
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 6,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{t('translatorTitle')}</Text>
      <Text style={styles.subtitle}>
      {t('translatorHeadersubtitle')}
      </Text>
    </View>
  );
};

export default Header;