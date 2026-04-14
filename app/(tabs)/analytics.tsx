import { ScrollView, Text, View, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useStudentProgress } from '@/lib/student-progress-context';
import { useGoals } from '@/lib/goals-context';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AnalyticsScreen() {
  const { studentName, stats, dailyProgress, loadProgress } = useStudentProgress();
  const { goals, getActiveGoals, loadGoals, calculateGoalCompletion } = useGoals();
  const router = useRouter();

  useEffect(() => {
    loadProgress();
    loadGoals();
  }, []);

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getLastSevenDays = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const progress = dailyProgress.find((d) => d.date === dateStr);
      days.push({
        date: dateStr,
        hours: progress?.hoursStudied || 0,
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
      });
    }
    return days;
  };

  const lastSevenDays = getLastSevenDays();
  const maxHours = Math.max(...lastSevenDays.map((d) => d.hours), 1);
  const activeGoals = getActiveGoals();

  return (
    <ScreenContainer className="p-4 gap-4">
      {/* Header */}
      <View className="gap-2">
        <Text className="text-3xl font-bold text-foreground">Analytics</Text>
        <Text className="text-sm text-muted">Student: {studentName}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Stats Cards */}
        <View className="gap-3 mb-4">
          {/* Row 1 */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-xl p-4">
              <Text className="text-xs text-muted mb-2">Total Hours</Text>
              <Text className="text-2xl font-bold text-primary">{formatHours(stats.totalHours)}</Text>
            </View>

            <View className="flex-1 bg-surface rounded-xl p-4">
              <Text className="text-xs text-muted mb-2">Total Days</Text>
              <Text className="text-2xl font-bold text-primary">{stats.totalDays}</Text>
            </View>
          </View>

          {/* Row 2 */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-xl p-4">
              <Text className="text-xs text-muted mb-2">Current Streak</Text>
              <Text className="text-2xl font-bold text-primary">{stats.currentStreak} 🔥</Text>
            </View>

            <View className="flex-1 bg-surface rounded-xl p-4">
              <Text className="text-xs text-muted mb-2">Sessions</Text>
              <Text className="text-2xl font-bold text-primary">{stats.sessionsCompleted}</Text>
            </View>
          </View>

          {/* Average */}
          <View className="bg-surface rounded-xl p-4">
            <Text className="text-xs text-muted mb-2">Average Session Length</Text>
            <Text className="text-2xl font-bold text-primary">
              {formatHours(stats.averageSessionLength)}
            </Text>
          </View>
        </View>

        {/* Active Goals Section */}
        {activeGoals.length > 0 && (
          <View className="gap-3 mb-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">Active Goals</Text>
              <Pressable
                onPress={() => router.push('./(tabs)/goals')}
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <Text className="text-sm text-primary font-semibold">Manage →</Text>
              </Pressable>
            </View>

            {activeGoals.slice(0, 3).map((goal) => {
              const completion = calculateGoalCompletion(goal.id);
              return (
                <View key={goal.id} className="bg-surface rounded-xl p-3 gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-foreground flex-1">{goal.title}</Text>
                    <Text className="text-xs text-muted capitalize">{goal.frequency}</Text>
                  </View>

                  <View className="gap-1">
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">
                        {goal.currentProgress.toFixed(1)}h / {goal.targetHours}h
                      </Text>
                      <Text className="text-xs font-semibold text-primary">{completion.toFixed(0)}%</Text>
                    </View>

                    <View className="h-1.5 bg-background rounded-full overflow-hidden">
                      <View
                        className="h-full bg-primary"
                        style={{
                          width: `${Math.min(100, completion)}%`,
                        }}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Weekly Chart */}
        <View className="bg-surface rounded-xl p-4 gap-3 mb-4">
          <Text className="text-sm font-semibold text-foreground">Last 7 Days</Text>

          <View className="flex-row items-end justify-between h-32 gap-2">
            {lastSevenDays.map((day, idx) => (
              <View key={idx} className="flex-1 items-center gap-1">
                <View className="w-full bg-background rounded-t-lg overflow-hidden">
                  <View
                    className="w-full bg-primary"
                    style={{
                      height: maxHours > 0 ? (day.hours / maxHours) * 100 : 0,
                    }}
                  />
                </View>
                <Text className="text-xs text-muted">{day.day}</Text>
                <Text className="text-xs text-foreground font-semibold">{day.hours.toFixed(1)}h</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Leaderboard */}
        <View className="bg-surface rounded-xl p-4 gap-3">
          <Text className="text-sm font-semibold text-foreground">Leaderboard</Text>

          <View className="gap-2">
            <View className="flex-row items-center justify-between py-2 px-2 bg-background rounded-lg">
              <View className="flex-row items-center gap-2 flex-1">
                <Text className="text-lg font-bold text-primary">🥇</Text>
                <View>
                  <Text className="text-sm font-semibold text-foreground">{studentName}</Text>
                  <Text className="text-xs text-muted">You</Text>
                </View>
              </View>
              <Text className="text-sm font-bold text-primary">{formatHours(stats.totalHours)}</Text>
            </View>

            <View className="flex-row items-center justify-between py-2 px-2 bg-background rounded-lg opacity-50">
              <View className="flex-row items-center gap-2 flex-1">
                <Text className="text-lg font-bold text-muted">🥈</Text>
                <View>
                  <Text className="text-sm font-semibold text-foreground">Alex</Text>
                  <Text className="text-xs text-muted">Friend</Text>
                </View>
              </View>
              <Text className="text-sm font-bold text-muted">45h 30m</Text>
            </View>

            <View className="flex-row items-center justify-between py-2 px-2 bg-background rounded-lg opacity-50">
              <View className="flex-row items-center gap-2 flex-1">
                <Text className="text-lg font-bold text-muted">🥉</Text>
                <View>
                  <Text className="text-sm font-semibold text-foreground">Jordan</Text>
                  <Text className="text-xs text-muted">Friend</Text>
                </View>
              </View>
              <Text className="text-sm font-bold text-muted">42h 15m</Text>
            </View>
          </View>
        </View>

        {/* Goals CTA */}
        {activeGoals.length === 0 && (
          <Pressable
            onPress={() => router.push('./(tabs)/goals')}
            style={({ pressed }) => [
              {
                backgroundColor: '#ADBB32',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
                marginTop: 8,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-background font-bold">Create Your First Goal</Text>
          </Pressable>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
