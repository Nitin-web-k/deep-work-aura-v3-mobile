import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'english' | 'hindi' | 'hinglish';
export type Subject = 'general' | 'math' | 'science' | 'history' | 'english';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  language?: Language;
  subject?: Subject;
}

export interface SubjectMode {
  id: Subject;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const SUBJECT_MODES: SubjectMode[] = [
  {
    id: 'general',
    name: 'General',
    icon: '💡',
    description: 'General knowledge and questions',
    color: '#ADBB32',
  },
  {
    id: 'math',
    name: 'Math Solver',
    icon: '🔢',
    description: 'Mathematics and calculations',
    color: '#FF6B6B',
  },
  {
    id: 'science',
    name: 'Science Expert',
    icon: '🔬',
    description: 'Physics, Chemistry, Biology',
    color: '#4ECDC4',
  },
  {
    id: 'history',
    name: 'History Guide',
    icon: '📚',
    description: 'History and social studies',
    color: '#FFE66D',
  },
  {
    id: 'english',
    name: 'English Tutor',
    icon: '📖',
    description: 'Grammar, literature, writing',
    color: '#95E1D3',
  },
];

export interface AiTutorContextType {
  messages: Message[];
  preferredLanguage: Language;
  currentSubject: Subject;
  setPreferredLanguage: (lang: Language) => Promise<void>;
  setCurrentSubject: (subject: Subject) => Promise<void>;
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  clearHistory: () => Promise<void>;
  loadHistory: () => Promise<void>;
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
  const [preferredLanguage, setPreferredLanguageState] = useState<Language>('english');
  const [currentSubject, setCurrentSubjectState] = useState<Subject>('general');

  const loadHistory = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('aiTutorMessages');
      const savedLanguage = await AsyncStorage.getItem('aiTutorLanguage');
      const savedSubject = await AsyncStorage.getItem('aiTutorSubject');

      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      if (savedLanguage) {
        setPreferredLanguageState(JSON.parse(savedLanguage));
      }
      if (savedSubject) {
        setCurrentSubjectState(JSON.parse(savedSubject));
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

  const setCurrentSubject = async (subject: Subject) => {
    setCurrentSubjectState(subject);
    try {
      await AsyncStorage.setItem('aiTutorSubject', JSON.stringify(subject));
    } catch (error) {
      console.error('Error saving subject preference:', error);
    }
  };

  const addMessage = async (msg: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      timestamp: Date.now(),
      ...msg,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    await saveMessages(updatedMessages);
  };

  return (
    <AiTutorContext.Provider
      value={{
        messages,
        preferredLanguage,
        currentSubject,
        setPreferredLanguage,
        setCurrentSubject,
        addMessage,
        clearHistory: async () => {
          setMessages([]);
          try {
            await AsyncStorage.removeItem('aiTutorMessages');
          } catch (error) {
            console.error('Error clearing AI tutor history:', error);
          }
        },
        loadHistory,
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
