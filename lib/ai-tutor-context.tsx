import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'english' | 'hindi' | 'hinglish';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  language?: Language;
}

export interface AiTutorContextType {
  messages: Message[];
  isLoading: boolean;
  preferredLanguage: Language;
  setPreferredLanguage: (lang: Language) => Promise<void>;
  askQuestion: (question: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  loadHistory: () => Promise<void>;
  detectLanguage: (text: string) => Language;
}

const AiTutorContext = createContext<AiTutorContextType | undefined>(undefined);

// Simple language detection based on script/keywords
function detectLanguageFromText(text: string): Language {
  // Check for Devanagari script (Hindi)
  const devanagariRegex = /[\u0900-\u097F]/g;
  if (devanagariRegex.test(text)) {
    return 'hindi';
  }

  // Check for common Hindi/Hinglish words
  const hindiWords = ['aur', 'kya', 'hai', 'hain', 'ke', 'ka', 'ki', 'na', 'nahi', 'haan', 'bilkul', 'samajh', 'batao', 'bolo', 'likho'];
  const words = text.toLowerCase().split(/\s+/);
  const hindiWordCount = words.filter(w => hindiWords.some(hw => w.includes(hw))).length;

  if (hindiWordCount > words.length * 0.3) {
    return 'hinglish';
  }

  return 'english';
}

export function AiTutorProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [preferredLanguage, setPreferredLanguageState] = useState<Language>('english');

  const loadHistory = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('aiTutorMessages');
      const savedLanguage = await AsyncStorage.getItem('aiTutorLanguage');

      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      if (savedLanguage) {
        setPreferredLanguageState(JSON.parse(savedLanguage));
      }
    } catch (error) {
      console.error('Error loading AI tutor history:', error);
    }
  };

  const saveMessages = async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem('aiTutorMessages', JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving AI tutor messages:', error);
    }
  };

  const setPreferredLanguage = async (lang: Language) => {
    setPreferredLanguageState(lang);
    try {
      await AsyncStorage.setItem('aiTutorLanguage', JSON.stringify(lang));
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const detectLanguage = (text: string): Language => {
    return detectLanguageFromText(text);
  };

  const askQuestion = async (question: string) => {
    if (!question.trim()) return;

    // Detect language from question
    const detectedLanguage = detectLanguage(question);
    const responseLanguage = preferredLanguage === 'english' ? detectedLanguage : preferredLanguage;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: Date.now(),
      language: detectedLanguage,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await saveMessages(updatedMessages);

    setIsLoading(true);

    try {
      // Call the backend AI service with language parameter
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          conversationHistory: messages,
          language: responseLanguage,
          detectedLanguage: detectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      // Add AI response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        timestamp: Date.now(),
        language: responseLanguage,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);
    } catch (error) {
      console.error('Error getting AI response:', error);

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: getErrorMessage(responseLanguage),
        timestamp: Date.now(),
        language: responseLanguage,
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (lang: Language): string => {
    const messages = {
      english: 'Sorry, I encountered an error while processing your question. Please try again.',
      hindi: 'क्षमा करें, आपके प्रश्न को संसाधित करते समय मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।',
      hinglish: 'Sorry, aapke prashna ko process karte samay mujhe ek error ka samna karna pada. Kripya dubara koshish karein.',
    };
    return messages[lang];
  };

  const clearHistory = async () => {
    setMessages([]);
    try {
      await AsyncStorage.removeItem('aiTutorMessages');
    } catch (error) {
      console.error('Error clearing AI tutor history:', error);
    }
  };

  return (
    <AiTutorContext.Provider
      value={{
        messages,
        isLoading,
        preferredLanguage,
        setPreferredLanguage,
        askQuestion,
        clearHistory,
        loadHistory,
        detectLanguage,
      }}
    >
      {children}
    </AiTutorContext.Provider>
  );
}

export function useAiTutor() {
  const context = useContext(AiTutorContext);
  if (!context) {
    throw new Error('useAiTutor must be used within an AiTutorProvider');
  }
  return context;
}
