import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ResponsiveDimensions } from '@/types/chat';
import { AISelector } from './AISelector';
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
          <Text style={[{
            fontSize: dimensions.fontSize.small, 
            color: colors.textSecondary, 
            marginTop: 2,
            textAlign: 'center',
          }]}>
            {AI_CONFIGS[selectedAI].avatar} {AI_CONFIGS[selectedAI].name} - {AI_CONFIGS[selectedAI].description}
          </Text>
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

      <AISelector
        selectedAI={selectedAI}
        onSelectAI={onSelectAI}
        dimensions={dimensions}
        colors={colors}
      />

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