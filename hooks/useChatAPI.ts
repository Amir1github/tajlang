// hooks/useChatAPI.ts
import { useCallback } from 'react';
import { GOOGLE_GEMINI_API_URL, GOOGLE_API_KEY, AMEENA_API_URL, AMEENA_MODES } from '@/utils/constants';

export const useChatAPI = () => {
  const askGemini = useCallback(async (userMessage: string): Promise<string> => {
    try {
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
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const candidate = data?.candidates?.[0];
      
      if (candidate && candidate.content?.parts) {
        return candidate.content.parts.map((part: any) => part.text).join(' ');
      }
      
      throw new Error('Invalid response format from Gemini API');
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Извините, не могу ответить. Попробуйте еще раз.');
    }
  }, []);

  const askAmeena = useCallback(async (userMessage: string, selectedMode: string = 'normal'): Promise<string> => {
    try {
      const systemPrompt = AMEENA_MODES[selectedMode]?.system_prompt || AMEENA_MODES.normal.system_prompt;
      
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
          system_prompt: systemPrompt
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ameena API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      }
      
      throw new Error('Invalid response format from Ameena API');
    } catch (error) {
      console.error('Ameena API Error:', error);
      throw new Error('Мутаассифона, ҷавоб дода наметавонам. Лутфан аз нав кӯшиш кунед.');
    }
  }, []);

  return {
    askGemini,
    askAmeena
  };
};