import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Platform } from 'react-native';
import { Chat, ResponsiveDimensions } from '@/types/chat';
import { AI_CONFIGS, AMEENA_MODES } from '@/utils/constants';
import { ChatListItem } from './ChatListItem';
interface ChatListProps {
  chats: Chat[];
  currentChatId: string | null;
  dimensions: ResponsiveDimensions;
  colors: any;
  t: (key: string) => string;
  slideAnim: Animated.Value;
  showChatList: boolean;
  onCreateNewChat: () => void;
  onLoadChat: (chatId: string) => void;
  onDeletePress: (chatId: string) => void;
  onToggleChatList: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  currentChatId,
  dimensions,
  colors,
  t,
  slideAnim,
  showChatList,
  onCreateNewChat,
  onLoadChat,
  onDeletePress,
  onToggleChatList
}) => {
  return (
    <Animated.View
      style={[{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background,
        width: dimensions.chatListWidth,
        transform: [{ translateX: slideAnim }],
        zIndex: showChatList ? 1000 : -1,
      }]}
    >
      <View style={[{
        flex: 1, 
        padding: dimensions.contentPadding,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
      }]}>
        <View style={[{
          backgroundColor: colors.card,
          padding: dimensions.spacing.medium,
          borderRadius: dimensions.borderRadius.medium,
          marginBottom: dimensions.spacing.large,
          flexDirection: dimensions.isTablet ? 'row' : 'column',
          alignItems: dimensions.isTablet ? 'center' : 'stretch',
        }]}>
          <Text style={[{
            fontSize: dimensions.fontSize.large, 
            color: colors.text,
            marginBottom: dimensions.isTablet ? 0 : dimensions.spacing.medium,
            flex: dimensions.isTablet ? 1 : undefined,
            fontWeight: 'bold',
          }]}>
            {t('listChats') || 'Список чатов'}
          </Text>
          <View style={[{
            flexDirection: 'row', 
            gap: dimensions.spacing.small 
          }]}>
            <TouchableOpacity
              style={[{
                backgroundColor: colors.primary,
                paddingHorizontal: dimensions.spacing.medium,
                paddingVertical: dimensions.spacing.small,
                borderRadius: dimensions.borderRadius.small,
                height: dimensions.buttonHeight,
                justifyContent: 'center',
              }]}
              onPress={onCreateNewChat}
            >
              <Text style={[{
                color: '#ffffff', 
                fontSize: dimensions.fontSize.small,
                fontWeight: 'bold',
              }]}>
                + {t('newChat')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[{
                backgroundColor: colors.border,
                paddingHorizontal: dimensions.spacing.medium,
                paddingVertical: dimensions.spacing.small,
                borderRadius: dimensions.borderRadius.small,
                height: dimensions.buttonHeight,
                justifyContent: 'center',
              }]}
              onPress={onToggleChatList}
            >
              <Text style={[{
                color: colors.text, 
                fontSize: dimensions.fontSize.small,
                fontWeight: 'bold',
              }]}>
                {t('back')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView style={{ flex: 1 }}>
          {chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={currentChatId === chat.id}
              dimensions={dimensions}
              colors={colors}
              onPress={() => onLoadChat(chat.id)}
              onDelete={() => onDeletePress(chat.id)}
            />
          ))}
          {chats.length === 0 && (
            <View style={[{
              backgroundColor: colors.card,
              padding: dimensions.spacing.large,
              borderRadius: dimensions.borderRadius.medium,
              alignItems: 'center',
            }]}>
              <Text style={[{
                fontSize: dimensions.fontSize.medium, 
                color: colors.textSecondary,
                textAlign: 'center',
              }]}>
                {t('noSavedChats')}{'\n'}{t('createNewChat')}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Animated.View>
  );
};