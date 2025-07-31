import { Tabs, router } from 'expo-router';
import { Book, Trophy, User, CirclePlus as PlusCircle, MessageSquare, Languages } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';

export default function TabLayout() {
  const { t, colors } = useLanguage();
  const [menuVisible, setMenuVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    Animated.timing(animation, {
      toValue: menuVisible ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setMenuVisible(!menuVisible);
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -10],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const handleTranslatorPress = () => {
  setMenuVisible(false);
  router.push('/translator');
};

const handleChatAssistantPress = () => {
  setMenuVisible(false);
  router.push('/chat');
};
  return (
  <View style={[styles.container, { backgroundColor: colors.background }]}>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 0,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('learn'),
          tabBarIcon: ({ color, size }) => <Book size={size} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: t('leaderboard'),
          tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>

    {/* Кнопка действия (в правом нижнем углу над таб-баром) */}
    <View style={styles.fabContainer}>
      <TouchableOpacity onPress={toggleMenu} style={[styles.fab, { backgroundColor: colors.primary }]}>
        <PlusCircle size={28} color="#fff" fill={colors.primary} />
      </TouchableOpacity>

      {menuVisible && (
        <Animated.View 
          style={[
            styles.dropdownMenu,
            { backgroundColor: colors.card, shadowColor: colors.shadow },
            {
              opacity,
              transform: [{ translateY }],
            }
          ]}
        >
          <TouchableOpacity style={styles.menuItem} onPress={handleTranslatorPress}
>
            <Languages size={20} color={colors.primary} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: colors.text }]}>{t('translator')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleChatAssistantPress}
>
            <MessageSquare size={20} color={colors.primary} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: colors.text }]}>{t('chatAssistant')}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 80, // Над таб-баром
    right: 20,
    alignItems: 'flex-end',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginBottom: 10,
  },
  dropdownMenu: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 180,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
  },
});
