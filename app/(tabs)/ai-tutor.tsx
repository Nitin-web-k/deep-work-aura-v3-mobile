import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator } from 'react-native';
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
    preferredLanguage,
    currentSubject,
    setPreferredLanguage,
    setCurrentSubject,
    addMessage,
    clearHistory,
    loadHistory,
  } = useAiTutor();

  const [question, setQuestion] = useState('');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // Use tRPC mutation hook directly
  const askMutation = trpc.ai.ask.useMutation();

  useEffect(() => {
    loadHistory();
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLocalLoading(true);

    try {
      // Get subject-specific prompt
      const currentSubjectData = SUBJECT_MODES.find((s) => s.id === currentSubject);
      const subjectPrompts = {
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
          hinglish: 'Aap itihas guide visheshagya hain jo aitihasik ghatnaon, tarikho aur sandarbho mein visheshagya hain. Uchit sandarbh ke saath satik aitihasik jankari prdan karein. Ghatnaon ke mahatva aur samaj par unke prabhaav ko samjhayein. Hinglish mein uttar den.',
        },
        english: {
          english: 'You are an English Tutor expert in grammar, literature, writing, and language skills. Help with sentence structure, vocabulary, essay writing, and literary analysis. Provide clear explanations and examples.',
          hindi: 'आप अंग्रेजी शिक्षक हैं जो व्याकरण, साहित्य, लेखन और भाषा कौशल में विशेषज्ञ हैं। वाक्य संरचना, शब्दावली, निबंध लेखन और साहित्यिक विश्लेषण में मदद करें। स्पष्ट व्याख्या और उदाहरण प्रदान करें। हिंदी में उत्तर दें।',
          hinglish: 'Aap angrezi shikshak hain jo vyakaran, sahitya, lekhan aur bhasha kaushal mein visheshagya hain. Vakya sanrachna, shabdavali, nibandh lekhan aur sahityik vishleshan mein madad karein. Spasht vyakhya aur udaharn prdan karein. Hinglish mein uttar den.',
        },
      };

      const subjectPrompt = subjectPrompts[currentSubject]?.[preferredLanguage] || subjectPrompts.general.english;

      // Add user message
      await addMessage({
        role: 'user',
        content: question,
        language: preferredLanguage,
        subject: currentSubject,
      });

      // Call tRPC mutation
      const result = await askMutation.mutateAsync({
        question,
        language: preferredLanguage,
        subject: currentSubject,
        subjectPrompt,
      });

      // Add AI response
      await addMessage({
        role: 'assistant',
        content: result.answer,
        language: preferredLanguage,
        subject: currentSubject,
      });

      setQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);

      // Add error message
      const errorMessages = {
        english: 'Sorry, I encountered an error. Please try again.',
        hindi: 'क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
        hinglish: 'Sorry, ek error hua. Kripya dubara koshish karein.',
      };

      await addMessage({
        role: 'assistant',
        content: errorMessages[preferredLanguage],
        language: preferredLanguage,
        subject: currentSubject,
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const getLanguageLabel = (lang: Language) => {
    return LANGUAGES.find((l) => l.value === lang)?.label || 'English';
  };

  const getCurrentSubject = () => {
    return SUBJECT_MODES.find((s) => s.id === currentSubject);
  };

  const currentSubjectData = getCurrentSubject();
  const isLoading_actual = localLoading || askMutation.isPending;

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
          <View className="bg-surface rounded-lg shadow-lg border border-border overflow-hidden z-20">
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
          <View className="bg-surface rounded-lg shadow-lg z-20 min-w-max border border-border">
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

        {isLoading_actual && (
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
          editable={!isLoading_actual}
          className="bg-background text-foreground rounded-lg p-3 text-sm"
          style={{ minHeight: 50, maxHeight: 100 }}
        />

        <View className="flex-row gap-2">
          <Pressable
            onPress={handleAsk}
            disabled={isLoading_actual || !question.trim()}
            style={({ pressed }) => [
              {
                flex: 1,
                backgroundColor: '#ADBB32',
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
                opacity: isLoading_actual || !question.trim() ? 0.5 : pressed ? 0.8 : 1,
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
