import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAiTutor } from '@/lib/ai-tutor-context';
import { useEffect, useState } from 'react';

export default function AiTutorScreen() {
  const { messages, isLoading, askQuestion, loadHistory, clearHistory } = useAiTutor();
  const [question, setQuestion] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const handleAsk = async () => {
    if (question.trim()) {
      await askQuestion(question);
      setQuestion('');
    }
  };

  return (
    <ScreenContainer className="p-4 gap-4">
      {/* Header */}
      <View className="gap-2 mb-2">
        <Text className="text-3xl font-bold text-foreground">AI Tutor</Text>
        <Text className="text-sm text-muted">Ask any question and get instant answers</Text>
      </View>

      {/* Messages */}
      <ScrollView
        className="flex-1 bg-surface rounded-xl p-4 gap-3"
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View className="items-center justify-center py-8">
            <Text className="text-center text-muted text-sm">
              No messages yet. Ask your first question!
            </Text>
          </View>
        ) : (
          messages.map((msg) => (
            <View
              key={msg.id}
              className={`rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-primary ml-8 self-end'
                  : 'bg-background mr-8 self-start'
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
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))
        )}

        {isLoading && (
          <View className="flex-row items-center gap-2 bg-background rounded-lg p-3 mr-8">
            <ActivityIndicator color="#ADBB32" size="small" />
            <Text className="text-sm text-muted">AI is thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View className="gap-2 bg-surface rounded-xl p-3">
        <TextInput
          placeholder="Ask me anything..."
          placeholderTextColor="#A0A0A0"
          value={question}
          onChangeText={setQuestion}
          multiline
          maxLength={500}
          editable={!isLoading}
          className="bg-background text-foreground rounded-lg p-3 text-sm"
          style={{ minHeight: 50, maxHeight: 100 }}
        />

        <View className="flex-row gap-2">
          <Pressable
            onPress={handleAsk}
            disabled={isLoading || !question.trim()}
            style={({ pressed }) => [
              {
                flex: 1,
                backgroundColor: '#ADBB32',
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
                opacity: isLoading || !question.trim() ? 0.5 : pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-background font-semibold">Ask</Text>
          </Pressable>

          {messages.length > 0 && (
            <Pressable
              onPress={clearHistory}
              style={({ pressed }) => [
                {
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#EF4444',
                  alignItems: 'center',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-error font-semibold text-sm">Clear</Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}
