import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chat, Message } from '@/types/chat';

interface UseChatManagerProps {
  selectedAI: string;
  selectedMode: string;
}

export const useChatManager = ({ selectedAI, selectedMode }: UseChatManagerProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const loadChats = useCallback(async () => {
    try {
      const savedChats = await AsyncStorage.getItem('tajik_chats');
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats);
        
        if (parsedChats.length > 0) {
          const recentChat = parsedChats[0];
          setCurrentChatId(recentChat.id);
          setMessages(recentChat.messages || []);
        }
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  }, []);

  const saveCurrentChat = useCallback(async () => {
    if (!currentChatId) return;
    
    try {
      const updatedChats = chats.map(chat => 
        chat.id === currentChatId 
          ? { 
              ...chat, 
              messages, 
              aiType: selectedAI,
              mode: selectedMode,
              lastMessage: messages[messages.length - 1]?.text || '',
              updatedAt: new Date().toISOString()
            }
          : chat
      );
      
      setChats(updatedChats);
      await AsyncStorage.setItem('tajik_chats', JSON.stringify(updatedChats));
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  }, [currentChatId, chats, messages, selectedAI, selectedMode]);

  const createNewChat = useCallback(() => {
    const newChatId = Date.now().toString();
    const newChat: Chat = {
      id: newChatId,
      title: `Chat ${chats.length + 1}`,
      messages: [],
      aiType: selectedAI,
      mode: selectedMode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: ''
    };
    
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setCurrentChatId(newChatId);
    setMessages([]);
  }, [chats, selectedAI, selectedMode]);

  const loadChat = useCallback((chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages || []);
    }
  }, [chats]);

  const deleteChat = useCallback(async (chatId: string) => {
    try {
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      setChats(updatedChats);
      await AsyncStorage.setItem('tajik_chats', JSON.stringify(updatedChats));
      
      if (currentChatId === chatId) {
        if (updatedChats.length > 0) {
          loadChat(updatedChats[0].id);
        } else {
          setCurrentChatId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  }, [chats, currentChatId, loadChat]);

  return {
    chats,
    currentChatId,
    messages,
    setMessages,
    loadChats,
    saveCurrentChat,
    createNewChat,
    loadChat,
    deleteChat
  };
};
