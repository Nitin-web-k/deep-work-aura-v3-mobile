import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Platform, Text } from 'react-native';
import { useColors } from '@/hooks/use-colors';

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'web' ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen name="index" options={{title: 'Home', tabBarIcon: ({color}) => <IconSymbol size={28} name="house.fill" color={color} />}} />
      <Tabs.Screen name="timer" options={{title: 'Timer', tabBarIcon: () => <Text>⏲️</Text>}} />
      <Tabs.Screen name="chat" options={{title: 'Chat', tabBarIcon: () => <Text>💬</Text>}} />
      <Tabs.Screen name="youtube" options={{title: 'YouTube', tabBarIcon: () => <Text>▶️</Text>}} />
      <Tabs.Screen name="leaderboard" options={{title: 'Board', tabBarIcon: () => <Text>🏆</Text>}} />
    </Tabs>
  );
}
