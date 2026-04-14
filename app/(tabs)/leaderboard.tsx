import { ScrollView, Text, View, Pressable, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  focusHours: number;
  streak: number;
  points: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe]);

  const loadLeaderboard = async () => {
    try {
      // Mock data - in production, this would come from backend
      const mockData: LeaderboardEntry[] = [
        {
          id: '1',
          rank: 1,
          name: 'Arjun Kumar',
          avatar: '🥇',
          focusHours: 156,
          streak: 45,
          points: 4680,
        },
        {
          id: '2',
          rank: 2,
          name: 'Priya Singh',
          avatar: '🥈',
          focusHours: 142,
          streak: 38,
          points: 4260,
        },
        {
          id: '3',
          rank: 3,
          name: 'Rahul Patel',
          avatar: '🥉',
          focusHours: 138,
          streak: 35,
          points: 4140,
        },
        {
          id: '4',
          rank: 4,
          name: 'Neha Sharma',
          avatar: '👤',
          focusHours: 125,
          streak: 30,
          points: 3750,
        },
        {
          id: '5',
          rank: 5,
          name: 'Vikram Reddy',
          avatar: '👤',
          focusHours: 118,
          streak: 28,
          points: 3540,
        },
        {
          id: '6',
          rank: 6,
          name: 'You',
          avatar: '👨‍🎓',
          focusHours: 95,
          streak: 18,
          points: 2850,
          isCurrentUser: true,
        },
        {
          id: '7',
          rank: 7,
          name: 'Aisha Khan',
          avatar: '👤',
          focusHours: 88,
          streak: 15,
          points: 2640,
        },
        {
          id: '8',
          rank: 8,
          name: 'Rohan Gupta',
          avatar: '👤',
          focusHours: 75,
          streak: 12,
          points: 2250,
        },
      ];

      setLeaderboard(mockData);
      const current = mockData.find((e) => e.isCurrentUser);
      if (current) setCurrentUserRank(current);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const timeframeOptions = [
    { label: 'This Week', value: 'weekly' as const },
    { label: 'This Month', value: 'monthly' as const },
    { label: 'All Time', value: 'alltime' as const },
  ];

  const renderLeaderboardItem = ({ item }: { item: LeaderboardEntry }) => {
    const isTop3 = item.rank <= 3;
    const isCurrentUser = item.isCurrentUser;

    return (
      <View
        className={`flex-row items-center gap-3 p-4 rounded-xl mb-2 ${
          isCurrentUser
            ? 'bg-primary/20 border-2 border-primary'
            : isTop3
              ? 'bg-surface border border-primary'
              : 'bg-surface'
        }`}
      >
        {/* Rank */}
        <View
          className={`w-12 h-12 rounded-full items-center justify-center ${
            isTop3 ? 'bg-primary' : 'bg-background'
          }`}
        >
          <Text className={`text-lg font-bold ${isTop3 ? 'text-background' : 'text-foreground'}`}>
            {item.rank}
          </Text>
        </View>

        {/* User Info */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-2xl">{item.avatar}</Text>
            <Text className="text-sm font-bold text-foreground flex-1">{item.name}</Text>
            {item.streak > 0 && (
              <View className="flex-row items-center gap-1 bg-warning/20 px-2 py-1 rounded-full">
                <Text className="text-xs">🔥</Text>
                <Text className="text-xs font-bold text-warning">{item.streak}</Text>
              </View>
            )}
          </View>
          <View className="flex-row gap-3">
            <View>
              <Text className="text-xs text-muted">Focus Hours</Text>
              <Text className="text-sm font-bold text-foreground">{item.focusHours}h</Text>
            </View>
            <View>
              <Text className="text-xs text-muted">Points</Text>
              <Text className="text-sm font-bold text-primary">{item.points}</Text>
            </View>
          </View>
        </View>

        {/* Rank Badge */}
        {isTop3 && (
          <View className="items-center">
            <Text className="text-2xl">
              {item.rank === 1 ? '🏆' : item.rank === 2 ? '🥈' : '🥉'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenContainer className="gap-4">
      {/* Header */}
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-foreground">Leaderboard</Text>
            <Text className="text-sm text-muted">See who's leading the focus race</Text>
          </View>
          <View className="bg-primary rounded-full p-3">
            <Text className="text-xl">🏆</Text>
          </View>
        </View>

        {/* Timeframe Selector */}
        <View className="flex-row gap-2">
          {timeframeOptions.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => setTimeframe(opt.value)}
              style={({ pressed }) => [
                {
                  flex: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: timeframe === opt.value ? '#ADBB32' : '#1a1a1a',
                  borderWidth: timeframe === opt.value ? 0 : 1,
                  borderColor: '#ADBB32',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                className={`text-xs font-bold text-center ${
                  timeframe === opt.value ? 'text-background' : 'text-primary'
                }`}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Current User Position */}
      {currentUserRank && (
        <View className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl p-4 border border-primary">
          <Text className="text-xs text-muted mb-2">YOUR POSITION</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                <Text className="text-lg font-bold text-background">#{currentUserRank.rank}</Text>
              </View>
              <View>
                <Text className="text-sm font-bold text-foreground">{currentUserRank.name}</Text>
                <Text className="text-xs text-muted">{currentUserRank.points} points</Text>
              </View>
            </View>
            <View className="items-center">
              <Text className="text-2xl">👨‍🎓</Text>
              <Text className="text-xs text-muted mt-1">Keep going!</Text>
            </View>
          </View>
        </View>
      )}

      {/* Leaderboard List */}
      <FlatList
        data={leaderboard}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        className="gap-2"
      />

      {/* Achievements Section */}
      <View className="bg-surface rounded-xl p-4 border border-border mt-2">
        <Text className="text-sm font-bold text-foreground mb-3">🎖️ Achievements</Text>
        <View className="flex-row gap-2 flex-wrap">
          {[
            { icon: '🔥', label: 'On Fire', desc: '7-day streak' },
            { icon: '⚡', label: 'Speed Demon', desc: '50+ hours' },
            { icon: '🎯', label: 'Goal Crusher', desc: 'All goals met' },
            { icon: '🌟', label: 'Rising Star', desc: 'Top 10' },
          ].map((achievement, idx) => (
            <View key={idx} className="flex-1 bg-background rounded-lg p-2 items-center">
              <Text className="text-2xl mb-1">{achievement.icon}</Text>
              <Text className="text-xs font-bold text-foreground text-center">{achievement.label}</Text>
              <Text className="text-xs text-muted text-center">{achievement.desc}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}
