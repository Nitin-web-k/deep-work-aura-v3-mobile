import { Text, View, Pressable, TextInput, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';

export default function YouTubeScreen() {
  const [search, setSearch] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const videos = [
    { id: '1', title: 'Lofi Hip Hop - Study Mix', channel: 'Lofi Girl', views: '50M' },
    { id: '2', title: 'Deep Focus - Ambient Music', channel: 'Deep Focus', views: '30M' },
    { id: '3', title: 'Classical Music for Studying', channel: 'Classical Minds', views: '25M' },
  ];

  return (
    <ScreenContainer className="gap-4">
      <View className="gap-2 mb-2">
        <Text className="text-3xl font-bold text-foreground">YouTube</Text>
        <Text className="text-sm text-muted">Study music & videos</Text>
      </View>

      <View className="flex-row gap-2 items-center p-3 rounded-2xl border" style={{backgroundColor: 'rgba(30, 41, 59, 0.5)', borderColor: 'rgba(99, 102, 241, 0.3)'}}>
        <TextInput placeholder="Search videos..." placeholderTextColor="#666" value={search} onChangeText={setSearch} className="flex-1 text-foreground text-sm" />
        <Pressable><Text className="text-lg">🔍</Text></Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {videos.map((video) => (
          <Pressable key={video.id} onPress={() => setIsPlaying(!isPlaying)} style={({pressed}) => [{opacity: pressed ? 0.8 : 1}]}>
            <View className="p-4 rounded-2xl border mb-3" style={{backgroundColor: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.3)'}}>
              <View className="flex-row gap-3">
                <View className="w-16 h-16 rounded-lg bg-primary/20 items-center justify-center"><Text className="text-2xl">▶️</Text></View>
                <View className="flex-1">
                  <Text className="font-bold text-foreground text-sm">{video.title}</Text>
                  <Text className="text-xs text-muted">{video.channel}</Text>
                  <Text className="text-xs text-muted mt-1">{video.views} views</Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
