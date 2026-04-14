import { ScrollView, Text, View, Pressable, TextInput, FlatList, Image, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useEffect } from 'react';
import { useYouTubePlayer, type YouTubeVideo } from '@/lib/youtube-player-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function YouTubeScreen() {
  const { currentVideo, isPlaying, volume, playVideo, pauseVideo, resumeVideo, stopVideo, setVolume } = useYouTubePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem('youtubeRecentSearches');
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    try {
      const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 10);
      setRecentSearches(updated);
      await AsyncStorage.setItem('youtubeRecentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    saveRecentSearch(query);

    // Mock YouTube search results
    const mockResults: YouTubeVideo[] = [
      {
        id: '1',
        title: `${query} - Study Session`,
        thumbnail: 'https://via.placeholder.com/120x90?text=Video+1',
        duration: 3600,
        url: `https://www.youtube.com/results?search_query=${query}`,
      },
      {
        id: '2',
        title: `${query} - Tutorial`,
        thumbnail: 'https://via.placeholder.com/120x90?text=Video+2',
        duration: 1800,
        url: `https://www.youtube.com/results?search_query=${query}`,
      },
      {
        id: '3',
        title: `${query} - Full Course`,
        thumbnail: 'https://via.placeholder.com/120x90?text=Video+3',
        duration: 7200,
        url: `https://www.youtube.com/results?search_query=${query}`,
      },
      {
        id: '4',
        title: `${query} - Explained`,
        thumbnail: 'https://via.placeholder.com/120x90?text=Video+4',
        duration: 900,
        url: `https://www.youtube.com/results?search_query=${query}`,
      },
    ];

    setVideos(mockResults);
    setIsSearching(false);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const renderVideoItem = ({ item }: { item: YouTubeVideo }) => {
    const isCurrentVideo = currentVideo?.id === item.id;

    return (
      <Pressable
        onPress={() => playVideo(item)}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View
          className={`flex-row gap-3 p-3 rounded-lg mb-2 ${
            isCurrentVideo ? 'bg-primary/20 border-2 border-primary' : 'bg-surface'
          }`}
        >
          {/* Thumbnail */}
          <View className="w-20 h-20 rounded-lg bg-background overflow-hidden relative">
            <Image
              source={{ uri: item.thumbnail }}
              className="w-full h-full"
              defaultSource={{ uri: 'https://via.placeholder.com/120x90?text=Video' }}
            />
            <View className="absolute bottom-1 right-1 bg-background/80 px-1 rounded">
              <Text className="text-xs font-bold text-foreground">{formatDuration(item.duration)}</Text>
            </View>
            {isCurrentVideo && (
              <View className="absolute inset-0 bg-black/40 items-center justify-center">
                <Text className="text-2xl">{isPlaying ? '▶️' : '⏸️'}</Text>
              </View>
            )}
          </View>

          {/* Video Info */}
          <View className="flex-1 justify-between">
            <View>
              <Text className="text-sm font-bold text-foreground line-clamp-2">{item.title}</Text>
              <Text className="text-xs text-muted mt-1">{formatDuration(item.duration)}</Text>
            </View>
            {isCurrentVideo && (
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => (isPlaying ? pauseVideo() : resumeVideo())}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <Text className="text-lg">{isPlaying ? '⏸️' : '▶️'}</Text>
                </Pressable>
                <Pressable onPress={stopVideo} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                  <Text className="text-lg">⏹️</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenContainer className="gap-4">
      {/* Header */}
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-foreground">YouTube</Text>
            <Text className="text-sm text-muted">Search and play videos</Text>
          </View>
          <View className="bg-primary rounded-full p-3">
            <Text className="text-xl">▶️</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row gap-2 items-center bg-surface rounded-xl px-3 py-2 border border-border">
          <Text className="text-xl">🔍</Text>
          <TextInput
            placeholder="Search videos..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            className="flex-1 text-foreground text-sm"
          />
          <Pressable
            onPress={() => handleSearch(searchQuery)}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className="text-lg">🔎</Text>
          </Pressable>
        </View>
      </View>

      {/* Current Playing */}
      {currentVideo && (
        <View className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl p-4 border border-primary">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-bold text-muted">NOW PLAYING</Text>
            <Pressable onPress={stopVideo} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <Text className="text-lg">✕</Text>
            </Pressable>
          </View>
          <Text className="text-sm font-bold text-foreground mb-2 line-clamp-2">{currentVideo.title}</Text>

          {/* Playback Controls */}
          <View className="flex-row items-center gap-2 mb-3">
            <Pressable
              onPress={() => (isPlaying ? pauseVideo() : resumeVideo())}
              style={({ pressed }) => [
                {
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: '#ADBB32',
                  alignItems: 'center',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-background font-bold">{isPlaying ? '⏸️ Pause' : '▶️ Play'}</Text>
            </Pressable>
            <Pressable
              onPress={stopVideo}
              style={({ pressed }) => [
                {
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#EF4444',
                  alignItems: 'center',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-error font-bold">Stop</Text>
            </Pressable>
          </View>

          {/* Volume Control */}
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-muted">🔊 Volume</Text>
              <Text className="text-xs text-muted">{Math.round(volume * 100)}%</Text>
            </View>
            <View className="h-1 bg-background rounded-full overflow-hidden">
              <Pressable
                onPress={(e) => {
                  const width = e.nativeEvent.locationX;
                  setVolume(Math.max(0, Math.min(1, width / 100)));
                }}
                className="flex-1 bg-primary"
                style={{ width: `${volume * 100}%` }}
              />
            </View>
          </View>
        </View>
      )}

      {/* Videos List */}
      {isSearching ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#ADBB32" size="large" />
          <Text className="text-muted text-sm mt-2">Searching videos...</Text>
        </View>
      ) : videos.length > 0 ? (
        <FlatList
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View className="mb-6">
              <Text className="text-sm font-bold text-foreground mb-3">Recent Searches</Text>
              <View className="flex-row flex-wrap gap-2">
                {recentSearches.map((search, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => handleSearch(search)}
                    style={({ pressed }) => [
                      {
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor: '#1a1a1a',
                        borderWidth: 1,
                        borderColor: '#ADBB32',
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <Text className="text-xs font-semibold text-primary">{search}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Suggested Videos */}
          <View>
            <Text className="text-sm font-bold text-foreground mb-3">Suggested for You</Text>
            {[
              { emoji: '📚', title: 'Study Sessions', desc: 'Focus music & ambient' },
              { emoji: '🎵', title: 'Lo-fi Beats', desc: 'Relaxing background music' },
              { emoji: '🧠', title: 'Brain Boost', desc: 'Concentration enhancers' },
              { emoji: '🎓', title: 'Tutorials', desc: 'Learn new skills' },
            ].map((item, idx) => (
              <Pressable
                key={idx}
                onPress={() => handleSearch(item.title)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="flex-row items-center gap-3 p-3 bg-surface rounded-lg mb-2">
                  <Text className="text-2xl">{item.emoji}</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-foreground">{item.title}</Text>
                    <Text className="text-xs text-muted">{item.desc}</Text>
                  </View>
                  <Text className="text-lg">→</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
