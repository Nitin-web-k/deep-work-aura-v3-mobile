import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AiTutorContextType {
  messages: Message[];
  isLoading: boolean;
  askQuestion: (question: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  loadHistory: () => Promise<void>;
}

const AiTutorContext = createContext<AiTutorContextType | undefined>(undefined);

export function AiTutorProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('aiTutorMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
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

  const askQuestion = async (question: string) => {
    if (!question.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await saveMessages(updatedMessages);

    setIsLoading(true);

    try {
      // Call the backend AI service
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          conversationHistory: messages,
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
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
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
        askQuestion,
        clearHistory,
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
