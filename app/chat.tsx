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
  Dimensions 
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

const { width } = Dimensions.get('window');

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
  const scrollViewRef = useRef(null);
  const router = useRouter();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;

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
      toValue: -width,
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
        toValue: -width,
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
    const toValue = showChatList ? -width : 0;
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
        <View key={idx} style={{
          alignSelf: 'flex-start',
          backgroundColor: colors.card,
          borderRadius: 15,
          padding: 12,
          marginBottom: 8,
          maxWidth: '80%',
          borderWidth: 1,
          borderColor: colors.border,
          opacity: 0.7,
        }}>
          <Text style={{ fontSize: 16, color: colors.text, fontStyle: 'italic' }}>
            {msg.text}
          </Text>
        </View>
      );
    }

    return (
      <View key={idx} style={{
        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: msg.role === 'user' ? colors.primary : colors.card,
        borderRadius: 15,
        padding: 12,
        marginBottom: 8,
        maxWidth: '80%',
        borderWidth: msg.role === 'bot' ? 1 : 0,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}>
        {msg.role === 'bot' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 16, marginRight: 4 }}>{msg.avatar}</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 'bold' }}>
              {msg.aiName}
            </Text>
          </View>
        )}
        <Text style={{ 
          fontSize: 16, 
          color: msg.role === 'user' ? '#ffffff' : colors.text,
          lineHeight: 22,
        }}>
          {msg.text}
        </Text>
      </View>
    );
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, padding: 16, backgroundColor: colors.background }}
      >
        {/* Header */}
        <View style={{ 
          backgroundColor: colors.card, 
          padding: 20, 
          borderRadius: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 16
          }}>
            <View>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>
                Tajik Language Chat
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
                {AI_CONFIGS[selectedAI].avatar} {AI_CONFIGS[selectedAI].name} {AI_CONFIGS[selectedAI].version} - {AI_CONFIGS[selectedAI].description}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
                onPress={toggleChatList}
              >
                <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{t('chats') || 'Чаты'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.border,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
                onPress={() => router.push('/')}
              >
                <Text style={{ color: colors.text }}>{t('home') || 'Домой'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AI Selection */}
          <View style={{ 
            flexDirection: 'row', 
            marginBottom: 16,
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 4,
          }}>
            {Object.entries(AI_CONFIGS).map(([key, config]) => (
              <TouchableOpacity
                key={key}
                style={{
                  flex: 1,
                  backgroundColor: selectedAI === key ? config.color : 'transparent',
                  padding: 12,
                  borderRadius: 8,
                  marginHorizontal: 2,
                }}
                onPress={() => setSelectedAI(key)}
              >
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, marginBottom: 4 }}>{config.avatar}</Text>
                  <Text style={{ 
                    color: selectedAI === key ? '#ffffff' : colors.text,
                    fontWeight: selectedAI === key ? 'bold' : 'normal',
                    fontSize: 14,
                  }}>
                    {config.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Ameena Mode Selection */}
          {selectedAI === 'ameena' && (
            <View style={{ 
              backgroundColor: colors.background,
              borderRadius: 12,
              padding: 8,
            }}>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: 'bold', 
                color: colors.text, 
                marginBottom: 8,
                textAlign: 'center' 
              }}>
                Выберите режим работы
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                {Object.entries(AMEENA_MODES).map(([key, mode]) => (
                  <TouchableOpacity
                    key={key}
                    style={{
                      backgroundColor: selectedMode === key ? AI_CONFIGS.ameena.color : colors.card,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: selectedMode === key ? AI_CONFIGS.ameena.color : colors.border,
                      minWidth: 80,
                    }}
                    onPress={() => handleModeChange(key)}
                  >
                    <Text style={{ 
                      color: selectedMode === key ? '#ffffff' : colors.text,
                      fontSize: 12,
                      textAlign: 'center',
                      fontWeight: selectedMode === key ? 'bold' : 'normal'
                    }}>
                      {mode.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1, marginBottom: 16 }}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Input */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'flex-end',
          backgroundColor: colors.card,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: colors.text,
              maxHeight: 100,
              paddingVertical: 8,
            }}
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
            style={{
              backgroundColor: loading ? colors.border : colors.primary,
              borderRadius: 12,
              padding: 12,
              marginLeft: 8,
            }}
            onPress={askBot}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>✈️</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Chat List Overlay */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.background,
          transform: [{ translateX: slideAnim }],
          zIndex: showChatList ? 1000 : -1,
        }}
      >
        <View style={{ flex: 1, padding: 16, paddingTop: 60 }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 20,
            backgroundColor: colors.card,
            padding: 16,
            borderRadius: 12
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
              {t('listChats') || 'Список чатов'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
                onPress={createNewChat}
              >
                <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>+ Новый</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.border,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
                onPress={toggleChatList}
              >
                <Text style={{ color: colors.text }}>Назад</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView>
            {chats.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                style={{
                  backgroundColor: colors.card,
                  padding: 16,
                  marginBottom: 12,
                  borderRadius: 12,
                  borderWidth: currentChatId === chat.id ? 2 : 1,
                  borderColor: currentChatId === chat.id ? colors.primary : colors.border,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
                onPress={() => loadChat(chat.id)}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }}>
                      {chat.title}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
                      {AI_CONFIGS[chat.aiType || 'gemini'].avatar} {AI_CONFIGS[chat.aiType || 'gemini'].name}
                      {chat.aiType === 'ameena' ? ` (${AMEENA_MODES[chat.mode]?.title})` : ''}
                    </Text>
                    {chat.lastMessage && (
                      <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }} numberOfLines={2}>
                        {chat.lastMessage}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeletePress(chat.id)}
                    style={{ 
                      padding: 8,
                      backgroundColor: 'rgba(255, 0, 0, 0.1)',
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: 'red', fontSize: 16 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
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
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 24,
            margin: 20,
            width: width - 40,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              color: colors.text,
              textAlign: 'center',
              marginBottom: 16 
            }}>
              Удалить чат
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: colors.textSecondary,
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 22
            }}>
              Вы уверены, что хотите удалить этот чат? Это действие нельзя отменить.
            </Text>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              gap: 16 
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.border,
                  paddingVertical: 12,
                  borderRadius: 8,
                }}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={{ 
                  color: colors.text, 
                  fontWeight: 'bold',
                  textAlign: 'center' 
                }}>
                  Отмена
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#DC3545',
                  paddingVertical: 12,
                  borderRadius: 8,
                }}
                onPress={confirmDeleteChat}
              >
                <Text style={{ 
                  color: '#ffffff', 
                  fontWeight: 'bold',
                  textAlign: 'center' 
                }}>
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
          style={{
            position: 'absolute',
            bottom: 100,
            right: 20,
            backgroundColor: AI_CONFIGS.ameena.color,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
            transform: [
              {
                scale: toastAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
            opacity: toastAnim,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>✅</Text>
            <View>
              <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 14 }}>
                Режим изменен
              </Text>
              <Text style={{ color: '#ffffff', fontSize: 12, opacity: 0.9 }}>
                {AMEENA_MODES[selectedMode]?.title}: {AMEENA_MODES[selectedMode]?.description}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}