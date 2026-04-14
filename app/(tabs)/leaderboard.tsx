import { Text, View, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

export default function LeaderboardScreen() {
  const students = [
    { rank: 1, name: 'Arjun', hours: 156, streak: 45, avatar: '🥇' },
    { rank: 2, name: 'Priya', hours: 142, streak: 38, avatar: '🥈' },
    { rank: 3, name: 'Rohan', hours: 128, streak: 32, avatar: '🥉' },
    { rank: 4, name: 'You', hours: 98, streak: 15, avatar: '👤' },
    { rank: 5, name: 'Zara', hours: 87, streak: 12, avatar: '👤' },
  ];

  return (
    <ScreenContainer className="gap-4">
      <View className="gap-2 mb-2">
        <Text className="text-3xl font-bold text-foreground">Leaderboard</Text>
        <Text className="text-sm text-muted">Top focus champions</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {students.map((student) => (
          <View key={student.rank} className="flex-row items-center gap-3 p-4 rounded-2xl border mb-3" style={{backgroundColor: student.rank <= 3 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(30, 41, 59, 0.5)', borderColor: 'rgba(99, 102, 241, 0.3)'}}>
            <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center">
              <Text className="text-2xl">{student.avatar}</Text>
            </View>
            <View className="flex-1">
              <Text className="font-bold text-foreground">{student.name}</Text>
              <Text className="text-xs text-muted">{student.hours}h • {student.streak} day streak</Text>
            </View>
            <Text className="text-2xl font-bold text-primary">#{student.rank}</Text>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
