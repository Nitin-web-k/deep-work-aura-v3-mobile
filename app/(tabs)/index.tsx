import { ScrollView, Text, View, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

export default function HomeScreen() {
  const stats = [
    { label: 'Focus Hours', value: '24.5h', icon: '⏱️' },
    { label: 'Streak', value: '12 days', icon: '🔥' },
    { label: 'Sessions', value: '48', icon: '✨' },
  ];

  const features = [
    { name: 'Timer', icon: '⏲️', desc: 'Focus Sessions' },
    { name: 'AI Chat', icon: '💬', desc: 'Ask Anything' },
    { name: 'YouTube', icon: '▶️', desc: 'Study Music' },
    { name: 'Leaderboard', icon: '🏆', desc: 'Rankings' },
  ];

  return (
    <ScreenContainer className="gap-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="gap-2 mb-6">
          <Text className="text-5xl font-bold text-foreground">Deep Work</Text>
          <Text className="text-lg text-muted">Master your focus, achieve your goals</Text>
        </View>

        {/* Stats Cards */}
        <View className="gap-3 mb-6">
          {stats.map((stat, idx) => (
            <Pressable
              key={idx}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View
                className="flex-row items-center gap-4 p-4 rounded-2xl border"
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  borderColor: 'rgba(99, 102, 241, 0.3)',
                }}
              >
                <View
                  className="w-14 h-14 rounded-xl items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  }}
                >
                  <Text className="text-2xl">{stat.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-muted">{stat.label}</Text>
                  <Text className="text-2xl font-bold text-foreground">{stat.value}</Text>
                </View>
                <Text className="text-2xl">→</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="gap-3 mb-6">
          <Text className="text-lg font-bold text-foreground">Quick Access</Text>
          <View className="gap-3">
            {features.map((feature, idx) => (
              <Pressable
                key={idx}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <View
                  className="flex-row items-center gap-4 p-4 rounded-2xl border"
                  style={{
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    borderColor: 'rgba(236, 72, 153, 0.3)',
                  }}
                >
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(236, 72, 153, 0.2)',
                    }}
                  >
                    <Text className="text-xl">{feature.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-foreground">{feature.name}</Text>
                    <Text className="text-xs text-muted">{feature.desc}</Text>
                  </View>
                  <Text className="text-lg text-primary">›</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Motivational Card */}
        <View
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            borderColor: 'rgba(99, 102, 241, 0.3)',
          }}
        >
          <Text className="text-2xl font-bold text-foreground mb-2">🎯 Today Goal</Text>
          <Text className="text-sm text-muted mb-4">Complete 3 focus sessions to stay on track</Text>
          <View className="h-2 bg-black/20 rounded-full overflow-hidden">
            <View className="h-full w-2/3 bg-primary rounded-full" />
          </View>
          <Text className="text-xs text-muted mt-2">2 of 3 completed</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
