import { Text, View, ScrollView, TextInput, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useRef, useEffect } from 'react';

// Smart AI response generator
function getAIResponse(question: string): string {
  const q = question.toLowerCase().trim();
  
  // Math calculations
  if (q.match(/[0-9+\-*/()]/)) {
    try {
      const result = eval(q.replace(/[^0-9+\-*/().]/g, ''));
      return `✅ Answer: ${result}`;
    } catch (e) {
      return 'Math help: Try "5 + 3" or "10 * 2"';
    }
  }

  // General knowledge
  const responses: { [key: string]: string } = {
    'what is python': 'Python is a high-level programming language known for simplicity. Used in web dev, data science, and AI.',
    'who is albert einstein': 'Albert Einstein developed the theory of relativity, one of the most important physics theories.',
    'when was the internet invented': 'ARPANET (1969), World Wide Web (1989 by Tim Berners-Lee)',
    'where is the eiffel tower': 'Paris, France. Built in 1889 for the World\'s Fair.',
    'why is the sky blue': 'Rayleigh scattering - blue light has shorter wavelength and scatters more.',
    'what is photosynthesis': 'Process where plants convert sunlight into chemical energy (glucose) using chlorophyll.',
    'what is gravity': 'Force that attracts objects with mass. Described by Newton\'s law and Einstein\'s relativity.',
    'what is dna': 'Deoxyribonucleic acid - carries genetic instructions for life. Double helix structure.',
  };

  for (const [key, value] of Object.entries(responses)) {
    if (q.includes(key)) return value;
  }

  // Greetings
  if (q === 'hi' || q === 'hello' || q === 'hey') {
    return '👋 Hi! I\'m your AI study buddy. Ask me math, science, history, or study tips!';
  }

  // Study tips
  if (q.includes('study') || q.includes('focus') || q.includes('exam')) {
    return '📚 Study Tips:\n1. Pomodoro: 25min focus, 5min break\n2. Take handwritten notes\n3. Teach concepts to others\n4. Practice regularly\n5. Get 8hrs sleep!';
  }

  // Default
  return '🤔 Good question! Try asking me:\n• Math ("8585 + 5252")\n• Science/History\n• Study advice\n• General knowledge';
}

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: 1, text: '👋 Hi! I\'m your AI study buddy. Ask me anything - math, science, history, or study tips!', sender: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { id: messages.length + 1, text: input, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      setInput('');

      setTimeout(() => {
        const aiResponse = getAIResponse(input);
        setMessages(prev => [...prev, { id: prev.length + 1, text: aiResponse, sender: 'ai' }]);
        setIsLoading(false);
      }, 600);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <ScreenContainer className="gap-4">
      <Text className="text-3xl font-black text-primary">💬 AI Chat</Text>
      
      <ScrollView 
        ref={scrollRef}
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map(msg => (
          <View key={msg.id} className={`mb-4 flex-row ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <View 
              className={`max-w-xs rounded-3xl p-4 ${
                msg.sender === 'user' 
                  ? 'bg-primary' 
                  : 'bg-surface border-2 border-primary/30'
              }`}
            >
              <Text className={`${msg.sender === 'user' ? 'text-white' : 'text-foreground'} leading-6`}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
        
        {isLoading && (
          <View className="mb-4 flex-row justify-start">
            <View className="bg-surface border-2 border-primary/30 rounded-3xl p-4">
              <Text className="text-muted">✨ Thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View className="flex-row gap-2 items-end">
        <TextInput 
          placeholder="Ask me anything..." 
          placeholderTextColor="#666" 
          value={input} 
          onChangeText={setInput}
          multiline
          maxLength={500}
          className="flex-1 bg-surface rounded-3xl p-4 text-foreground border-2 border-primary/30 max-h-24" 
        />
        <Pressable 
          onPress={handleSend}
          disabled={!input.trim() || isLoading}
          style={({pressed}) => [{opacity: pressed ? 0.7 : 1}]}
        >
          <View className="bg-primary rounded-full p-4 items-center justify-center">
            <Text className="text-white font-black text-lg">→</Text>
          </View>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
