import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  ScrollView, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  Alert,
  Animated,
  Modal,
  Dimensions,
  StyleSheet 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

const GOOGLE_GEMINI_API_URL = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_URL;
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
const AMEENA_API_URL = 'https://ameena.saidzoda.com/api/generate';

// AI Configuration
const AI_CONFIGS = {
  gemini: {
    name: 'Gemini',
    version: '1.5 Pro',
    description: 'Google\'s advanced AI model',
    avatar: '🤖',
    color: '#4285F4'
  },
  ameena: {
    name: 'Амина',
    version: 'v3.0',
    description: 'Ёвари ҳушманди пешрафта',
    avatar: '🧠',
    color: '#9C27B0'
  }
};

// Ameena modes configuration
const AMEENA_MODES = {
  normal: {
    title: 'Асоси',
    description: 'Умный помощник для общих вопросов',
    system_prompt: "Шумо Амина, ёвари ҳушманди тоҷикӣ ҳастед. Шумо бояд ба саволҳои корбар дар ҳамон забоне, ки корбар савол пурсидааст, посух диҳед. Агар савол дар бораи калимаҳо, ҷумлаҳо ва ё мафҳумҳои тоҷикӣ бошад, онҳоро бо забони фаҳмонидани корбар шарҳ диҳед."
  },
  omuzish: {
    title: 'Омузиш',
    description: 'Режим обучения и объяснений',
    system_prompt: "Шумо муаллими сабур ва донишманд ҳастед. Шумо метавонед мафҳумҳои мураккаби илмӣ, математикӣ ва техникиро ба забони содда ва фаҳмо шарҳ диҳед. Шумо бояд ба саволҳои корбар дар ҳамон забоне, ки корбар савол пурсидааст, посух диҳед ва мафҳумҳоро бо забони фаҳмонидани корбар тавзеҳ диҳед."
  },
  hulosa: {
    title: 'Хулоса',
    description: 'Резюмирование текстов',
    system_prompt: "Шумо мутахассиси хулосабарории матнҳо ҳастед. Вазифаи шумо хондани матни дароз ва ба таври мухтасар, вале дақиқ баён кардани фикрҳои асосии он аст. Шумо бояд хулосаро дар ҳамон забоне, ки корбар дархост кардааст, пешниҳод кунед ва агар лозим бошад, калимаҳо ва мафҳумҳоро бо забони фаҳмонидани корбар тавзеҳ диҳед."
  },
  tarjuma: {
    title: 'Тарчума',
    description: 'Перевод между языками',
    system_prompt: "Шумо тарҷумони адабии коршинос ҳастед. Шумо метавонед байни забонҳои тоҷикӣ, англисӣ, русӣ ва дигар забонҳо тарҷума кунед. Мақсади шумо на танҳо тарҷума, балки расонидани мазмун, эҳсосот ва зебоии матни аслӣ мебошад. Шумо бояд ба саволҳои корбар дар ҳамон забоне, ки корбар савол пурсидааст, посух диҳед ва тарҷумаи дархостшударо пешниҳод кунед."
  },
  navishtan: {
    title: 'Навиштан',
    description: 'Помощь в написании документов',
    system_prompt: "Шумо ҳамчун ёвари касбии нависандагӣ амал мекунед. Шумо дар навиштани мактубҳои расмӣ, ариза, дархост ва дигар ҳуҷҷатҳо кӯмак мерасонед. Шумо бояд ба саволҳои корбар дар ҳамон забоне, ки корбар савол пурсидааст, посух диҳед ва агар лозим бошад, калимаҳо ва мафҳумҳоро бо забони фаҳмонидани корбар тавзеҳ диҳед."
  }
};

// Responsive utilities
const getResponsiveDimensions = () => {
  const { width, height } = Dimensions.get('window');
  const isTablet = width >= 768;
  const isLandscape = width > height;
  
  return {
    width,
    height,
    isTablet,
    isLandscape,
    // Responsive values
    headerPadding: isTablet ? 24 : 16,
    contentPadding: isTablet ? 20 : 16,
    fontSize: {
      large: isTablet ? 28 : 24,
      medium: isTablet ? 18 : 16,
      small: isTablet ? 16 : 14,
      tiny: isTablet ? 14 : 12,
    },
    spacing: {
      large: isTablet ? 24 : 16,
      medium: isTablet ? 16 : 12,
      small: isTablet ? 12 : 8,
    },
    borderRadius: {
      large: isTablet ? 20 : 16,
      medium: isTablet ? 16 : 12,
      small: isTablet ? 12 : 8,
    },
    messageMaxWidth: isTablet ? '70%' : '80%',
    chatListWidth: isTablet && isLandscape ? width * 0.4 : width,
  };
};

export default function TajikChatPage() {
  const { t, colors, language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState('gemini');
  const [selectedMode, setSelectedMode] = useState('normal');
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showChatList, setShowChatList] = useState(false);
  const [showModeToast, setShowModeToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [thinkingMessage, setThinkingMessage] = useState('');
  const [dimensions, setDimensions] = useState(getResponsiveDimensions());
  const scrollViewRef = useRef(null);
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
      
      // Update slide animation value for new width
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
    // Fade in animation
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

  const loadChats = async () => {
    try {
      const savedChats = await AsyncStorage.getItem('tajik_chats');
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats);
        
        // Load the most recent chat
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
    const newChat = {
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

    // Animate slide out
    Animated.timing(slideAnim, {
      toValue: -dimensions.width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const loadChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages || []);
      setSelectedAI(chat.aiType || 'gemini');
      setSelectedMode(chat.mode || 'normal');
      setShowChatList(false);

      // Animate slide out
      Animated.timing(slideAnim, {
        toValue: -dimensions.width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleDeletePress = (chatId) => {
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

  const askGemini = async (userMessage) => {
    const response = await fetch(GOOGLE_GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GOOGLE_API_KEY,
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
      return candidate.content.parts.map(part => part.text).join(' ');
    }
    
    return 'Извините, не могу ответить.';
  };

  const askAmeena = async (userMessage) => {
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

    // Create new chat if none exists
    if (!currentChatId) {
      createNewChat();
    }

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    const userMessage = input;
    setInput('');
    setLoading(true);

    // Set thinking message
    const aiConfig = AI_CONFIGS[selectedAI];
    setThinkingMessage(`${aiConfig.avatar} ${aiConfig.name} думает над ответом...`);
    
    // Add thinking message temporarily
    const thinkingMsg = { role: 'thinking', text: `${aiConfig.avatar} ${aiConfig.name} думает над ответом...` };
    setMessages([...newMessages, thinkingMsg]);

    try {
      let botReply;
      
      if (selectedAI === 'gemini') {
        botReply = await askGemini(userMessage);
      } else {
        botReply = await askAmeena(userMessage);
      }

      // Remove thinking message and add real response
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
      setThinkingMessage('');
    }
  };

  const handleModeChange = (mode) => {
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

  useEffect(() => {
    try {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error scrolling to end:', error);
    }
  }, [messages]);

  const renderMessage = (msg, idx) => {
    if (msg.role === 'thinking') {
      return (
        <View key={idx} style={[styles.messageContainer, {
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
            {msg.text}
          </Text>
        </View>
      );
    }

    return (
      <View key={idx} style={[styles.messageContainer, {
        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: msg.role === 'user' ? colors.primary : colors.card,
        borderRadius: dimensions.borderRadius.medium,
        padding: dimensions.spacing.medium,
        marginBottom: dimensions.spacing.small,
        maxWidth: typeof dimensions.messageMaxWidth === 'string'
          ? dimensions.width * (parseInt(dimensions.messageMaxWidth) / 100 || 0.8)
          : dimensions.messageMaxWidth,
        borderWidth: msg.role === 'bot' ? 1 : 0,
        borderColor: colors.border,
        ...styles.messageShadow,
      }]}>
        {msg.role === 'bot' && (
          <View style={[styles.botHeader, { marginBottom: dimensions.spacing.small / 2 }]}>
            <Text style={{ fontSize: dimensions.fontSize.medium, marginRight: 4 }}>{msg.avatar}</Text>
            <Text style={[styles.botName, { 
              fontSize: dimensions.fontSize.tiny, 
              color: colors.textSecondary 
            }]}>
              {msg.aiName}
            </Text>
          </View>
        )}
        <Text style={[styles.messageText, { 
          fontSize: dimensions.fontSize.medium, 
          color: msg.role === 'user' ? '#ffffff' : colors.text,
          lineHeight: dimensions.fontSize.medium * 1.4,
        }]}>
          {msg.text}
        </Text>
      </View>
    );
  };

  const renderAISelector = () => (
    <View style={[styles.aiSelectorContainer, {
      backgroundColor: colors.background,
      borderRadius: dimensions.borderRadius.medium,
      padding: dimensions.spacing.small / 2,
      marginBottom: dimensions.spacing.medium,
    }]}>
      {Object.entries(AI_CONFIGS).map(([key, config]) => (
        <TouchableOpacity
          key={key}
          style={[styles.aiSelectorButton, {
            flex: 1,
            backgroundColor: selectedAI === key ? config.color : 'transparent',
            padding: dimensions.spacing.medium,
            borderRadius: dimensions.borderRadius.small,
            marginHorizontal: 2,
          }]}
          onPress={() => setSelectedAI(key)}
        >
          <View style={styles.aiSelectorContent}>
            <Text style={{ fontSize: dimensions.fontSize.large, marginBottom: 4 }}>{config.avatar}</Text>
            <Text style={[styles.aiSelectorText, { 
              color: selectedAI === key ? '#ffffff' : colors.text,
              fontWeight: selectedAI === key ? 'bold' : 'normal',
              fontSize: dimensions.fontSize.small,
            }]}>
              {config.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderModeSelector = () => {
    if (selectedAI !== 'ameena') return null;

    const modesPerRow = dimensions.isTablet ? 3 : 2;
    const modeEntries = Object.entries(AMEENA_MODES);
    const rows = [];
    
    for (let i = 0; i < modeEntries.length; i += modesPerRow) {
      rows.push(modeEntries.slice(i, i + modesPerRow));
    }

    return (
      <View style={[styles.modeSelectorContainer, {
        backgroundColor: colors.background,
        borderRadius: dimensions.borderRadius.medium,
        padding: dimensions.spacing.small,
      }]}>
        <Text style={[styles.modeSelectorTitle, { 
          fontSize: dimensions.fontSize.small, 
          color: colors.text, 
          marginBottom: dimensions.spacing.small,
        }]}>
          Выберите режим работы
        </Text>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={[styles.modeRow, { 
            marginBottom: rowIndex < rows.length - 1 ? dimensions.spacing.small : 0 
          }]}>
            {row.map(([key, mode]) => (
              <TouchableOpacity
                key={key}
                style={[styles.modeButton, {
                  flex: 1,
                  backgroundColor: selectedMode === key ? AI_CONFIGS.ameena.color : colors.card,
                  paddingHorizontal: dimensions.spacing.medium,
                  paddingVertical: dimensions.spacing.small,
                  borderRadius: dimensions.borderRadius.small,
                  borderWidth: 1,
                  borderColor: selectedMode === key ? AI_CONFIGS.ameena.color : colors.border,
                  marginHorizontal: dimensions.spacing.small / 2,
                }]}
                onPress={() => handleModeChange(key)}
              >
                <Text style={[styles.modeButtonText, { 
                  color: selectedMode === key ? '#ffffff' : colors.text,
                  fontSize: dimensions.fontSize.tiny,
                  fontWeight: selectedMode === key ? 'bold' : 'normal'
                }]}>
                  {mode.title}
                </Text>
              </TouchableOpacity>
            ))}
            {row.length < modesPerRow && (
              <View style={{ flex: modesPerRow - row.length }} />
            )}
          </View>
        ))}
      </View>
    );
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
          borderRadius: dimensions.borderRadius.large,
          marginBottom: dimensions.spacing.medium,
          ...styles.headerShadow,
        }]}>
          <View style={[styles.headerTop, { 
            marginBottom: dimensions.spacing.medium,
            flexDirection: dimensions.isTablet ? 'row' : 'column',
          }]}>
            <View style={[styles.headerInfo, { 
              flex: dimensions.isTablet ? 1 : undefined,
              marginBottom: dimensions.isTablet ? 0 : dimensions.spacing.medium,
            }]}>
              <Text style={[styles.headerTitle, { 
                fontSize: dimensions.fontSize.large, 
                color: colors.text 
              }]}>
                Tajik Language Chat
              </Text>
              <Text style={[styles.headerSubtitle, { 
                fontSize: dimensions.fontSize.small, 
                color: colors.textSecondary, 
                marginTop: 4 
              }]}>
                {AI_CONFIGS[selectedAI].avatar} {AI_CONFIGS[selectedAI].name} {AI_CONFIGS[selectedAI].version} - {AI_CONFIGS[selectedAI].description}
              </Text>
            </View>
            <View style={[styles.headerButtons, { 
              gap: dimensions.spacing.small,
              flexDirection: 'row',
              justifyContent: dimensions.isTablet ? 'flex-end' : 'center',
            }]}>
              <TouchableOpacity
                style={[styles.headerButton, styles.primaryButton, {
                  backgroundColor: colors.primary,
                  paddingHorizontal: dimensions.spacing.medium,
                  paddingVertical: dimensions.spacing.small,
                  borderRadius: dimensions.borderRadius.small,
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
              <TouchableOpacity
                style={[styles.headerButton, styles.secondaryButton, {
                  backgroundColor: colors.border,
                  paddingHorizontal: dimensions.spacing.medium,
                  paddingVertical: dimensions.spacing.small,
                  borderRadius: dimensions.borderRadius.small,
                }]}
                onPress={() => router.push('/')}
              >
                <Text style={[styles.buttonText, { 
                  color: colors.text, 
                  fontSize: dimensions.fontSize.small 
                }]}>
                  {t('home') || 'Домой'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AI Selection */}
          {renderAISelector()}

          {/* Ameena Mode Selection */}
          {renderModeSelector()}
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={[styles.messagesContainer, { flex: 1, marginBottom: dimensions.spacing.medium }]}
          contentContainerStyle={{ paddingBottom: dimensions.spacing.medium }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputContainer, { 
          backgroundColor: colors.card,
          borderRadius: dimensions.borderRadius.large,
          paddingHorizontal: dimensions.spacing.medium,
          paddingVertical: dimensions.spacing.small,
          ...styles.inputShadow,
        }]}>
          <TextInput
            style={[styles.textInput, {
              flex: 1,
              fontSize: dimensions.fontSize.medium,
              color: colors.text,
              maxHeight: dimensions.isTablet ? 150 : 100,
              paddingVertical: dimensions.spacing.small,
            }]}
            placeholder={t('placeholder') || 'Введите сообщение...'}
            placeholderTextColor={colors.textTertiary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={askBot}
            editable={!loading}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, {
              backgroundColor: loading ? colors.border : colors.primary,
              borderRadius: dimensions.borderRadius.medium,
              padding: dimensions.spacing.medium,
              marginLeft: dimensions.spacing.small,
            }]}
            onPress={askBot}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={[styles.sendButtonText, { 
                color: '#ffffff', 
                fontSize: dimensions.fontSize.medium 
              }]}>
                ✈️
              </Text>
            )}
          </TouchableOpacity>
        </View>
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
                }]}
                onPress={createNewChat}
              >
                <Text style={[styles.buttonText, { 
                  color: '#ffffff', 
                  fontSize: dimensions.fontSize.small 
                }]}>
                  + Новый
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chatListButton, styles.secondaryButton, {
                  backgroundColor: colors.border,
                  paddingHorizontal: dimensions.spacing.medium,
                  paddingVertical: dimensions.spacing.small,
                  borderRadius: dimensions.borderRadius.small,
                }]}
                onPress={toggleChatList}
              >
                <Text style={[styles.buttonText, { 
                  color: colors.text, 
                  fontSize: dimensions.fontSize.small 
                }]}>
                  Назад
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
                  Нет сохраненных чатов.{'\n'}Создайте новый чат для начала.
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
              Удалить чат
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
                  Отмена
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
                  Удалить
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
                Режим изменен
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

// Responsive StyleSheet
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
    minHeight: 36,
    minWidth: 60,
  },
  primaryButton: {
    // Primary button styles
  },
  secondaryButton: {
    // Secondary button styles  
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  aiSelectorContainer: {
    flexDirection: 'row',
  },
  aiSelectorButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSelectorContent: {
    alignItems: 'center',
  },
  aiSelectorText: {
    textAlign: 'center',
  },
  modeSelectorContainer: {
    // Mode selector container styles
  },
  modeSelectorTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modeRow: {
    flexDirection: 'row',
  },
  modeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  modeButtonText: {
    textAlign: 'center',
  },
  messagesContainer: {
    // Messages container styles
  },
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
    minWidth: 44,
    minHeight: 44,
  },
  sendButtonText: {
    fontWeight: 'bold',
  },
  chatListOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chatListContainer: {
    // Chat list container styles
  },
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
    minHeight: 36,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    // Chat item styles
  },
  chatItemShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chatItemContent: {
    // Chat item content styles
  },
  chatItemInfo: {
    // Chat item info styles
  },
  chatItemTitle: {
    fontWeight: 'bold',
  },
  chatItemSubtitle: {
    // Chat item subtitle styles
  },
  chatItemMessage: {
    // Chat item message styles
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    minHeight: 36,
  },
  deleteButtonText: {
    // Delete button text styles
  },
  emptyChatList: {
    // Empty chat list styles
  },
  emptyChatText: {
    // Empty chat text styles
  },
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
  modalText: {
    // Modal text styles
  },
  modalButtons: {
    width: '100%',
  },
  modalButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    // Cancel button styles
  },
  deleteConfirmButton: {
    // Delete confirm button styles
  },
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
  toastIcon: {
    // Toast icon styles
  },
  toastText: {
    flex: 1,
  },
  toastTitle: {
    fontWeight: 'bold',
  },
  toastDescription: {
    // Toast description styles
  },
});