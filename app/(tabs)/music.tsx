import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useMusicPlayer } from '@/lib/music-player-context';
import { useEffect, useState } from 'react';

export default function MusicPlayerScreen() {
  const { currentSong, isPlaying, currentTime, playSong, pauseSong, resumeSong, stopSong, seek } =
    useMusicPlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Call backend to search YouTube
      const response = await fetch('/api/music/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScreenContainer className="p-4 gap-4">
      {/* Header */}
      <View className="gap-2 mb-2">
        <Text className="text-3xl font-bold text-foreground">Music Player</Text>
        <Text className="text-sm text-muted">Play music while you focus</Text>
      </View>

      {/* Now Playing */}
      {currentSong && (
        <View className="bg-surface rounded-xl p-4 gap-3">
          <Text className="text-lg font-semibold text-primary">Now Playing</Text>
          <View className="gap-1">
            <Text className="text-base font-semibold text-foreground">{currentSong.title}</Text>
            <Text className="text-sm text-muted">{currentSong.artist}</Text>
          </View>

          {/* Progress Bar */}
          <View className="gap-2">
            <View className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary"
                style={{
                  width: `${(currentTime / currentSong.duration) * 100}%`,
                }}
              />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-muted">{formatTime(currentTime)}</Text>
              <Text className="text-xs text-muted">{formatTime(currentSong.duration)}</Text>
            </View>
          </View>

          {/* Controls */}
          <View className="flex-row justify-center gap-4">
            <Pressable
              onPress={stopSong}
              style={({ pressed }) => [
                {
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#333333',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-foreground text-xl">⏹</Text>
            </Pressable>

            <Pressable
              onPress={isPlaying ? pauseSong : resumeSong}
              style={({ pressed }) => [
                {
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: '#ADBB32',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-background text-2xl">{isPlaying ? '⏸' : '▶'}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                {
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#333333',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-foreground text-xl">⏭</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Search */}
      <View className="bg-surface rounded-xl p-3 gap-2">
        <Text className="text-sm font-semibold text-foreground">Search YouTube</Text>
        <View className="flex-row gap-2">
          <TextInput
            placeholder="Search songs, artists..."
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 bg-background text-foreground rounded-lg p-3 text-sm"
          />
          <Pressable
            onPress={handleSearch}
            disabled={isSearching}
            style={({ pressed }) => [
              {
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: '#ADBB32',
                alignItems: 'center',
                opacity: isSearching ? 0.5 : pressed ? 0.8 : 1,
              },
            ]}
          >
            {isSearching ? (
              <ActivityIndicator color="#0f0f0f" size="small" />
            ) : (
              <Text className="text-background font-semibold">🔍</Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* Search Results */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-2">
          {searchResults.length === 0 ? (
            <Text className="text-center text-muted text-sm py-4">
              {isSearching ? 'Searching...' : 'Search for songs to play'}
            </Text>
          ) : (
            searchResults.map((song: any) => (
              <Pressable
                key={song.id}
                onPress={() => playSong(song)}
                style={({ pressed }) => [
                  {
                    backgroundColor: '#1a1a1a',
                    borderRadius: 8,
                    padding: 12,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="font-semibold text-foreground text-sm">{song.title}</Text>
                <Text className="text-xs text-muted mt-1">{song.artist}</Text>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
