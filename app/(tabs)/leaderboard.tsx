import { Text, View, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

export default function LeaderboardScreen() {
  const students = [
    { rank: 1, name: 'Arjun', hours: 156, streak: 45 },
    { rank: 2, name: 'Priya', hours: 142, streak: 38 },
    { rank: 3, name: 'Rohan', hours: 128, streak: 32 },
    { rank: 4, name: 'You', hours: 98, streak: 15 },
    { rank: 5, name: 'Zara', hours: 87, streak: 12 },
  ];

  return (
    <ScreenContainer className="gap-4">
      <Text className="text-3xl font-black text-primary">Leaderboard</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {students.map(s => (
          <View key={s.rank} className="bg-surface rounded-2xl p-4 mb-3 border border-primary/30 flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center"><Text className="text-xl font-black text-primary">#{s.rank}</Text></View>
            <View className="flex-1">
              <Text className="font-black text-foreground">{s.name}</Text>
              <Text className="text-xs text-muted">{s.hours}h • {s.streak} day streak</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
