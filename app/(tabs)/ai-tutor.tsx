import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAiTutor, type Language, SUBJECT_MODES } from '@/lib/ai-tutor-context';
import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';

const LANGUAGES: { label: string; value: Language }[] = [
  { label: '🇬🇧 English', value: 'english' },
  { label: '🇮🇳 हिंदी', value: 'hindi' },
  { label: '🇮🇳 Hinglish', value: 'hinglish' },
];

export default function AiTutorScreen() {
  const {
    messages,
    isLoading,
    preferredLanguage,
    currentSubject,
    setPreferredLanguage,
    setCurrentSubject,
    askQuestion,
    loadHistory,
    clearHistory,
  } = useAiTutor();
  const [question, setQuestion] = useState('');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const handleAsk = async () => {
    if (question.trim()) {
      await askQuestion(question, trpc);
      setQuestion('');
    }
  };

  const getLanguageLabel = (lang: Language) => {
    return LANGUAGES.find((l) => l.value === lang)?.label || 'English';
  };

  const getCurrentSubject = () => {
    return SUBJECT_MODES.find((s) => s.id === currentSubject);
  };

  const currentSubjectData = getCurrentSubject();

  return (
    <ScreenContainer className="p-4 gap-4">
      {/* Header with Language & Subject Selectors */}
      <View className="gap-2">
        <View className="flex-row items-center justify-between mb-2">
          <View className="gap-1 flex-1">
            <Text className="text-3xl font-bold text-foreground">AI Tutor</Text>
            <Text className="text-sm text-muted">Ask questions and get expert answers</Text>
          </View>
        </View>

        {/* Subject & Language Selector Row */}
        <View className="flex-row gap-2">
          {/* Subject Selector */}
          <Pressable
            onPress={() => setShowSubjectMenu(!showSubjectMenu)}
            style={({ pressed }) => [
              {
                flex: 1,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: currentSubjectData?.color || '#ADBB32',
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-sm font-bold text-background text-center">
              {currentSubjectData?.icon} {currentSubjectData?.name}
            </Text>
          </Pressable>

          {/* Language Selector */}
          <Pressable
            onPress={() => setShowLanguageMenu(!showLanguageMenu)}
            style={({ pressed }) => [
              {
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: '#1a1a1a',
                borderWidth: 1,
                borderColor: '#ADBB32',
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-sm font-semibold text-primary">{getLanguageLabel(preferredLanguage)}</Text>
          </Pressable>
        </View>

        {/* Subject Menu */}
        {showSubjectMenu && (
          <View className="bg-surface rounded-lg shadow-lg border border-border overflow-hidden">
            {SUBJECT_MODES.map((subject) => (
              <Pressable
                key={subject.id}
                onPress={() => {
                  setCurrentSubject(subject.id);
                  setShowSubjectMenu(false);
                }}
                style={({ pressed }) => [
                  {
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: currentSubject === subject.id ? subject.color : 'transparent',
                    opacity: pressed ? 0.8 : 1,
                    borderBottomWidth: 1,
                    borderBottomColor: '#2a2a2a',
                  },
                ]}
              >
                <Text
                  className={`text-sm font-semibold ${
                    currentSubject === subject.id ? 'text-background' : 'text-foreground'
                  }`}
                >
                  {subject.icon} {subject.name}
                </Text>
                <Text
                  className={`text-xs mt-1 ${
                    currentSubject === subject.id ? 'text-background opacity-80' : 'text-muted'
                  }`}
                >
                  {subject.description}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Language Menu */}
        {showLanguageMenu && (
          <View className="bg-surface rounded-lg shadow-lg z-10 min-w-max border border-border">
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.value}
                onPress={() => {
                  setPreferredLanguage(lang.value);
                  setShowLanguageMenu(false);
                }}
                style={({ pressed }) => [
                  {
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: preferredLanguage === lang.value ? '#ADBB32' : 'transparent',
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  className={`text-sm font-semibold ${
                    preferredLanguage === lang.value ? 'text-background' : 'text-foreground'
                  }`}
                >
                  {lang.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Messages */}
      <ScrollView
        className="flex-1 bg-surface rounded-xl p-4 gap-3"
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View className="items-center justify-center py-8">
            <Text className="text-4xl mb-3">{currentSubjectData?.icon}</Text>
            <Text className="text-center text-muted text-sm font-semibold mb-2">
              {currentSubjectData?.name} Mode
            </Text>
            <Text className="text-center text-muted text-xs">
              {preferredLanguage === 'hindi'
                ? 'अभी तक कोई संदेश नहीं। अपना पहला सवाल पूछें!'
                : preferredLanguage === 'hinglish'
                  ? 'Abhi tak koi message nahi. Apna pehla sawal poochein!'
                  : 'No messages yet. Ask your first question!'}
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
              <View className="flex-row items-center gap-1 mt-1">
                <Text
                  className={`text-xs ${
                    msg.role === 'user' ? 'text-background opacity-70' : 'text-muted'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Text>
                {msg.language && (
                  <Text className={`text-xs ${msg.role === 'user' ? 'text-background opacity-70' : 'text-muted'}`}>
                    • {msg.language.toUpperCase()}
                  </Text>
                )}
                {msg.subject && (
                  <Text className={`text-xs ${msg.role === 'user' ? 'text-background opacity-70' : 'text-muted'}`}>
                    • {msg.subject.toUpperCase()}
                  </Text>
                )}
              </View>
            </View>
          ))
        )}

        {isLoading && (
          <View className="flex-row items-center gap-2 bg-background rounded-lg p-3 mr-8">
            <ActivityIndicator color="#ADBB32" size="small" />
            <Text className="text-sm text-muted">
              {preferredLanguage === 'hindi'
                ? 'सोच रहा हूँ...'
                : preferredLanguage === 'hinglish'
                  ? 'Soch raha hoon...'
                  : 'AI is thinking...'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View className="gap-2 bg-surface rounded-xl p-3">
        <TextInput
          placeholder={
            preferredLanguage === 'hindi'
              ? 'कुछ भी पूछें...'
              : preferredLanguage === 'hinglish'
                ? 'Kuch bhi poochein...'
                : 'Ask me anything...'
          }
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
            <Text className="text-background font-semibold">
              {preferredLanguage === 'hindi' ? 'पूछें' : preferredLanguage === 'hinglish' ? 'Poochein' : 'Ask'}
            </Text>
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
              <Text className="text-error font-semibold text-sm">
                {preferredLanguage === 'hindi' ? 'साफ़' : preferredLanguage === 'hinglish' ? 'Clear' : 'Clear'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}
