import { ScrollView, Text, View, Pressable, Dimensions } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useTimer } from '@/lib/timer-context';
import { useTimerCountdown } from '@/hooks/use-timer-countdown';
import { useEffect, useState } from 'react';
import { Svg, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = Math.min(width - 60, 280);
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;
const STROKE_WIDTH = 8;

export default function TimerScreen() {
  const { settings, addSession } = useTimer();
  const { state, startTimer, pauseTimer, resumeTimer, stopTimer, formatTime, getProgress } =
    useTimerCountdown(settings.workDuration, settings.breakDuration);

  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  const handleStart = async () => {
    setSessionStartTime(Date.now());
    startTimer(async () => {
      if (settings.soundEnabled) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    });
  };

  const handleStop = async () => {
    stopTimer();
    if (sessionStartTime && state.phase === 'work') {
      await addSession({
        id: `${Date.now()}`,
        type: 'work',
        duration: state.totalTime - state.timeRemaining,
        startTime: sessionStartTime,
        completed: state.timeRemaining === 0,
      });
    }
    setSessionStartTime(null);
  };

  const progress = getProgress();
  const circumference = 2 * Math.PI * (CIRCLE_RADIUS - STROKE_WIDTH / 2);
  const strokeDashoffset = circumference * (1 - progress);

  const phaseColor = state.phase === 'work' ? '#0a7ea4' : '#22C55E';
  const phaseLabel = state.phase === 'work' ? 'Focus Time' : 'Break Time';

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
        <View className="items-center gap-8">
          {/* Timer Display */}
          <View className="items-center gap-4">
            <Text className="text-lg font-semibold text-muted">{phaseLabel}</Text>

            {/* Circular Progress */}
            <View className="items-center justify-center" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
              <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
                {/* Background circle */}
                <Circle
                  cx={CIRCLE_RADIUS}
                  cy={CIRCLE_RADIUS}
                  r={CIRCLE_RADIUS - STROKE_WIDTH / 2}
                  stroke="#e5e7eb"
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                />
                {/* Progress circle */}
                <Circle
                  cx={CIRCLE_RADIUS}
                  cy={CIRCLE_RADIUS}
                  r={CIRCLE_RADIUS - STROKE_WIDTH / 2}
                  stroke={phaseColor}
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation={-90}
                  origin={`${CIRCLE_RADIUS},${CIRCLE_RADIUS}`}
                />
              </Svg>

              {/* Time display */}
              <View className="absolute items-center justify-center">
                <Text className="text-6xl font-bold text-foreground" style={{ fontFamily: 'Courier New' }}>
                  {formatTime(state.timeRemaining)}
                </Text>
              </View>
            </View>

            {/* Cycle counter */}
            <Text className="text-sm text-muted">
              Cycle {state.cycleCount} • {state.phase === 'work' ? 'Focus' : 'Rest'}
            </Text>
          </View>

          {/* Controls */}
          <View className="w-full gap-3">
            {state.phase === 'idle' ? (
              <Pressable
                onPress={handleStart}
                style={({ pressed }) => [
                  {
                    backgroundColor: phaseColor,
                    paddingVertical: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="text-lg font-semibold text-white">Start Focus Session</Text>
              </Pressable>
            ) : state.isRunning ? (
              <View className="flex-row gap-3">
                <Pressable
                  onPress={pauseTimer}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      backgroundColor: '#f59e0b',
                      paddingVertical: 16,
                      borderRadius: 12,
                      alignItems: 'center',
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text className="text-base font-semibold text-white">Pause</Text>
                </Pressable>
                <Pressable
                  onPress={handleStop}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      backgroundColor: '#ef4444',
                      paddingVertical: 16,
                      borderRadius: 12,
                      alignItems: 'center',
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text className="text-base font-semibold text-white">Stop</Text>
                </Pressable>
              </View>
            ) : (
              <View className="flex-row gap-3">
                <Pressable
                  onPress={resumeTimer}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      backgroundColor: phaseColor,
                      paddingVertical: 16,
                      borderRadius: 12,
                      alignItems: 'center',
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text className="text-base font-semibold text-white">Resume</Text>
                </Pressable>
                <Pressable
                  onPress={handleStop}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      backgroundColor: '#ef4444',
                      paddingVertical: 16,
                      borderRadius: 12,
                      alignItems: 'center',
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text className="text-base font-semibold text-white">Stop</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Quick info */}
          <View className="w-full bg-surface rounded-xl p-4">
            <Text className="text-sm text-muted mb-2">Session Info</Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-xs text-muted">Work Duration</Text>
                <Text className="text-lg font-semibold text-foreground">{settings.workDuration} min</Text>
              </View>
              <View>
                <Text className="text-xs text-muted">Break Duration</Text>
                <Text className="text-lg font-semibold text-foreground">{settings.breakDuration} min</Text>
              </View>
              <View>
                <Text className="text-xs text-muted">Cycles</Text>
                <Text className="text-lg font-semibold text-foreground">{settings.sessionsPerCycle}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
