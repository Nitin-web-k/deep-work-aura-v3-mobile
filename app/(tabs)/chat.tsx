import { Text, View, ScrollView, TextInput, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! How can I help you today?', sender: 'ai' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: input, sender: 'user' }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: prev.length + 1, text: 'That\'s a great question! Here\'s what I think...', sender: 'ai' }]);
      }, 500);
      setInput('');
    }
  };

  return (
    <ScreenContainer className="gap-4">
      <Text className="text-3xl font-black text-primary">AI Chat</Text>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {messages.map(msg => (
          <View key={msg.id} className={`mb-3 flex-row ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <View className={`max-w-xs rounded-2xl p-4 ${msg.sender === 'user' ? 'bg-primary' : 'bg-surface border border-primary/30'}`}>
              <Text className={msg.sender === 'user' ? 'text-white' : 'text-foreground'}>{msg.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View className="flex-row gap-2 items-center">
        <TextInput placeholder="Ask anything..." placeholderTextColor="#666" value={input} onChangeText={setInput} className="flex-1 bg-surface rounded-2xl p-4 text-foreground border border-primary/30" />
        <Pressable onPress={handleSend} style={({pressed}) => [{opacity: pressed ? 0.7 : 1}]}>
          <View className="bg-primary rounded-2xl p-4"><Text className="text-white font-black text-lg">→</Text></View>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
