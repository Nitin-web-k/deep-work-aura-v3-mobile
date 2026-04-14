import { Text, View, ScrollView, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

export default function YouTubeScreen() {
  const videos = [
    { id: 1, title: 'Lofi Hip Hop - Study Mix', channel: 'Lofi Girl', views: '50M' },
    { id: 2, title: 'Deep Focus - Ambient Music', channel: 'Deep Focus', views: '30M' },
    { id: 3, title: 'Classical Music for Studying', channel: 'Classical Minds', views: '25M' },
  ];

  return (
    <ScreenContainer className="gap-4">
      <Text className="text-3xl font-black text-primary">YouTube</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {videos.map(video => (
          <Pressable key={video.id} style={({pressed}) => [{opacity: pressed ? 0.7 : 1}]}>
            <View className="bg-surface rounded-2xl p-4 mb-3 border border-primary/30 flex-row gap-3">
              <View className="w-16 h-16 rounded-lg bg-primary/20 items-center justify-center"><Text className="text-2xl">▶️</Text></View>
              <View className="flex-1">
                <Text className="font-black text-foreground text-sm">{video.title}</Text>
                <Text className="text-xs text-muted">{video.channel}</Text>
                <Text className="text-xs text-muted mt-1">{video.views} views</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
