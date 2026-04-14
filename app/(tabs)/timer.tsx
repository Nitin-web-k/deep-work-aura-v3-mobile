import { Text, View, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useEffect } from 'react';

export default function TimerScreen() {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);

  useEffect(() => {
    let interval: any;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsWorkSession(!isWorkSession);
            return isWorkSession ? breakDuration * 60 : workDuration * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isWorkSession, workDuration, breakDuration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(workDuration * 60);
    setIsWorkSession(true);
  };

  const progress = isWorkSession
    ? 1 - timeLeft / (workDuration * 60)
    : 1 - timeLeft / (breakDuration * 60);

  return (
    <ScreenContainer className="gap-6 items-center justify-center">
      {/* Header */}
      <View className="gap-2 w-full">
        <Text className="text-3xl font-bold text-foreground">Focus Timer</Text>
        <Text className="text-sm text-muted">
          {isWorkSession ? 'Work Session' : 'Break Time'}
        </Text>
      </View>

      {/* Timer Display */}
      <View
        className="w-64 h-64 rounded-full items-center justify-center border-8"
        style={{
          borderColor: 'rgba(99, 102, 241, 0.5)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
        }}
      >
        <View
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: 'rgba(99, 102, 241, 0.05)',
          }}
        />
        <View className="items-center gap-2">
          <Text className="text-6xl font-bold text-foreground">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </Text>
          <Text className="text-sm text-muted">
            {isWorkSession ? 'Focus Time' : 'Rest Time'}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View className="gap-3 w-full">
        <Pressable
          onPress={toggleTimer}
          style={({ pressed }) => [
            {
              paddingVertical: 16,
              borderRadius: 12,
              backgroundColor: '#6366F1',
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text className="text-white font-bold text-lg">
            {isRunning ? '⏸️ Pause' : '▶️ Start'}
          </Text>
        </Pressable>

        <Pressable
          onPress={resetTimer}
          style={({ pressed }) => [
            {
              paddingVertical: 12,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: '#EC4899',
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text className="text-accent font-bold">🔄 Reset</Text>
        </Pressable>
      </View>

      {/* Settings */}
      <View className="gap-4 w-full mt-4">
        <View
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderColor: 'rgba(99, 102, 241, 0.3)',
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-bold text-foreground">Work Duration</Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setWorkDuration(Math.max(5, workDuration - 1))}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <Text className="text-xl">−</Text>
              </Pressable>
              <Text className="text-sm font-bold text-foreground w-8 text-center">
                {workDuration}m
              </Text>
              <Pressable
                onPress={() => setWorkDuration(Math.min(60, workDuration + 1))}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <Text className="text-xl">+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: 'rgba(236, 72, 153, 0.1)',
            borderColor: 'rgba(236, 72, 153, 0.3)',
          }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-foreground">Break Duration</Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setBreakDuration(Math.max(1, breakDuration - 1))}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <Text className="text-xl">−</Text>
              </Pressable>
              <Text className="text-sm font-bold text-foreground w-8 text-center">
                {breakDuration}m
              </Text>
              <Pressable
                onPress={() => setBreakDuration(Math.min(30, breakDuration + 1))}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <Text className="text-xl">+</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
