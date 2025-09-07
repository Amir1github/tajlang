import React, { useState, useEffect } from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  Animated,
  StyleSheet 
} from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';

// Components
import { ChatHeader } from '@/components/chat_components/ChatHeader';
import { ChatList } from '@/components/chat_components/ChatList';
import { MessagesList } from '@/components/chat_components/MessagesList';
import { ChatInput } from '@/components/chat_components/ChatInput';
import { DeleteConfirmModal } from '@/components/chat_components/DeleteConfirmModal';
import { ModeChangeToast } from '@/components/chat_components/ModeChangeToast';

// Hooks
import { useChatManager } from '@/hooks/useChatManager';
import { useAnimations } from '@/hooks/useAnimations';
import { useChatAPI } from '@/hooks/useChatAPI';

// Utils
import { Message, ResponsiveDimensions } from '@/types/chat';
import { getResponsiveDimensions } from '@/utils/responsive';

export default function TajikChatPage() {
  const { t, colors } = useLanguage();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState('gemini');
  const [selectedMode, setSelectedMode] = useState('normal');
  const [showChatList, setShowChatList] = useState(false);
  const [showModeToast, setShowModeToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<ResponsiveDimensions>(getResponsiveDimensions());

  // Custom hooks
  const {
    chats,
    currentChatId,
    messages,
    setMessages,
    loadChats,
    saveCurrentChat,
    createNewChat: createChat,
    loadChat,
    deleteChat
  } = useChatManager({ selectedAI, selectedMode });

  const { fadeAnim, slideAnim, toastAnim, toggleChatListAnimation, showToastAnimation } = useAnimations(showChatList);
  
  const { askGemini, askAmeena } = useChatAPI();

  // Effects
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      saveCurrentChat();
    }
  }, [messages, currentChatId, saveCurrentChat]);

  useEffect(() => {
    if (showModeToast) {
      showToastAnimation().start(() => setShowModeToast(false));
    }
  }, [showModeToast, showToastAnimation]);

  // Handlers
  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    if (!currentChatId) {
      createChat();
    }

    const newMessages = [...messages, { role: 'user' as const, text: input }];
    setMessages(newMessages);
    const userMessage = input;
    setInput('');
    setLoading(true);

    try {
      let botReply: string;
      
      if (selectedAI === 'gemini') {
        botReply = await askGemini(userMessage);
      } else {
        botReply = await askAmeena(userMessage, selectedMode);
      }

      setMessages([...newMessages, { 
        role: 'bot', 
        text: botReply.trim(),
        aiType: selectedAI
      }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { 
        role: 'bot', 
        text: t('error') || 'Ошибка при получении ответа',
        aiType: selectedAI
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    setShowModeToast(true);
  };

  const handleToggleChatList = () => {
    setShowChatList(!showChatList);
    toggleChatListAnimation(!showChatList);
  };

  const handleCreateNewChat = () => {
    createChat();
    setShowChatList(false);
    toggleChatListAnimation(false);
  };

  const handleLoadChat = (chatId: string) => {
    loadChat(chatId);
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setSelectedAI(chat.aiType || 'gemini');
      setSelectedMode(chat.mode || 'normal');
    }
    setShowChatList(false);
    toggleChatListAnimation(false);
  };

  const handleDeletePress = (chatId: string) => {
    setChatToDelete(chatId);
    setShowDeleteModal(true);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;
    
    await deleteChat(chatToDelete);
    setShowDeleteModal(false);
    setChatToDelete(null);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.keyboardView, { 
          padding: dimensions.contentPadding, 
          backgroundColor: colors.background 
        }]}
      >
        <ChatHeader
          selectedAI={selectedAI}
          selectedMode={selectedMode}
          dimensions={dimensions}
          colors={colors}
          t={t}
          onSelectAI={setSelectedAI}
          onModeChange={handleModeChange}
          onToggleChatList={handleToggleChatList}
        />

        <View style={[styles.messagesWrapper, {
          flex: 1,
          marginBottom: dimensions.spacing.medium,
          maxWidth: dimensions.isDesktop ? 1000 : undefined,
          alignSelf: 'center',
          width: '100%',
        }]}>
          <MessagesList
            messages={messages}
            dimensions={dimensions}
            colors={colors}
          />
        </View>

        <ChatInput
          input={input}
          onInputChange={setInput}
          onSend={handleSendMessage}
          loading={loading}
          dimensions={dimensions}
          colors={colors}
          t={t}
        />
      </KeyboardAvoidingView>

      <ChatList
        chats={chats}
        currentChatId={currentChatId}
        dimensions={dimensions}
        colors={colors}
        t={t}
        slideAnim={slideAnim}
        showChatList={showChatList}
        onCreateNewChat={handleCreateNewChat}
        onLoadChat={handleLoadChat}
        onDeletePress={handleDeletePress}
        onToggleChatList={handleToggleChatList}
      />

      <DeleteConfirmModal
        visible={showDeleteModal}
        dimensions={dimensions}
        colors={colors}
        t={t}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteChat}
      />

      <ModeChangeToast
        visible={showModeToast}
        selectedMode={selectedMode}
        dimensions={dimensions}
        t={t}
        toastAnim={toastAnim}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  messagesWrapper: {},
});