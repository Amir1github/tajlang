import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router'; // если у тебя expo-router

const PageHeader = ({ 
  title, 
  backButtonText = "← Back",
  headerStyle,
  titleStyle,
  backButtonStyle,
  backButtonTextStyle,
  getSpacing,
  getFontSize
}) => {
  const router = useRouter();

  const onBackPress = () => router.push('/grammar');

  return (
    <View style={[styles.header, headerStyle]}>
      <TouchableOpacity 
        style={[styles.backButton, backButtonStyle]}
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.backButtonText, backButtonTextStyle]}>
          {backButtonText}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.headerTitle, titleStyle]} numberOfLines={1} adjustsFontSizeToFit>
        {title}
      </Text>
      <View style={styles.headerSpacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.select({ ios: 44, android: StatusBar.currentHeight || 24 }),
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    minHeight: Platform.select({ ios: 88, android: 72 }),
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    minWidth: 60,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: -0.5,
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 60,
  },
});

export default PageHeader;
