import { ScrollView, Text, View, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useTimer } from '@/lib/timer-context';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { getTodayStats, settings } = useTimer();
  const router = useRouter();
  const stats = getTodayStats();

  const handleStartSession = () => {
    router.push('./(tabs)/timer');
  };

  const formatSeconds = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-8">
          {/* Header */}
          <View>
            <Text className="text-4xl font-bold text-foreground">Deep Work Aura</Text>
            <Text className="text-base text-muted mt-2">Stay focused, build momentum</Text>
          </View>

          {/* Quick Start Card */}
          <Pressable
            onPress={handleStartSession}
            style={({ pressed }) => [
              {
                backgroundColor: '#0a7ea4',
                borderRadius: 16,
                padding: 24,
                alignItems: 'center',
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-sm font-semibold text-white opacity-80 mb-2">Ready to focus?</Text>
            <Text className="text-3xl font-bold text-white">{settings.workDuration} min</Text>
            <Text className="text-sm text-white opacity-80 mt-2">Focus Session</Text>
          </Pressable>

          {/* Today's Stats */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Today's Progress</Text>

            <View className="flex-row gap-3">
              {/* Focus Time Card */}
              <View className="flex-1 bg-surface rounded-xl p-4">
                <Text className="text-xs text-muted mb-2">Total Focus Time</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {formatSeconds(stats.totalFocusTime)}
                </Text>
              </View>

              {/* Sessions Card */}
              <View className="flex-1 bg-surface rounded-xl p-4">
                <Text className="text-xs text-muted mb-2">Sessions</Text>
                <Text className="text-2xl font-bold text-foreground">{stats.sessionsCompleted}</Text>
              </View>
            </View>

            {/* Streak Card */}
            <View className="bg-orange-50 dark:bg-orange-900 rounded-xl p-4 flex-row items-center gap-3">
              <Text className="text-3xl">🔥</Text>
              <View>
                <Text className="text-xs text-orange-700 dark:text-orange-200">Current Streak</Text>
                <Text className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {stats.currentStreak} days
                </Text>
              </View>
            </View>
          </View>

          {/* Settings Info */}
          <View className="bg-surface rounded-xl p-4">
            <Text className="text-sm font-semibold text-foreground mb-3">Your Settings</Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Work Duration</Text>
                <Text className="text-sm font-semibold text-foreground">{settings.workDuration} min</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Break Duration</Text>
                <Text className="text-sm font-semibold text-foreground">{settings.breakDuration} min</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Sessions Per Cycle</Text>
                <Text className="text-sm font-semibold text-foreground">{settings.sessionsPerCycle}</Text>
              </View>
            </View>
          </View>

          {/* CTA */}
          <Pressable
            onPress={() => router.push('./(tabs)/settings')}
            style={({ pressed }) => [
              {
                borderWidth: 2,
                borderColor: '#0a7ea4',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-base font-semibold text-primary">Customize Settings</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
