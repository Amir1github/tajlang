import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  Animated,
  Modal,
  Dimensions,
  StyleSheet 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

// Components
import { AISelector } from '@/components/chat_components/AISelector';
import { ModeSelector } from '@/components/chat_components/ModeSelector';
import { MessageItem } from '@/components/chat_components/MessageItem';
import { ChatInput } from '@/components/chat_components/ChatInput';

// Types & Utils
import { Message, Chat, ResponsiveDimensions } from '@/types/chat';
import { getResponsiveDimensions } from '@/utils/responsive';
import { AI_CONFIGS, AMEENA_MODES, GOOGLE_GEMINI_API_URL, GOOGLE_API_KEY, AMEENA_API_URL } from '@/utils/constants';

export default function TajikChatPage() {
  const { t, colors, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState('gemini');
  const [selectedMode, setSelectedMode] = useState('normal');
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showChatList, setShowChatList] = useState(false);
  const [showModeToast, setShowModeToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<ResponsiveDimensions>(getResponsiveDimensions());
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-dimensions.width)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;

  // Handle orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const newDimensions = getResponsiveDimensions();
      setDimensions(newDimensions);
      
      if (showChatList) {
        slideAnim.setValue(0);
      } else {
        slideAnim.setValue(-newDimensions.width);
      }
    });

    return () => subscription?.remove();
  }, [showChatList]);

  // Load chats on component mount
  useEffect(() => {
    loadChats();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Save current chat when messages change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      saveCurrentChat();
    }
  }, [messages, currentChatId]);

  // Toast animation effect
  useEffect(() => {
    if (showModeToast) {
      Animated.sequence([
        Animated.timing(toastAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(toastAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => setShowModeToast(false));
    }
  }, [showModeToast]);

  useEffect(() => {
    try {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error scrolling to end:', error);
    }
  }, [messages]);

  const loadChats = async () => {
    try {
      const savedChats = await AsyncStorage.getItem('tajik_chats');
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats);
        
        if (parsedChats.length > 0) {
          const recentChat = parsedChats[0];
          setCurrentChatId(recentChat.id);
          setMessages(recentChat.messages || []);
          setSelectedAI(recentChat.aiType || 'gemini');
          setSelectedMode(recentChat.mode || 'normal');
        }
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const saveCurrentChat = async () => {
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
  };

  const createNewChat = () => {
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
    setShowChatList(false);

    Animated.timing(slideAnim, {
      toValue: -dimensions.width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const loadChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages || []);
      setSelectedAI(chat.aiType || 'gemini');
      setSelectedMode(chat.mode || 'normal');
      setShowChatList(false);

      Animated.timing(slideAnim, {
        toValue: -dimensions.width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleDeletePress = (chatId: string) => {
    setChatToDelete(chatId);
    setShowDeleteModal(true);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;
    
    try {
      const updatedChats = chats.filter(chat => chat.id !== chatToDelete);
      setChats(updatedChats);
      await AsyncStorage.setItem('tajik_chats', JSON.stringify(updatedChats));
      
      if (currentChatId === chatToDelete) {
        if (updatedChats.length > 0) {
          loadChat(updatedChats[0].id);
        } else {
          setCurrentChatId(null);
          setMessages([]);
        }
      }
      
      setShowDeleteModal(false);
      setChatToDelete(null);
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const askGemini = async (userMessage: string): Promise<string> => {
    const response = await fetch(GOOGLE_GEMINI_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GOOGLE_API_KEY!,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `This query is related to Tajik language, it will clarify the meaning of words, sentences, etc. in Tajik language. Answer in the language in which the question is written, most often not in Tajik\n\n${userMessage}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${errorText}`);
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];
    
    if (candidate && candidate.content?.parts) {
      return candidate.content.parts.map((part: any) => part.text).join(' ');
    }
    
    return 'Извините, не могу ответить.';
  };

  const askAmeena = async (userMessage: string): Promise<string> => {
    const response = await fetch(AMEENA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ],
        system_prompt: AMEENA_MODES[selectedMode].system_prompt
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ameena API error: ${errorText}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    }
    
    return 'Мутаассифона, ҷавоб дода наметавонам.';
  };

  const askBot = async () => {
    if (!input.trim() || loading) return;

    if (!currentChatId) {
      createNewChat();
    }

    const newMessages = [...messages, { role: 'user' as const, text: input }];
    setMessages(newMessages);
    const userMessage = input;
    setInput('');
    setLoading(true);

    const aiConfig = AI_CONFIGS[selectedAI];
    const thinkingMsg: Message = { 
      role: 'thinking', 
      text: `${aiConfig.avatar} ${aiConfig.name} думает над ответом...` 
    };
    setMessages([...newMessages, thinkingMsg]);

    try {
      let botReply: string;
      
      if (selectedAI === 'gemini') {
        botReply = await askGemini(userMessage);
      } else {
        botReply = await askAmeena(userMessage);
      }

      setMessages([...newMessages, { 
        role: 'bot', 
        text: botReply.trim(),
        aiType: selectedAI,
        avatar: aiConfig.avatar,
        aiName: aiConfig.name
      }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { 
        role: 'bot', 
        text: t('error') || 'Ошибка при получении ответа',
        aiType: selectedAI,
        avatar: aiConfig.avatar,
        aiName: aiConfig.name
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    setShowModeToast(true);
  };

  const toggleChatList = () => {
    const toValue = showChatList ? -dimensions.chatListWidth : 0;
    setShowChatList(!showChatList);
    
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
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
        {/* Header */}
        <View style={[styles.header, { 
          backgroundColor: colors.card, 
          padding: dimensions.headerPadding, 
          borderRadius: dimensions.borderRadius.medium,
          marginBottom: dimensions.spacing.medium,
          maxWidth: dimensions.isDesktop ? 1000 : undefined,
          alignSelf: 'center',
          width: '100%',
          ...styles.headerShadow,
        }]}>
          <View style={[styles.headerTop, { 
            marginBottom: dimensions.spacing.medium,
            flexDirection: dimensions.isTablet ? 'row' : 'column',
            alignItems: 'center',
          }]}>
            <View style={[styles.headerInfo, { 
              flex: dimensions.isTablet ? 1 : undefined,
              marginBottom: dimensions.isTablet ? 0 : dimensions.spacing.medium,
              alignItems: 'center',
            }]}>
              <Text style={[styles.headerTitle, { 
                fontSize: dimensions.fontSize.large, 
                color: colors.text,
                textAlign: 'center',
              }]}>
                {t('tajikLanguageChat')}
              </Text>
              <Text style={[styles.headerSubtitle, { 
                fontSize: dimensions.fontSize.small, 
                color: colors.textSecondary, 
                marginTop: 2,
                textAlign: 'center',
              }]}>
                {AI_CONFIGS[selectedAI].avatar} {AI_CONFIGS[selectedAI].name} - {AI_CONFIGS[selectedAI].description}
              </Text>
            </View>
            <View style={[styles.headerButtons, { 
              gap: dimensions.spacing.small,
              flexDirection: 'row',
              justifyContent: 'center',
            }]}>
              <TouchableOpacity
                style={[styles.headerButton, styles.primaryButton, {
                  backgroundColor: colors.primary,
                  paddingHorizontal: dimensions.spacing.medium,
                  paddingVertical: dimensions.spacing.small,
                  borderRadius: dimensions.borderRadius.small,
                  height: dimensions.buttonHeight,
                  justifyContent: 'center',
                  minWidth: 80,
                }]}
                onPress={toggleChatList}
              >
                <Text style={[styles.buttonText, { 
                  color: '#ffffff', 
                  fontSize: dimensions.fontSize.small 
                }]}>
                  {t('chats') || 'Чаты'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AI Selection */}
          <AISelector
            selectedAI={selectedAI}
            onSelectAI={setSelectedAI}
            dimensions={dimensions}
            colors={colors}
          />

          {/* Ameena Mode Selection */}
          {selectedAI === 'ameena' && (
            <ModeSelector
              selectedMode={selectedMode}
              onSelectMode={handleModeChange}
              dimensions={dimensions}
              colors={colors}
            />
          )}
        </View>

        {/* Messages */}
        <View style={[styles.messagesWrapper, {
          flex: 1,
          marginBottom: dimensions.spacing.medium,
          maxWidth: dimensions.isDesktop ? 1000 : undefined,
          alignSelf: 'center',
          width: '100%',
        }]}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
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
        </View>

        {/* Input */}
        <ChatInput
          input={input}
          onInputChange={setInput}
          onSend={askBot}
          loading={loading}
          dimensions={dimensions}
          colors={colors}
          t={t}
        />
      </KeyboardAvoidingView>

      {/* Chat List Overlay */}
      <Animated.View
        style={[styles.chatListOverlay, {
          backgroundColor: colors.background,
          width: dimensions.chatListWidth,
          transform: [{ translateX: slideAnim }],
          zIndex: showChatList ? 1000 : -1,
        }]}
      >
        <View style={[styles.chatListContainer, { 
          flex: 1, 
          padding: dimensions.contentPadding,
          paddingTop: Platform.OS === 'ios' ? 60 : 40,
        }]}>
          <View style={[styles.chatListHeader, { 
            backgroundColor: colors.card,
            padding: dimensions.spacing.medium,
            borderRadius: dimensions.borderRadius.medium,
            marginBottom: dimensions.spacing.large,
            flexDirection: dimensions.isTablet ? 'row' : 'column',
            alignItems: dimensions.isTablet ? 'center' : 'stretch',
          }]}>
            <Text style={[styles.chatListTitle, { 
              fontSize: dimensions.fontSize.large, 
              color: colors.text,
              marginBottom: dimensions.isTablet ? 0 : dimensions.spacing.medium,
              flex: dimensions.isTablet ? 1 : undefined,
            }]}>
              {t('listChats') || 'Список чатов'}
            </Text>
            <View style={[styles.chatListButtons, { 
              flexDirection: 'row', 
              gap: dimensions.spacing.small 
            }]}>
              <TouchableOpacity
                style={[styles.chatListButton, styles.primaryButton, {
                  backgroundColor: colors.primary,
                  paddingHorizontal: dimensions.spacing.medium,
                  paddingVertical: dimensions.spacing.small,
                  borderRadius: dimensions.borderRadius.small,
                  height: dimensions.buttonHeight,
                  justifyContent: 'center',
                }]}
                onPress={createNewChat}
              >
                <Text style={[styles.buttonText, { 
                  color: '#ffffff', 
                  fontSize: dimensions.fontSize.small 
                }]}>
                  + {t('newChat')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chatListButton, styles.secondaryButton, {
                  backgroundColor: colors.border,
                  paddingHorizontal: dimensions.spacing.medium,
                  paddingVertical: dimensions.spacing.small,
                  borderRadius: dimensions.borderRadius.small,
                  height: dimensions.buttonHeight,
                  justifyContent: 'center',
                }]}
                onPress={toggleChatList}
              >
                <Text style={[styles.buttonText, { 
                  color: colors.text, 
                  fontSize: dimensions.fontSize.small 
                }]}>
                  {t('back')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView style={styles.chatList}>
            {chats.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                style={[styles.chatItem, {
                  backgroundColor: colors.card,
                  padding: dimensions.spacing.medium,
                  marginBottom: dimensions.spacing.medium,
                  borderRadius: dimensions.borderRadius.medium,
                  borderWidth: currentChatId === chat.id ? 2 : 1,
                  borderColor: currentChatId === chat.id ? colors.primary : colors.border,
                  ...styles.chatItemShadow,
                }]}
                onPress={() => loadChat(chat.id)}
              >
                <View style={[styles.chatItemContent, { 
                  flexDirection: dimensions.isTablet ? 'row' : 'column',
                  alignItems: dimensions.isTablet ? 'center' : 'stretch',
                }]}>
                  <View style={[styles.chatItemInfo, { 
                    flex: 1,
                    marginBottom: dimensions.isTablet ? 0 : dimensions.spacing.small,
                  }]}>
                    <Text style={[styles.chatItemTitle, { 
                      fontSize: dimensions.fontSize.medium, 
                      color: colors.text 
                    }]}>
                      {chat.title}
                    </Text>
                    <Text style={[styles.chatItemSubtitle, { 
                      fontSize: dimensions.fontSize.tiny, 
                      color: colors.textSecondary, 
                      marginTop: 4 
                    }]}>
                      {AI_CONFIGS[chat.aiType || 'gemini'].avatar} {AI_CONFIGS[chat.aiType || 'gemini'].name}
                      {chat.aiType === 'ameena' ? ` (${AMEENA_MODES[chat.mode]?.title})` : ''}
                    </Text>
                    {chat.lastMessage && (
                      <Text style={[styles.chatItemMessage, { 
                        fontSize: dimensions.fontSize.small, 
                        color: colors.textSecondary, 
                        marginTop: 4 
                      }]} numberOfLines={2}>
                        {chat.lastMessage}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeletePress(chat.id)}
                    style={[styles.deleteButton, { 
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
                    <Text style={[styles.deleteButtonText, { 
                      fontSize: dimensions.fontSize.medium 
                    }]}>
                      🗑️
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
            {chats.length === 0 && (
              <View style={[styles.emptyChatList, {
                backgroundColor: colors.card,
                padding: dimensions.spacing.large,
                borderRadius: dimensions.borderRadius.medium,
                alignItems: 'center',
              }]}>
                <Text style={[styles.emptyChatText, { 
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

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {
            backgroundColor: colors.card,
            borderRadius: dimensions.borderRadius.large,
            padding: dimensions.spacing.large,
            margin: dimensions.spacing.large,
            maxWidth: dimensions.isTablet ? 400 : dimensions.width - (dimensions.spacing.large * 2),
            width: '100%',
            ...styles.modalShadow,
          }]}>
            <Text style={[styles.modalTitle, { 
              fontSize: dimensions.fontSize.large, 
              color: colors.text,
              textAlign: 'center',
              marginBottom: dimensions.spacing.medium,
            }]}>
              {t('deleteChat')}
            </Text>
            <Text style={[styles.modalText, { 
              fontSize: dimensions.fontSize.medium, 
              color: colors.textSecondary,
              textAlign: 'center',
              marginBottom: dimensions.spacing.large,
              lineHeight: dimensions.fontSize.medium * 1.4,
            }]}>
              Вы уверены, что хотите удалить этот чат? Это действие нельзя отменить.
            </Text>
            <View style={[styles.modalButtons, { 
              flexDirection: dimensions.isTablet ? 'row' : 'column',
              gap: dimensions.spacing.medium,
            }]}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, {
                  flex: dimensions.isTablet ? 1 : undefined,
                  backgroundColor: colors.border,
                  paddingVertical: dimensions.spacing.medium,
                  borderRadius: dimensions.borderRadius.small,
                  minHeight: 44,
                  justifyContent: 'center',
                }]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={[styles.modalButtonText, { 
                  color: colors.text, 
                  fontSize: dimensions.fontSize.medium,
                  textAlign: 'center',
                }]}>
                  {t('cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton, {
                  flex: dimensions.isTablet ? 1 : undefined,
                  backgroundColor: '#DC3545',
                  paddingVertical: dimensions.spacing.medium,
                  borderRadius: dimensions.borderRadius.small,
                  minHeight: 44,
                  justifyContent: 'center',
                }]}
                onPress={confirmDeleteChat}
              >
                <Text style={[styles.modalButtonText, { 
                  color: '#ffffff', 
                  fontSize: dimensions.fontSize.medium,
                  textAlign: 'center',
                }]}>
                  {t('delete')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Mode Change Toast */}
      {showModeToast && (
        <Animated.View
          style={[styles.toast, {
            bottom: dimensions.isTablet ? 120 : 100,
            right: dimensions.spacing.large,
            backgroundColor: AI_CONFIGS.ameena.color,
            paddingHorizontal: dimensions.spacing.medium,
            paddingVertical: dimensions.spacing.medium,
            borderRadius: dimensions.borderRadius.medium,
            maxWidth: dimensions.width * 0.8,
            ...styles.toastShadow,
            transform: [
              {
                scale: toastAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
            opacity: toastAnim,
          }]}
        >
          <View style={styles.toastContent}>
            <Text style={[styles.toastIcon, { fontSize: dimensions.fontSize.medium, marginRight: 8 }]}>✅</Text>
            <View style={styles.toastText}>
              <Text style={[styles.toastTitle, { 
                color: '#ffffff', 
                fontSize: dimensions.fontSize.small,
              }]}>
                {t('modeChanged')}
              </Text>
              <Text style={[styles.toastDescription, { 
                color: '#ffffff', 
                fontSize: dimensions.fontSize.tiny, 
                opacity: 0.9 
              }]}>
                {AMEENA_MODES[selectedMode]?.title}: {AMEENA_MODES[selectedMode]?.description}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
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
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    alignItems: 'center',
  },
  headerInfo: {
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  headerSubtitle: {
    textAlign: 'center',
  },
  headerButtons: {
    alignItems: 'center',
  },
  headerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  primaryButton: {},
  secondaryButton: {},
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messagesWrapper: {},
  messagesContainer: {
    flex: 1,
  },
  chatListOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chatListContainer: {},
  chatListHeader: {
    alignItems: 'center',
  },
  chatListTitle: {
    fontWeight: 'bold',
  },
  chatListButtons: {
    alignItems: 'center',
  },
  chatListButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {},
  chatItemShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chatItemContent: {},
  chatItemInfo: {},
  chatItemTitle: {
    fontWeight: 'bold',
  },
  chatItemSubtitle: {},
  chatItemMessage: {},
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {},
  emptyChatList: {},
  emptyChatText: {},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    alignItems: 'center',
  },
  modalShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  modalText: {},
  modalButtons: {
    width: '100%',
  },
  modalButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {},
  deleteConfirmButton: {},
  modalButtonText: {
    fontWeight: 'bold',
  },
  toast: {
    position: 'absolute',
  },
  toastShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastIcon: {},
  toastText: {
    flex: 1,
  },
  toastTitle: {
    fontWeight: 'bold',
  },
  toastDescription: {},
});