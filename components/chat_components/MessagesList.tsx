import React, { useRef, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { MessageItem } from './MessageItem';
import { Message, ResponsiveDimensions } from '@/types/chat';

interface MessagesListProps {
  messages: Message[];
  dimensions: ResponsiveDimensions;
  colors: any;
}

export const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  dimensions,
  colors
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    try {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error scrolling to end:', error);
    }
  }, [messages]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: dimensions.spacing.medium }}
      showsVerticalScrollIndicator={false}
    >
      {messages.map((message, index) => (
        <MessageItem
          key={index}
          message={message}
          dimensions={dimensions}
          colors={colors}
        />
      ))}
    </ScrollView>
  );
};