import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  language?: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'english' | 'hindi' | 'hinglish'>('english');
  const scrollViewRef = useRef<ScrollView>(null);
  const [isLoading, setIsLoading] = useState(false);

  const askMutation = trpc.ai.ask.useMutation();

  // Load chat history
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem('chatHistory');
      const savedLang = await AsyncStorage.getItem('chatLanguage');
      if (saved) setMessages(JSON.parse(saved));
      if (savedLang) setLanguage(JSON.parse(savedLang));
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = async (msgs: ChatMessage[]) => {
    try {
      await AsyncStorage.setItem('chatHistory', JSON.stringify(msgs));
      await AsyncStorage.setItem('chatLanguage', JSON.stringify(language));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: input,
      role: 'user',
      timestamp: Date.now(),
      language,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const result = await askMutation.mutateAsync({
        question: input,
        language,
        subject: 'general',
        subjectPrompt: 'You are a helpful AI assistant. Answer questions clearly and concisely in the user\'s preferred language.',
      });

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: result.answer,
        role: 'assistant',
        timestamp: Date.now(),
        language,
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      await saveChatHistory(finalMessages);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessages = {
        english: 'Sorry, I encountered an error. Please try again.',
        hindi: 'क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
        hinglish: 'Sorry, ek error hua. Kripya dubara koshish karein.',
      };

      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: errorMessages[language],
        role: 'assistant',
        timestamp: Date.now(),
        language,
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      await saveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    setMessages([]);
    try {
      await AsyncStorage.removeItem('chatHistory');
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const languageOptions = [
    { label: '🇬🇧 English', value: 'english' as const },
    { label: '🇮🇳 हिंदी', value: 'hindi' as const },
    { label: '🇮🇳 Hinglish', value: 'hinglish' as const },
  ];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <ScreenContainer className="gap-3">
        {/* Header */}
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-foreground">AI Chat</Text>
              <Text className="text-sm text-muted">Ask anything, get instant answers</Text>
            </View>
            <View className="bg-primary rounded-full p-3">
              <Text className="text-xl">💬</Text>
            </View>
          </View>

          {/* Language Selector */}
          <View className="flex-row gap-2">
            {languageOptions.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => setLanguage(opt.value)}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor: language === opt.value ? '#ADBB32' : '#1a1a1a',
                    borderWidth: language === opt.value ? 0 : 1,
                    borderColor: '#ADBB32',
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  className={`text-xs font-bold text-center ${
                    language === opt.value ? 'text-background' : 'text-primary'
                  }`}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Messages Container */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 bg-surface rounded-2xl p-4 gap-3"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-5xl mb-4">💭</Text>
              <Text className="text-lg font-bold text-foreground mb-2">Start a Conversation</Text>
              <Text className="text-sm text-muted text-center">
                {language === 'hindi'
                  ? 'कोई भी सवाल पूछें और तुरंत जवाब पाएं'
                  : language === 'hinglish'
                    ? 'Koi bhi sawal poochein aur turant jawab paayein'
                    : 'Ask any question and get instant answers'}
              </Text>
            </View>
          ) : (
            messages.map((msg) => (
              <View
                key={msg.id}
                className={`flex-row ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <View
                  className={`max-w-xs rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary rounded-br-none'
                      : 'bg-background rounded-bl-none border border-border'
                  }`}
                >
                  <Text
                    className={`text-sm leading-relaxed ${
                      msg.role === 'user' ? 'text-background' : 'text-foreground'
                    }`}
                  >
                    {msg.content}
                  </Text>
                  <Text
                    className={`text-xs mt-1 ${
                      msg.role === 'user' ? 'text-background opacity-70' : 'text-muted'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
            ))
          )}

          {isLoading && (
            <View className="flex-row items-center gap-2">
              <View className="bg-background rounded-full p-2">
                <ActivityIndicator color="#ADBB32" size="small" />
              </View>
              <Text className="text-sm text-muted">
                {language === 'hindi' ? 'सोच रहा हूँ...' : language === 'hinglish' ? 'Soch raha hoon...' : 'Thinking...'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View className="bg-surface rounded-2xl p-3 gap-2 border border-border">
          <View className="flex-row gap-2 items-end">
            <TextInput
              placeholder={
                language === 'hindi'
                  ? 'कुछ भी पूछें...'
                  : language === 'hinglish'
                    ? 'Kuch bhi poochein...'
                    : 'Ask me anything...'
              }
              placeholderTextColor="#666"
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
              editable={!isLoading}
              className="flex-1 bg-background text-foreground rounded-lg px-3 py-2 text-sm"
              style={{ minHeight: 44, maxHeight: 100 }}
            />
            <Pressable
              onPress={handleSendMessage}
              disabled={isLoading || !input.trim()}
              style={({ pressed }) => [
                {
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: '#ADBB32',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isLoading || !input.trim() ? 0.5 : pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-xl">➤</Text>
            </Pressable>
          </View>

          {messages.length > 0 && (
            <Pressable
              onPress={handleClearChat}
              style={({ pressed }) => [
                {
                  paddingVertical: 8,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-xs text-error text-center font-semibold">
                {language === 'hindi' ? 'चैट साफ़ करें' : language === 'hinglish' ? 'Chat clear karein' : 'Clear Chat'}
              </Text>
            </Pressable>
          )}
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
