import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  createdAt: number;
}

export interface MusicPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  playlists: Playlist[];
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  stopSong: () => void;
  seek: (time: number) => void;
  createPlaylist: (name: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, song: Song) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  loadPlaylists: () => Promise<void>;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const loadPlaylists = async () => {
    try {
      const saved = await AsyncStorage.getItem('musicPlaylists');
      if (saved) {
        setPlaylists(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  };

  const savePlaylists = async (newPlaylists: Playlist[]) => {
    try {
      await AsyncStorage.setItem('musicPlaylists', JSON.stringify(newPlaylists));
    } catch (error) {
      console.error('Error saving playlists:', error);
    }
  };

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const resumeSong = () => {
    if (currentSong) {
      setIsPlaying(true);
    }
  };

  const stopSong = () => {
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const seek = (time: number) => {
    setCurrentTime(time);
  };

  const createPlaylist = async (name: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      songs: [],
      createdAt: Date.now(),
    };

    const updated = [...playlists, newPlaylist];
    setPlaylists(updated);
    await savePlaylists(updated);
  };

  const addSongToPlaylist = async (playlistId: string, song: Song) => {
    const updated = playlists.map((p) =>
      p.id === playlistId ? { ...p, songs: [...p.songs, song] } : p
    );
    setPlaylists(updated);
    await savePlaylists(updated);
  };

  const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
    const updated = playlists.map((p) =>
      p.id === playlistId ? { ...p, songs: p.songs.filter((s) => s.id !== songId) } : p
    );
    setPlaylists(updated);
    await savePlaylists(updated);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        playlists,
        playSong,
        pauseSong,
        resumeSong,
        stopSong,
        seek,
        createPlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        loadPlaylists,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}
