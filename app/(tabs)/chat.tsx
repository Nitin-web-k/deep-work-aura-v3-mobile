import { Text, View, ScrollView, TextInput, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useRef, useEffect } from 'react';

// Comprehensive AI knowledge base
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

  // SET THEORY & RELATIONS
  if (q.includes('set') || q.includes('relation') || q.includes('subset')) {
    if (q.includes('a-b') || q.includes('a - b')) {
      return 'Set Relation: R={(a,b): a-b/3}\nFor Set A[1-10] and B={2,3,5,7,9,11,13}\nR contains pairs where (a-b) is divisible by 3\nExample: (1,1), (2,2), (3,3), (4,1), (5,2), (6,3), (7,4), (8,5), (9,6), (10,7)';
    }
    return 'Sets are collections of distinct elements.\nOperations: Union(∪), Intersection(∩), Complement, Difference\nRelations: Ordered pairs showing connection between elements';
  }

  // ALGEBRA
  if (q.includes('quadratic') || q.includes('equation') || q.includes('formula')) {
    return 'Quadratic Formula: x = (-b ± √(b²-4ac)) / 2a\nFor ax² + bx + c = 0\nDiscriminant (Δ) = b² - 4ac\n• If Δ > 0: Two real roots\n• If Δ = 0: One real root\n• If Δ < 0: No real roots';
  }

  // GEOMETRY
  if (q.includes('triangle') || q.includes('circle') || q.includes('area') || q.includes('perimeter')) {
    const responses: { [key: string]: string } = {
      'triangle': 'Triangle formulas:\n• Area = (1/2) × base × height\n• Perimeter = a + b + c\n• Pythagorean: a² + b² = c²',
      'circle': 'Circle formulas:\n• Area = πr²\n• Circumference = 2πr\n• Diameter = 2r',
      'rectangle': 'Rectangle:\n• Area = length × width\n• Perimeter = 2(l + w)',
    };
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key)) return value;
    }
  }

  // CALCULUS
  if (q.includes('derivative') || q.includes('integral') || q.includes('limit')) {
    const responses: { [key: string]: string } = {
      'derivative': 'Derivatives measure rate of change:\n• Power rule: d/dx(x^n) = nx^(n-1)\n• Product rule: (fg)\' = f\'g + fg\'\n• Chain rule: (f(g(x)))\' = f\'(g(x))·g\'(x)',
      'integral': 'Integrals are anti-derivatives:\n• ∫x^n dx = x^(n+1)/(n+1) + C\n• ∫e^x dx = e^x + C\n• ∫1/x dx = ln|x| + C',
      'limit': 'Limits describe behavior as x approaches a value:\n• lim(x→a) f(x) = L\n• Used in calculus foundations',
    };
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key)) return value;
    }
  }

  // PHYSICS
  if (q.includes('force') || q.includes('velocity') || q.includes('acceleration') || q.includes('energy')) {
    const responses: { [key: string]: string } = {
      'force': 'Force: F = ma (Newton\'s 2nd Law)\n• SI unit: Newton (N)\n• Types: Contact, Gravitational, Electromagnetic',
      'velocity': 'Velocity = displacement / time\n• Vector quantity (has direction)\n• Average velocity = Δx/Δt',
      'acceleration': 'Acceleration = change in velocity / time\n• a = (v_f - v_i) / t\n• Units: m/s²',
      'energy': 'Energy types:\n• Kinetic: KE = (1/2)mv²\n• Potential: PE = mgh\n• Total: E = KE + PE',
    };
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key)) return value;
    }
  }

  // CHEMISTRY
  if (q.includes('atom') || q.includes('molecule') || q.includes('reaction') || q.includes('bond')) {
    const responses: { [key: string]: string } = {
      'atom': 'Atom structure:\n• Nucleus: Protons + Neutrons\n• Electrons: Orbit nucleus\n• Atomic number = Protons',
      'molecule': 'Molecule: Two or more atoms bonded together\n• Covalent bond: Shared electrons\n• Ionic bond: Transferred electrons',
      'reaction': 'Chemical reactions:\n• Reactants → Products\n• Balanced equation: Equal atoms on both sides\n• Types: Synthesis, Decomposition, Combustion',
      'bond': 'Chemical bonds:\n• Covalent: Shared electrons\n• Ionic: Electron transfer\n• Metallic: Electron sea',
    };
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key)) return value;
    }
  }

  // BIOLOGY
  if (q.includes('cell') || q.includes('dna') || q.includes('photosynthesis') || q.includes('evolution')) {
    const responses: { [key: string]: string } = {
      'cell': 'Cell types:\n• Prokaryotic: No nucleus (bacteria)\n• Eukaryotic: Has nucleus (animals, plants)\n• Organelles: Mitochondria, ER, Golgi, Nucleus',
      'dna': 'DNA (Deoxyribonucleic Acid):\n• Double helix structure\n• Contains genes\n• Bases: A, T, G, C\n• A pairs with T, G pairs with C',
      'photosynthesis': '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\n• Light reactions: Thylakoid\n• Calvin cycle: Stroma\n• Produces glucose and oxygen',
      'evolution': 'Evolution: Change in species over time\n• Natural selection: Survival of fittest\n• Adaptation: Traits that help survival\n• Evidence: Fossils, DNA similarity',
    };
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key)) return value;
    }
  }

  // HISTORY
  if (q.includes('war') || q.includes('revolution') || q.includes('empire') || q.includes('history')) {
    const responses: { [key: string]: string } = {
      'world war': 'WW1 (1914-1918): Allied vs Central Powers\nWW2 (1939-1945): Axis vs Allies\nCauses: Nationalism, Imperialism, Militarism',
      'french revolution': '1789-1799: Overthrew monarchy\nCauses: Debt, Famine, Enlightenment ideas\nResults: Republic, Declaration of Rights',
      'industrial revolution': '1760-1840: Machines replaced manual labor\nKey: Steam engine, factories, urbanization\nImpact: Modern economy, social change',
    };
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key)) return value;
    }
  }

  // ENGLISH & LITERATURE
  if (q.includes('grammar') || q.includes('tense') || q.includes('literature') || q.includes('poem')) {
    const responses: { [key: string]: string } = {
      'tense': 'English Tenses:\n• Simple: Present, Past, Future\n• Continuous: -ing form\n• Perfect: Have/has/had + past participle',
      'grammar': 'Parts of speech: Noun, Verb, Adjective, Adverb, Pronoun, Preposition, Conjunction, Interjection',
      'literature': 'Literary devices: Metaphor, Simile, Personification, Alliteration, Irony, Symbolism',
    };
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key)) return value;
    }
  }

  // GREETINGS
  if (q === 'hi' || q === 'hello' || q === 'hey') {
    return '👋 Hi! I\'m your comprehensive AI tutor. I can help with:\n• Math (Algebra, Geometry, Calculus)\n• Science (Physics, Chemistry, Biology)\n• History & Literature\n• Any study topic!\n\nAsk me anything! 📚';
  }

  // STUDY TIPS
  if (q.includes('study') || q.includes('focus') || q.includes('exam') || q.includes('tips')) {
    return '📚 Study Tips:\n1. Pomodoro: 25min focus, 5min break\n2. Active recall: Test yourself\n3. Spaced repetition: Review regularly\n4. Teach others: Explain concepts\n5. Take notes by hand\n6. Get 8 hours sleep\n7. Exercise regularly';
  }

  // DEFAULT
  return '🤔 I can help with:\n\n📐 MATH: Algebra, Geometry, Calculus, Sets, Relations\n🔬 SCIENCE: Physics, Chemistry, Biology\n📚 HISTORY: Wars, Revolutions, Empires\n✍️ ENGLISH: Grammar, Literature, Tenses\n\nTry asking:\n• "What is photosynthesis?"\n• "Solve: 8585 + 5252"\n• "Explain quadratic formula"\n• "Set theory relations"';
}

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: 1, text: '👋 Hi! I\'m your comprehensive AI tutor. Ask me about Math, Science, History, English, or anything else! 📚', sender: 'ai' },
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
