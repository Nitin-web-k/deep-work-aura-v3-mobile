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
  isLoading: boolean;
  preferredLanguage: Language;
  currentSubject: Subject;
  setPreferredLanguage: (lang: Language) => Promise<void>;
  setCurrentSubject: (subject: Subject) => Promise<void>;
  askQuestion: (question: string, trpcClient?: any) => Promise<void>;
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

// Subject-specific system prompts
function getSubjectPrompt(subject: Subject, language: Language): string {
  const prompts = {
    general: {
      english: 'You are a helpful general knowledge AI tutor. Answer questions clearly and concisely.',
      hindi: 'आप एक सहायक सामान्य ज्ञान AI शिक्षक हैं। प्रश्नों का स्पष्ट और संक्षिप्त उत्तर दें। हिंदी में उत्तर दें।',
      hinglish: 'Aap ek sahayak samanya gyan AI shikshak hain. Prashno ka spasht aur sankshapt uttar den. Hinglish mein uttar den.',
    },
    math: {
      english: 'You are an expert Math Solver. Help students solve mathematical problems step-by-step. Show all work and explain each step clearly. Use formulas and mathematical notation when appropriate.',
      hindi: 'आप एक विशेषज्ञ गणित समाधानकर्ता हैं। छात्रों को गणितीय समस्याओं को चरण-दर-चरण हल करने में मदद करें। सभी कार्य दिखाएं और प्रत्येक चरण को स्पष्ट रूप से समझाएं। हिंदी में उत्तर दें।',
      hinglish: 'Aap ek visheshagya math samadhanakarta hain. Chhatro ko ganitiya samasyao ko charan-dar-charan hal karne mein madad karein. Sabhi kary dikhayein aur pratyek charan ko spasht roop se samjhayein. Hinglish mein uttar den.',
    },
    science: {
      english: 'You are a Science Expert covering Physics, Chemistry, and Biology. Explain scientific concepts clearly with examples. Use diagrams or illustrations when helpful. Break down complex topics into understandable parts.',
      hindi: 'आप विज्ञान विशेषज्ञ हैं जो भौतिकी, रसायन विज्ञान और जीव विज्ञान को कवर करते हैं। वैज्ञानिक अवधारणाओं को उदाहरणों के साथ स्पष्ट रूप से समझाएं। जटिल विषयों को समझने योग्य भागों में विभाजित करें। हिंदी में उत्तर दें।',
      hinglish: 'Aap vigyan visheshagya hain jo bhautiki, rasayan vigyan aur jeev vigyan ko cover karte hain. Vaigyanic avdharnao ko udaharn ke saath spasht roop se samjhayein. Jatil vishyo ko samjhne yogy bhago mein vibhajit karein. Hinglish mein uttar den.',
    },
    history: {
      english: 'You are a History Guide expert in historical events, dates, and contexts. Provide accurate historical information with proper context. Explain the significance of events and their impact on society.',
      hindi: 'आप इतिहास गाइड विशेषज्ञ हैं जो ऐतिहासिक घटनाओं, तारीखों और संदर्भों में विशेषज्ञ हैं। उचित संदर्भ के साथ सटीक ऐतिहासिक जानकारी प्रदान करें। घटनाओं के महत्व और समाज पर उनके प्रभाव को समझाएं। हिंदी में उत्तर दें।',
      hinglish: 'Aap itihas guide visheshagya hain jo aitihasik ghatnaon, tarikho aur sandarbho mein visheshagya hain. Uchit sandarbh ke saath satik aitihasik jankari pradan karein. Ghatnaon ke mahatva aur samaj par unke prabhaav ko samjhayein. Hinglish mein uttar den.',
    },
    english: {
      english: 'You are an English Tutor expert in grammar, literature, writing, and language skills. Help with sentence structure, vocabulary, essay writing, and literary analysis. Provide clear explanations and examples.',
      hindi: 'आप अंग्रेजी शिक्षक हैं जो व्याकरण, साहित्य, लेखन और भाषा कौशल में विशेषज्ञ हैं। वाक्य संरचना, शब्दावली, निबंध लेखन और साहित्यिक विश्लेषण में मदद करें। स्पष्ट व्याख्या और उदाहरण प्रदान करें। हिंदी में उत्तर दें।',
      hinglish: 'Aap angrezi shikshak hain jo vyakaran, sahitya, lekhan aur bhasha kaushal mein visheshagya hain. Vakya sanrachna, shabdavali, nibandh lekhan aur sahityik vishleshan mein madad karein. Spasht vyakhya aur udaharn prdan karein. Hinglish mein uttar den.',
    },
  };

  return prompts[subject][language] || prompts.general.english;
}

export function AiTutorProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const detectLanguage = (text: string): Language => {
    return detectLanguageFromText(text);
  };

  const getErrorMessage = (lang: Language): string => {
    const errorMessages = {
      english: 'Sorry, I encountered an error while processing your question. Please try again.',
      hindi: 'क्षमा करें, आपके प्रश्न को संसाधित करते समय मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।',
      hinglish: 'Sorry, aapke prashna ko process karte samay mujhe ek error ka samna karna pada. Kripya dubara koshish karein.',
    };
    return errorMessages[lang];
  };

  const askQuestion = async (question: string, trpcClient?: any) => {
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
      subject: currentSubject,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await saveMessages(updatedMessages);

    setIsLoading(true);

    try {
      let answer = '';

      // Get subject-specific prompt
      const subjectPrompt = getSubjectPrompt(currentSubject, responseLanguage);

      // Try using tRPC client if available
      if (trpcClient) {
        try {
          const result = await trpcClient.ai.ask.mutate({
            question,
            language: responseLanguage,
            detectedLanguage: detectedLanguage,
            subject: currentSubject,
            subjectPrompt: subjectPrompt,
          });
          answer = result.answer;
        } catch (trpcError) {
          console.error('tRPC error:', trpcError);
          throw trpcError;
        }
      } else {
        // Fallback to direct API call
        const response = await fetch('/api/ai/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question,
            language: responseLanguage,
            detectedLanguage: detectedLanguage,
            subject: currentSubject,
            subjectPrompt: subjectPrompt,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        answer = data.answer;
      }

      // Add AI response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: answer,
        timestamp: Date.now(),
        language: responseLanguage,
        subject: currentSubject,
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
        subject: currentSubject,
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AiTutorContext.Provider
      value={{
        messages,
        isLoading,
        preferredLanguage,
        currentSubject,
        setPreferredLanguage,
        setCurrentSubject,
        askQuestion,
        clearHistory: async () => {
          setMessages([]);
          try {
            await AsyncStorage.removeItem('aiTutorMessages');
          } catch (error) {
            console.error('Error clearing AI tutor history:', error);
          }
        },
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
