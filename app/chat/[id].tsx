import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  Pressable, 
  Image, 
  Platform,
  KeyboardAvoidingView,
  Alert 
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase, Message, getMessages, sendMessage, subscribeToMessages } from '@/lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';

export default function ChatPage() {
  const { user } = useAuth();
  const { t, colors } = useLanguage();
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const loadMessages = async () => {
    if (!chatId || !user?.id) return;

    try {
      const { messages: chatMessages, error } = await getMessages(chatId, user.id);
      if (error) {
        console.error('Error loading messages:', error);
        Alert.alert('Ошибка', 'Не удалось загрузить сообщения');
        return;
      }
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить сообщения');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [chatId, user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to new messages
    const channel = subscribeToMessages(user.id, (message) => {
      setMessages(prev => [...prev, message]);
      // Scroll to bottom when new message arrives
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [user?.id]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !chatId || !user?.id || sending) return;

    const messageText = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      // Find the receiver (the other user in the chat)
      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .select('user1_id, user2_id')
        .eq('id', chatId)
        .single();

      if (chatError || !chat) {
        throw new Error('Chat not found');
      }

      const receiverId = chat.user1_id === user.id ? chat.user2_id : chat.user1_id;

      const { message, error } = await sendMessage(chatId, user.id, receiverId, messageText);
      
      if (error) {
        throw error;
      }

      if (message) {
        // Add message to local state immediately for better UX
        setMessages(prev => [...prev, message]);
        
        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Ошибка', 'Не удалось отправить сообщение');
      // Restore input text
      setInputText(messageText);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = ({ item: message }: { item: Message }) => {
    const isOwn = message.sender_id === user?.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isOwn ? styles.ownMessageContainer : styles.otherMessageContainer
      ]}>
        {!isOwn && message.sender && (
          <Image
            source={{ 
              uri: message.sender.avatar_url || 'https://i.imgur.com/mCHMpLT.png' 
            }}
            style={styles.messageAvatar}
          />
        )}
        
        <View style={[
          styles.messageBubble,
          isOwn ? styles.ownMessageBubble : styles.otherMessageBubble,
          { 
            backgroundColor: isOwn ? colors.primary : colors.card,
            borderColor: colors.border 
          }
        ]}>
          {!isOwn && message.sender && (
            <Text style={[styles.senderName, { color: colors.primary }]}>
              {message.sender.username || 'Anonymous'}
            </Text>
          )}
          
          <Text style={[
            styles.messageText,
            { color: isOwn ? '#fff' : colors.text }
          ]}>
            {message.content}
          </Text>
          
          <Text style={[
            styles.messageTime,
            { color: isOwn ? 'rgba(255,255,255,0.7)' : colors.textSecondary }
          ]}>
            {formatTime(message.created_at)}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Загрузка сообщений...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Чат
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      />

      {/* Input */}
      <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
        <TextInput
          style={[
            styles.textInput,
            { 
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border 
            }
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Напишите сообщение..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={1000}
          editable={!sending}
        />
        <Pressable
          style={[
            styles.sendButton,
            { 
              backgroundColor: inputText.trim() ? colors.primary : colors.border 
            }
          ]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || sending}
        >
          <Send 
            size={20} 
            color={inputText.trim() ? '#fff' : colors.textSecondary} 
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  ownMessageBubble: {
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
