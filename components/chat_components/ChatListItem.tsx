import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Chat, ResponsiveDimensions } from '@/types/chat';
import { AI_CONFIGS, AMEENA_MODES } from '@/utils/constants';

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  dimensions: ResponsiveDimensions;
  colors: any;
  onPress: () => void;
  onDelete: () => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  isSelected,
  dimensions,
  colors,
  onPress,
  onDelete
}) => {
  return (
    <TouchableOpacity
      style={[{
        backgroundColor: colors.card,
        padding: dimensions.spacing.medium,
        marginBottom: dimensions.spacing.medium,
        borderRadius: dimensions.borderRadius.medium,
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? colors.primary : colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }]}
      onPress={onPress}
    >
      <View style={[{
        flexDirection: dimensions.isTablet ? 'row' : 'column',
        alignItems: dimensions.isTablet ? 'center' : 'stretch',
      }]}>
        <View style={[{
          flex: 1,
          marginBottom: dimensions.isTablet ? 0 : dimensions.spacing.small,
        }]}>
          <Text style={[{
            fontSize: dimensions.fontSize.medium, 
            color: colors.text,
            fontWeight: 'bold',
          }]}>
            {chat.title}
          </Text>
          <Text style={[{
            fontSize: dimensions.fontSize.tiny, 
            color: colors.textSecondary, 
            marginTop: 4 
          }]}>
            {AI_CONFIGS[chat.aiType || 'gemini'].avatar} {AI_CONFIGS[chat.aiType || 'gemini'].name}
            {chat.aiType === 'ameena' ? ` (${AMEENA_MODES[chat.mode]?.title})` : ''}
          </Text>
          {chat.lastMessage && (
            <Text style={[{
              fontSize: dimensions.fontSize.small, 
              color: colors.textSecondary, 
              marginTop: 4 
            }]} numberOfLines={2}>
              {chat.lastMessage}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={onDelete}
          style={[{
            padding: dimensions.spacing.small,
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            borderRadius: dimensions.borderRadius.small,
            alignSelf: dimensions.isTablet ? 'center' : 'flex-end',
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
          }]}
        >
          <Text style={[{
            fontSize: dimensions.fontSize.medium 
          }]}>
            🗑️
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
