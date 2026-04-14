import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TimerSettings {
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  sessionsPerCycle: number;
  longBreakDuration: number; // in minutes
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface Session {
  id: string;
  type: 'work' | 'break';
  duration: number; // in seconds
  startTime: number;
  endTime?: number;
  completed: boolean;
}

export interface TimerContextType {
  settings: TimerSettings;
  updateSettings: (settings: Partial<TimerSettings>) => Promise<void>;
  sessions: Session[];
  addSession: (session: Session) => Promise<void>;
  getTodayStats: () => { totalFocusTime: number; sessionsCompleted: number; currentStreak: number };
}

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  breakDuration: 5,
  sessionsPerCycle: 4,
  longBreakDuration: 15,
  soundEnabled: true,
  notificationsEnabled: true,
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings and sessions from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedSettings, savedSessions] = await Promise.all([
          AsyncStorage.getItem('timerSettings'),
          AsyncStorage.getItem('sessions'),
        ]);

        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
        if (savedSessions) {
          setSessions(JSON.parse(savedSessions));
        }
      } catch (error) {
        console.error('Error loading timer data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const updateSettings = async (newSettings: Partial<TimerSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    try {
      await AsyncStorage.setItem('timerSettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving timer settings:', error);
    }
  };

  const addSession = async (session: Session) => {
    const updatedSessions = [...sessions, session];
    setSessions(updatedSessions);
    try {
      await AsyncStorage.setItem('sessions', JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const getTodayStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    const todaySessions = sessions.filter((s) => {
      const sessionDate = new Date(s.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === todayTime && s.type === 'work' && s.completed;
    });

    const totalFocusTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const sessionsCompleted = todaySessions.length;

    // Calculate streak (consecutive days with focus)
    let currentStreak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    while (true) {
      const checkTime = checkDate.getTime();
      const dayHasSessions = sessions.some((s) => {
        const sessionDate = new Date(s.startTime);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === checkTime && s.type === 'work' && s.completed;
      });

      if (dayHasSessions) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      totalFocusTime,
      sessionsCompleted,
      currentStreak,
    };
  };

  if (isLoading) {
    return null;
  }

  return (
    <TimerContext.Provider
      value={{
        settings,
        updateSettings,
        sessions,
        addSession,
        getTodayStats,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
