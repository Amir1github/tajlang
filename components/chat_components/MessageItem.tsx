import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message, ResponsiveDimensions } from '@/types/chat';

interface MessageItemProps {
  message: Message;
  dimensions: ResponsiveDimensions;
  colors: any;
}

export const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  dimensions, 
  colors 
}) => {
  if (message.role === 'thinking') {
    return (
      <View style={[styles.messageContainer, {
        alignSelf: 'flex-start',
        backgroundColor: colors.card,
        borderRadius: dimensions.borderRadius.medium,
        padding: dimensions.spacing.medium,
        marginBottom: dimensions.spacing.small,
        maxWidth: typeof dimensions.messageMaxWidth === 'string'
          ? dimensions.width * (parseInt(dimensions.messageMaxWidth) / 100 || 0.8)
          : dimensions.messageMaxWidth,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: 0.7,
      }]}>
        <Text style={[styles.messageText, { 
          fontSize: dimensions.fontSize.medium, 
          color: colors.text, 
          fontStyle: 'italic' 
        }]}>
          {message.text}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.messageContainer, {
      alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
      backgroundColor: message.role === 'user' ? colors.primary : colors.card,
      borderRadius: dimensions.borderRadius.medium,
      padding: dimensions.spacing.medium,
      marginBottom: dimensions.spacing.small,
      maxWidth: typeof dimensions.messageMaxWidth === 'string'
        ? dimensions.width * (parseInt(dimensions.messageMaxWidth) / 100 || 0.8)
        : dimensions.messageMaxWidth,
      borderWidth: message.role === 'bot' ? 1 : 0,
      borderColor: colors.border,
      ...styles.messageShadow,
    }]}>
      {message.role === 'bot' && (
        <View style={[styles.botHeader, { marginBottom: dimensions.spacing.small / 2 }]}>
          <Text style={{ fontSize: dimensions.fontSize.small, marginRight: 4 }}>
            {message.avatar}
          </Text>
          <Text style={[styles.botName, { 
            fontSize: dimensions.fontSize.tiny, 
            color: colors.textSecondary 
          }]}>
            {message.aiName}
          </Text>
        </View>
      )}
      <Text style={[styles.messageText, { 
        fontSize: dimensions.fontSize.medium, 
        color: message.role === 'user' ? '#ffffff' : colors.text,
        lineHeight: dimensions.fontSize.medium * 1.3,
      }]}>
        {message.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  botHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botName: {
    fontWeight: 'bold',
  },
  messageText: {
    // Message text styles
  },
});