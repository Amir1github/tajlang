import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Linking 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ResponsiveDimensions } from '@/types/chat';
import { ModeSelector } from './ModeSelector';
import { AI_CONFIGS } from '@/utils/constants';

interface ChatHeaderProps {
  selectedAI: string;
  selectedMode: string;
  dimensions: ResponsiveDimensions;
  colors: any;
  t: (key: string) => string;
  onSelectAI: (ai: string) => void;
  onModeChange: (mode: string) => void;
  onToggleChatList: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedAI,
  selectedMode,
  dimensions,
  colors,
  t,
  onSelectAI,
  onModeChange,
  onToggleChatList
}) => {
  const currentAI = AI_CONFIGS[selectedAI];

  const handleWebsitePress = () => {
    if (currentAI.website) {
      Linking.openURL(currentAI.website);
    }
  };

  const renderAvatar = () => {
    if (selectedAI === 'ameena') {
      return (
        <LinearGradient
          colors={['#6B46C1', '#10B981']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.logoMark, {
            width: dimensions.isDesktop ? 40 : 32,
            height: dimensions.isDesktop ? 40 : 32,
            borderRadius: 10,
          }]}
        >
          <Text style={[styles.logoText, {
            fontSize: dimensions.isDesktop ? 18 : 14,
          }]}>A</Text>
        </LinearGradient>
      );
    } else {
      return (
        <Text style={[styles.avatarEmoji, {
          fontSize: dimensions.isDesktop ? 32 : 24,
        }]}>
          {currentAI.avatar}
        </Text>
      );
    }
  };

  return (
    <View style={[{
      backgroundColor: colors.card, 
      padding: dimensions.headerPadding, 
      borderRadius: dimensions.borderRadius.medium,
      marginBottom: dimensions.spacing.medium,
      maxWidth: dimensions.isDesktop ? 1000 : undefined,
      alignSelf: 'center',
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }]}>
      <View style={[{
        marginBottom: dimensions.spacing.medium,
        flexDirection: dimensions.isTablet ? 'row' : 'column',
        alignItems: 'center',
      }]}>
        <View style={[{
          flex: dimensions.isTablet ? 1 : undefined,
          marginBottom: dimensions.isTablet ? 0 : dimensions.spacing.medium,
          alignItems: 'center',
        }]}>
          <Text style={[{
            fontSize: dimensions.fontSize.large, 
            color: colors.text,
            textAlign: 'center',
            fontWeight: 'bold',
          }]}>
            {t('tajikLanguageChat')}
          </Text>
          
          {/* AI Info with Avatar */}
          <View style={[styles.aiInfoRow, {
            marginTop: dimensions.spacing.small,
          }]}>
            {renderAvatar()}
            <View style={styles.aiDetails}>
              <Text style={[{
                fontSize: dimensions.fontSize.small, 
                color: colors.text,
                fontWeight: '600',
              }]}>
                {currentAI.name}
              </Text>
              <Text style={[{
                fontSize: dimensions.fontSize.small * 0.85, 
                color: colors.textSecondary,
              }]}>
                {currentAI.description}
              </Text>
            </View>
          </View>

          {/* Ameena Website Link */}
          {selectedAI === 'ameena' && currentAI.website && (
            <TouchableOpacity 
              onPress={handleWebsitePress} 
              style={[styles.websiteButton, {
                marginTop: dimensions.spacing.small,
                paddingVertical: dimensions.spacing.small * 0.6,
                paddingHorizontal: dimensions.spacing.small,
                borderRadius: dimensions.borderRadius.small,
              }]}
            >
              <Text style={[styles.websiteText, {
                fontSize: dimensions.fontSize.small * 0.9,
              }]}>
                🌐 {t('original_website') || 'Сайти аслӣ'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[{
            backgroundColor: colors.primary,
            paddingHorizontal: dimensions.spacing.medium,
            paddingVertical: dimensions.spacing.small,
            borderRadius: dimensions.borderRadius.small,
            height: dimensions.buttonHeight,
            justifyContent: 'center',
            minWidth: 80,
          }]}
          onPress={onToggleChatList}
        >
          <Text style={[{
            color: '#ffffff', 
            fontSize: dimensions.fontSize.small,
            fontWeight: 'bold',
            textAlign: 'center',
          }]}>
            {t('chats') || 'Чаты'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Compact AI Selector */}
      <View style={[styles.aiSelectorContainer, {
        marginBottom: selectedAI === 'ameena' ? dimensions.spacing.medium : 0,
      }]}>
        <View style={[styles.aiSelector, {
          backgroundColor: colors.background,
          borderRadius: dimensions.borderRadius.small,
          padding: 4,
        }]}>
          <TouchableOpacity
            onPress={() => onSelectAI('gemini')}
            style={[
              styles.aiButton,
              {
                paddingVertical: dimensions.spacing.small,
                paddingHorizontal: dimensions.spacing.medium,
                borderRadius: dimensions.borderRadius.small - 2,
                backgroundColor: selectedAI === 'gemini' ? colors.primary : 'transparent',
              }
            ]}
          >
            <Text style={[
              styles.buttonText,
              {
                fontSize: dimensions.fontSize.small,
                color: selectedAI === 'gemini' ? '#ffffff' : colors.text,
                fontWeight: selectedAI === 'gemini' ? 'bold' : 'normal',
              }
            ]}>
              ✨ Gemini
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onSelectAI('ameena')}
            style={[
              styles.aiButton,
              {
                paddingVertical: dimensions.spacing.small,
                paddingHorizontal: dimensions.spacing.medium,
                borderRadius: dimensions.borderRadius.small - 2,
                backgroundColor: selectedAI === 'ameena' ? colors.primary : 'transparent',
              }
            ]}
          >
            <Text style={[
              styles.buttonText,
              {
                fontSize: dimensions.fontSize.small,
                color: selectedAI === 'ameena' ? '#ffffff' : colors.text,
                fontWeight: selectedAI === 'ameena' ? 'bold' : 'normal',
              }
            ]}>
              Амина
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mode Selector for Ameena */}
      {selectedAI === 'ameena' && (
        <ModeSelector
          selectedMode={selectedMode}
          onSelectMode={onModeChange}
          dimensions={dimensions}
          colors={colors}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  aiInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoMark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  avatarEmoji: {
    lineHeight: undefined,
  },
  aiDetails: {
    alignItems: 'flex-start',
  },
  websiteButton: {
    backgroundColor: 'rgba(107, 70, 193, 0.1)',
    alignSelf: 'center',
  },
  websiteText: {
    color: '#6B46C1',
    fontWeight: '500',
  },
  aiSelectorContainer: {
    alignItems: 'center',
  },
  aiSelector: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 4,
  },
  aiButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  buttonText: {
    textAlign: 'center',
  },
});