import { ScrollView, Text, View, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

const mockResponses: Record<string, string> = {
  'hello': 'Hey there! 👋 I\'m your AI assistant. Ask me anything about studying, productivity, or anything else!',
  'how are you': 'I\'m doing great! Ready to help you with any questions. What\'s on your mind?',
  'what is pomodoro': 'The Pomodoro Technique is a time management method that uses a timer to break work into focused intervals (usually 25 minutes) separated by short breaks. It helps improve concentration and productivity!',
  'how to study': 'Here are some effective study tips:\n1. Create a distraction-free environment\n2. Use the Pomodoro technique\n3. Take regular breaks\n4. Review notes regularly\n5. Practice active recall\n6. Stay hydrated and get enough sleep',
  'motivation': '🚀 You\'ve got this! Every small step towards your goals counts. Keep pushing, stay focused, and remember - consistency is key to success!',
  'default': 'That\'s a great question! I\'m here to help. Feel free to ask me anything about studying, productivity, time management, or any other topic you\'d like to discuss.',
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! 👋 I\'m your AI assistant. Ask me anything!',
      isUser: false,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getMockResponse = (question: string): string => {
    const lower = question.toLowerCase();
    for (const [key, response] of Object.entries(mockResponses)) {
      if (lower.includes(key)) {
        return response;
      }
    }
    return mockResponses.default;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: input,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        text: getMockResponse(input),
        isUser: false,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <ScreenContainer className="gap-3">
        {/* Header */}
        <View className="gap-2 mb-2">
          <Text className="text-3xl font-bold text-foreground">AI Chat</Text>
          <Text className="text-sm text-muted">Ask me anything</Text>
        </View>

        {/* Messages */}
        <ScrollView
          className="flex-1 gap-3"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {}}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              className={`flex-row ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <View
                className="max-w-xs rounded-2xl px-4 py-3"
                style={{
                  backgroundColor: msg.isUser ? 'rgba(99, 102, 241, 0.8)' : 'rgba(30, 41, 59, 0.8)',
                  borderWidth: msg.isUser ? 0 : 1,
                  borderColor: 'rgba(99, 102, 241, 0.3)',
                }}
              >
                <Text
                  className={`text-sm leading-relaxed ${
                    msg.isUser ? 'text-white' : 'text-foreground'
                  }`}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View className="flex-row justify-start">
              <View
                className="rounded-2xl px-4 py-3"
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.8)',
                  borderWidth: 1,
                  borderColor: 'rgba(99, 102, 241, 0.3)',
                }}
              >
                <Text className="text-muted">Thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View
          className="flex-row gap-2 items-end p-3 rounded-2xl border"
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderColor: 'rgba(99, 102, 241, 0.3)',
          }}
        >
          <TextInput
            placeholder="Ask me anything..."
            placeholderTextColor="#666"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            editable={!isTyping}
            className="flex-1 text-foreground text-sm"
            style={{ minHeight: 44, maxHeight: 100 }}
          />
          <Pressable
            onPress={handleSendMessage}
            disabled={isTyping || !input.trim()}
            style={({ pressed }) => [
              {
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: '#6366F1',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isTyping || !input.trim() ? 0.5 : pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-xl">➤</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
