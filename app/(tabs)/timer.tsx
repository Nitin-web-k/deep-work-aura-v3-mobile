import { Text, View, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useEffect } from 'react';

export default function TimerScreen() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <ScreenContainer className="items-center justify-center gap-6">
      <Text className="text-4xl font-black text-primary">{isWork ? '⏲️ FOCUS TIME' : '☕ BREAK TIME'}</Text>
      <View className="w-64 h-64 rounded-full border-8 border-primary items-center justify-center bg-surface">
        <Text className="text-6xl font-black text-primary">{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</Text>
      </View>
      <Pressable onPress={() => setIsRunning(!isRunning)} style={({pressed}) => [{opacity: pressed ? 0.7 : 1}]}>
        <View className="bg-primary rounded-2xl px-8 py-4">
          <Text className="text-white font-black text-lg">{isRunning ? '⏸ PAUSE' : '▶ START'}</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => { setTimeLeft(25 * 60); setIsRunning(false); setIsWork(true); }} style={({pressed}) => [{opacity: pressed ? 0.7 : 1}]}>
        <View className="border-2 border-primary rounded-2xl px-8 py-4">
          <Text className="text-primary font-black text-lg">🔄 RESET</Text>
        </View>
      </Pressable>
    </ScreenContainer>
  );
}
