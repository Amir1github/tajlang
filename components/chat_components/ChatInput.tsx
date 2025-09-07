import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ResponsiveDimensions } from '@/types/chat';
import { SendIcon } from './SendIcon';

interface ChatInputProps {
  input: string;
  onInputChange: (text: string) => void;
  onSend: () => void;
  loading: boolean;
  dimensions: ResponsiveDimensions;
  colors: any;
  t: (key: string) => string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  input, 
  onInputChange, 
  onSend, 
  loading, 
  dimensions, 
  colors, 
  t 
}) => {
  return (
    <View style={[styles.container, {
      maxWidth: dimensions.isDesktop ? 800 : undefined,
      alignSelf: 'center',
      width: '100%',
    }]}>
      <View style={[styles.inputContainer, { 
        backgroundColor: colors.card,
        borderRadius: dimensions.borderRadius.medium,
        paddingHorizontal: dimensions.spacing.medium,
        paddingVertical: dimensions.spacing.small,
        minHeight: dimensions.inputHeight,
        ...styles.inputShadow,
      }]}>
        <TextInput
          style={[styles.textInput, {
            flex: 1,
            fontSize: dimensions.fontSize.medium,
            color: colors.text,
            maxHeight: dimensions.isTablet ? 100 : 80,
            paddingVertical: dimensions.spacing.small,
          }]}
          placeholder={t('placeholder') || 'Введите сообщение...'}
          placeholderTextColor={colors.textTertiary}
          value={input}
          onChangeText={onInputChange}
          onSubmitEditing={onSend}
          editable={!loading}
          returnKeyType="send"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, {
            backgroundColor: loading ? colors.border : colors.primary,
            borderRadius: dimensions.borderRadius.small,
            padding: dimensions.spacing.small,
            marginLeft: dimensions.spacing.small,
            width: dimensions.isDesktop ? 32 : 36,
            height: dimensions.isDesktop ? 32 : 36,
            justifyContent: 'center',
            alignItems: 'center',
          }]}
          onPress={onSend}
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <SendIcon size={dimensions.isDesktop ? 14 : 16} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Container styles
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    // Text input styles
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});