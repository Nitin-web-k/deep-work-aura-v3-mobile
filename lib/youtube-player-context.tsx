import React, { createContext, useContext, useState } from 'react';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  url: string;
}

export interface YouTubePlayerContextType {
  currentVideo: YouTubeVideo | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  setCurrentVideo: (video: YouTubeVideo | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  playVideo: (video: YouTubeVideo) => void;
  pauseVideo: () => void;
  resumeVideo: () => void;
  stopVideo: () => void;
}

const YouTubePlayerContext = createContext<YouTubePlayerContextType | undefined>(undefined);

export function YouTubePlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);

  const playVideo = (video: YouTubeVideo) => {
    setCurrentVideo(video);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const pauseVideo = () => {
    setIsPlaying(false);
  };

  const resumeVideo = () => {
    if (currentVideo) {
      setIsPlaying(true);
    }
  };

  const stopVideo = () => {
    setCurrentVideo(null);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <YouTubePlayerContext.Provider
      value={{
        currentVideo,
        isPlaying,
        volume,
        currentTime,
        setCurrentVideo,
        setIsPlaying,
        setVolume,
        setCurrentTime,
        playVideo,
        pauseVideo,
        resumeVideo,
        stopVideo,
      }}
    >
      {children}
    </YouTubePlayerContext.Provider>
  );
}

export function useYouTubePlayer() {
  const context = useContext(YouTubePlayerContext);
  if (!context) {
    throw new Error('useYouTubePlayer must be used within a YouTubePlayerProvider');
  }
  return context;
}
