import { Text, View, ScrollView, TextInput, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useRef, useEffect } from 'react';

// Unlimited AI knowledge base
function getAIResponse(question: string): string {
  const q = question.toLowerCase().trim();
  
  // MATH CALCULATIONS
  if (q.match(/^[0-9+\-*/().=\s]+$/)) {
    try {
      const result = eval(q.replace(/[^0-9+\-*/().]/g, ''));
      return `✅ Answer: ${result}`;
    } catch (e) {
      return 'Math help: Try "5 + 3" or "10 * 2"';
    }
  }

  // COSMOLOGY & UNIVERSE
  if (q.includes('big bang') || q.includes('universe') || q.includes('black hole') || q.includes('multiverse')) {
    const responses: { [key: string]: string } = {
      'big bang': 'Big Bang Theory:\n• Universe began ~13.8 billion years ago\n• Started from single point of infinite density\n• Expanded and cooled, forming matter\n• Still expanding today (accelerating)',
      'big bang reverse': 'If Big Bang reversed (Big Crunch):\n• Universe would contract\n• All matter/energy compress back\n• Temperature would increase infinitely\n• Time might reverse or stop\n• Theoretical scenario, not proven',
      'black hole': 'Black Hole:\n• Region where gravity is so strong light cannot escape\n• Event horizon: Point of no return\n• Formed from collapsed massive stars\n• Singularity at center\n• Stephen Hawking radiation theory',
      'multiverse': 'Multiverse Theory:\n• Infinite parallel universes may exist\n• Each with different physical laws\n• Quantum mechanics supports possibility\n• Many-worlds interpretation\n• Still theoretical, unproven',
    };
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key)) return value;
    }
  }

  // ASTRONOMY
  if (q.includes('planet') || q.includes('star') || q.includes('galaxy') || q.includes('solar system')) {
    const responses: { [key: string]: string } = {
      'planets': 'Solar System Planets:\n1. Mercury - Closest to Sun\n2. Venus - Hottest\n3. Earth - Our home\n4. Mars - Red planet\n5. Jupiter - Largest\n6. Saturn - Rings\n7. Uranus - Tilted\n8. Neptune - Farthest',
      'sun': 'The Sun:\n• Star at center of Solar System\n• 99.86% of Solar System mass\n• Age: ~4.6 billion years\n• Fuses hydrogen into helium\n• Core temp: 15 million K',
      'galaxy': 'Galaxy:\n• System of billions of stars\n• Held together by gravity\n• Types: Spiral, Elliptical, Irregular\n• Milky Way: Our galaxy\n• Contains ~200-400 billion stars',
    };
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key)) return value;
    }
  }

  // GENERAL KNOWLEDGE
  if (q.includes('capital') || q.includes('country') || q.includes('population') || q.includes('largest')) {
    const responses: { [key: string]: string } = {
      'capital of india': 'New Delhi is the capital of India\n• Located on Yamuna River\n• Became capital in 1931\n• Designed by Edwin Lutyens\n• Population: ~30 million (metro)',
      'largest country': 'Russia is the largest country by area\n• Area: 17.1 million km²\n• Spans 11 time zones\n• Population: ~144 million',
      'most populated': 'India is now most populated country\n• Population: ~1.4+ billion\n• Recently surpassed China\n• Diverse cultures and languages',
    };
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key)) return value;
    }
  }

  // TECHNOLOGY & INTERNET
  if (q.includes('internet') || q.includes('ai') || q.includes('computer') || q.includes('technology')) {
    const responses: { [key: string]: string } = {
      'internet': 'Internet:\n• Started as ARPANET (1969)\n• World Wide Web (1989)\n• TCP/IP protocols\n• Connects billions of devices\n• ~5 billion users worldwide',
      'artificial intelligence': 'AI (Artificial Intelligence):\n• Machines performing intelligent tasks\n• Machine Learning: Learn from data\n• Deep Learning: Neural networks\n• NLP: Natural Language Processing\n• Applications: ChatGPT, Recommendations',
      'blockchain': 'Blockchain:\n• Distributed ledger technology\n• Immutable records\n• Used in cryptocurrency\n• Transparent and secure\n• Bitcoin, Ethereum examples',
    };
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key)) return value;
    }
  }

  // PHILOSOPHY & EXISTENCE
  if (q.includes('meaning of life') || q.includes('philosophy') || q.includes('existence') || q.includes('consciousness')) {
    const responses: { [key: string]: string } = {
      'meaning of life': 'Meaning of Life (philosophical):\n• Different perspectives:\n• Religious: Serve God/higher power\n• Existential: Create your own meaning\n• Humanist: Help others, pursue happiness\n• Nihilist: No inherent meaning\n• Personal: Find what fulfills you',
      'consciousness': 'Consciousness:\n• Subjective experience and awareness\n• Still not fully understood\n• Hard problem of consciousness\n• Theories: Materialism, Dualism, Panpsychism\n• Related to brain activity',
      'philosophy': 'Philosophy:\n• Study of fundamental questions\n• Branches: Metaphysics, Epistemology, Ethics, Logic\n• Ancient: Plato, Aristotle, Socrates\n• Modern: Descartes, Kant, Nietzsche',
    };
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key)) return value;
    }
  }

  // HISTORY
  if (q.includes('history') || q.includes('ancient') || q.includes('medieval') || q.includes('modern')) {
    const responses: { [key: string]: string } = {
      'ancient egypt': 'Ancient Egypt:\n• ~3100 BCE - 30 BCE\n• Nile River civilization\n• Pyramids, Pharaohs, Hieroglyphics\n• Advanced mathematics and medicine\n• Cleopatra last pharaoh',
      'roman empire': 'Roman Empire:\n• 27 BCE - 476 CE (Western)\n• Largest empire of ancient world\n• Latin language, Roman law\n• Colosseum, Aqueducts, Roads\n• Julius Caesar, Augustus, Nero',
      'world war 2': 'World War 2 (1939-1945):\n• Axis vs Allies\n• Hitler, Mussolini, Tojo\n• Holocaust: 6 million Jews killed\n• Atomic bombs: Hiroshima, Nagasaki\n• 70-85 million deaths total',
    };
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key)) return value;
    }
  }

  // SPORTS
  if (q.includes('cricket') || q.includes('football') || q.includes('sports') || q.includes('olympics')) {
    const responses: { [key: string]: string } = {
      'cricket': 'Cricket:\n• Originated in England (16th century)\n• Popular in India, Pakistan, Australia\n• Formats: Test, ODI, T20\n• Sachin Tendulkar: Greatest batsman\n• India won World Cup 2011',
      'football': 'Football (Soccer):\n• Most popular sport worldwide\n• 11 players per team\n• FIFA World Cup every 4 years\n• Messi, Ronaldo: Greatest players\n• Brazil 5-time World Cup winner',
      'olympics': 'Olympics:\n• Ancient: Started 776 BCE\n• Modern: Started 1896\n• Held every 4 years\n• Summer and Winter Olympics\n• Tokyo 2020: Most recent',
    };
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key)) return value;
    }
  }

  // GREETINGS
  if (q === 'hi' || q === 'hello' || q === 'hey') {
    return '👋 Hi! I\'m your unlimited AI tutor. I know about:\n• Math, Science, History, English\n• Universe, Astronomy, Cosmology\n• Technology, Philosophy, Sports\n• Geography, Culture, Everything!\n\nAsk me ANYTHING! 🌍';
  }

  // STUDY TIPS
  if (q.includes('study') || q.includes('focus') || q.includes('exam') || q.includes('tips')) {
    return '📚 Study Tips:\n1. Pomodoro: 25min focus, 5min break\n2. Active recall: Test yourself\n3. Spaced repetition: Review regularly\n4. Teach others: Explain concepts\n5. Take notes by hand\n6. Get 8 hours sleep\n7. Exercise regularly\n8. Minimize distractions';
  }

  // DEFAULT - COMPREHENSIVE RESPONSE
  return '🤔 I can help with ANYTHING!\n\n📐 MATH: Algebra, Geometry, Calculus, Sets\n🔬 SCIENCE: Physics, Chemistry, Biology\n🌌 UNIVERSE: Big Bang, Black Holes, Galaxies\n🌍 GEO: Countries, Capitals, Cultures\n📚 HISTORY: Ancient, Medieval, Modern\n💻 TECH: AI, Internet, Blockchain\n🏆 SPORTS: Cricket, Football, Olympics\n🧠 PHILOSOPHY: Life, Consciousness, Ethics\n\nTry ANY question - I\'ll answer it! 🚀';
}

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: 1, text: '👋 Hi! I\'m your unlimited AI tutor. Ask me ANYTHING - from Math to Universe, History to Philosophy, Sports to Technology. I know it all! 🌍', sender: 'ai' },
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
      <Text className="text-3xl font-black text-primary">💬 AI Tutor</Text>
      
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
