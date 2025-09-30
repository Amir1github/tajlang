import { View, Text, StyleSheet, Image } from 'react-native';

interface LeaderboardHeaderProps {
  colors: {
    text: string;
    textSecondary: string;
  };
  t: (key: string) => string;
}

export function LeaderboardHeader({ colors, t }: LeaderboardHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <Image 
        source={require('@/assets/images/icon.png')} 
        style={styles.headerIcon} 
        resizeMode="contain"
      />
      <View>
        <Text style={[styles.header, { color: colors.text }]}>
          {t('leaderboard')}
        </Text>
        <Text style={[styles.subHeader, { color: colors.textSecondary }]}>
          {t('top_learners')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    width: 56,
    height: 56,
    marginRight: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
  },
  subHeader: {
    fontSize: 14,
    marginTop: 4,
  },
});