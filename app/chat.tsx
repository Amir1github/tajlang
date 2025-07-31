import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

const GOOGLE_GEMINI_API_URL = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_URL ;
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export default function TajikChatPage() {
  const { t, colors } = useLanguage();
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  const askBot = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
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
                  text: `Этот запрос относится к таджикскому языку. Пожалуйста, ответь в формате Markdown.\n\n${input}`,
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
      let botReply = 'Извините, не могу ответить.';

      if (candidate && candidate.content?.parts) {
        botReply = candidate.content.parts.map((part: { text: string }) => part.text).join(' ');
      }

      setMessages([...newMessages, { role: 'bot', text: botReply.trim() }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'bot', text: 'Произошла ошибка. Попробуйте снова.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error scrolling to end:', error);
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, padding: 16, backgroundColor: colors.background }}
    >
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 16, 
        backgroundColor: colors.card, 
        padding: 16, 
        borderRadius: 12 
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>
          Tajik Language Chat
        </Text>
        <Button title="Домой" onPress={() => router.push('/')} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, marginBottom: 16 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, idx) => (
          <View
            key={idx}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? colors.primary : colors.card,
              borderRadius: 15,
              padding: 12,
              marginBottom: 8,
              maxWidth: '80%',
              borderWidth: msg.role === 'bot' ? 1 : 0,
              borderColor: colors.border,
            }}
          >
            <Text style={{ 
              fontSize: 16, 
              color: msg.role === 'user' ? '#ffffff' : colors.text 
            }}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 14,
            fontSize: 16,
            backgroundColor: colors.card,
            color: colors.text,
          }}
          placeholder="Задайте вопрос по таджикскому языку..."
          placeholderTextColor={colors.textTertiary}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={askBot}
          editable={!loading}
          returnKeyType="send"
        />
        <View style={{ marginLeft: 10 }}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Button title="Отправить" onPress={askBot} disabled={loading} />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}