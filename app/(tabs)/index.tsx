import { ScrollView, Text, View, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScreenContainer className="gap-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-5xl font-black text-primary mb-2">Deep Work</Text>
        <Text className="text-base text-muted mb-8">Master your focus, achieve your goals</Text>

        <View className="gap-4 mb-8">
          <View className="bg-surface rounded-3xl p-6 border border-primary/30">
            <Text className="text-sm text-muted mb-2">FOCUS HOURS</Text>
            <Text className="text-4xl font-black text-primary">24.5h</Text>
          </View>

          <View className="bg-surface rounded-3xl p-6 border border-primary/30">
            <Text className="text-sm text-muted mb-2">CURRENT STREAK</Text>
            <Text className="text-4xl font-black text-primary">12 days 🔥</Text>
          </View>

          <View className="bg-surface rounded-3xl p-6 border border-primary/30">
            <Text className="text-sm text-muted mb-2">SESSIONS COMPLETED</Text>
            <Text className="text-4xl font-black text-primary">48</Text>
          </View>
        </View>

        <Text className="text-lg font-black text-foreground mb-4">QUICK START</Text>

        <View className="gap-3">
          <Pressable onPress={() => router.push('./timer')} style={({pressed}) => [{opacity: pressed ? 0.7 : 1}]}>
            <View className="bg-primary rounded-2xl p-4 flex-row items-center justify-between">
              <View>
                <Text className="text-white font-black text-lg">⏲️ Start Timer</Text>
                <Text className="text-white/80 text-xs mt-1">Begin focus session</Text>
              </View>
              <Text className="text-2xl">→</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => router.push('./chat')} style={({pressed}) => [{opacity: pressed ? 0.7 : 1}]}>
            <View className="bg-surface rounded-2xl p-4 flex-row items-center justify-between border border-primary/30">
              <View>
                <Text className="text-foreground font-black text-lg">💬 AI Chat</Text>
                <Text className="text-muted text-xs mt-1">Ask any question</Text>
              </View>
              <Text className="text-2xl">→</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => router.push('./youtube')} style={({pressed}) => [{opacity: pressed ? 0.7 : 1}]}>
            <View className="bg-surface rounded-2xl p-4 flex-row items-center justify-between border border-primary/30">
              <View>
                <Text className="text-foreground font-black text-lg">▶️ YouTube</Text>
                <Text className="text-muted text-xs mt-1">Study music & videos</Text>
              </View>
              <Text className="text-2xl">→</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => router.push('./leaderboard')} style={({pressed}) => [{opacity: pressed ? 0.7 : 1}]}>
            <View className="bg-surface rounded-2xl p-4 flex-row items-center justify-between border border-primary/30">
              <View>
                <Text className="text-foreground font-black text-lg">🏆 Leaderboard</Text>
                <Text className="text-muted text-xs mt-1">See rankings</Text>
              </View>
              <Text className="text-2xl">→</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
