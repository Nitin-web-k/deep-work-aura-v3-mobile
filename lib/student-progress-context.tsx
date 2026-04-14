import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StudentStats {
  totalHours: number;
  totalDays: number;
  currentStreak: number;
  averageSessionLength: number;
  sessionsCompleted: number;
  lastSessionDate: number;
}

export interface DailyProgress {
  date: string;
  hoursStudied: number;
  sessionsCompleted: number;
}

export interface StudentProgressContextType {
  studentName: string;
  stats: StudentStats;
  dailyProgress: DailyProgress[];
  setStudentName: (name: string) => Promise<void>;
  addStudySession: (hours: number) => Promise<void>;
  getStats: () => StudentStats;
  getDailyProgress: () => DailyProgress[];
  loadProgress: () => Promise<void>;
}

const StudentProgressContext = createContext<StudentProgressContextType | undefined>(undefined);

export function StudentProgressProvider({ children }: { children: React.ReactNode }) {
  const [studentName, setStudentNameState] = useState('Student');
  const [stats, setStats] = useState<StudentStats>({
    totalHours: 0,
    totalDays: 0,
    currentStreak: 0,
    averageSessionLength: 0,
    sessionsCompleted: 0,
    lastSessionDate: 0,
  });
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);

  const loadProgress = async () => {
    try {
      const savedName = await AsyncStorage.getItem('studentName');
      const savedStats = await AsyncStorage.getItem('studentStats');
      const savedDaily = await AsyncStorage.getItem('dailyProgress');

      if (savedName) setStudentNameState(savedName);
      if (savedStats) setStats(JSON.parse(savedStats));
      if (savedDaily) setDailyProgress(JSON.parse(savedDaily));
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const setStudentName = async (name: string) => {
    setStudentNameState(name);
    try {
      await AsyncStorage.setItem('studentName', name);
    } catch (error) {
      console.error('Error saving student name:', error);
    }
  };

  const addStudySession = async (hours: number) => {
    const today = new Date().toISOString().split('T')[0];
    const todayTime = new Date(today).getTime();

    // Update daily progress
    const existingDaily = dailyProgress.find((d) => d.date === today);
    let newDaily: DailyProgress[];

    if (existingDaily) {
      newDaily = dailyProgress.map((d) =>
        d.date === today ? { ...d, hoursStudied: d.hoursStudied + hours, sessionsCompleted: d.sessionsCompleted + 1 } : d
      );
    } else {
      newDaily = [...dailyProgress, { date: today, hoursStudied: hours, sessionsCompleted: 1 }];
    }

    setDailyProgress(newDaily);

    // Update stats
    const newStats: StudentStats = {
      ...stats,
      totalHours: stats.totalHours + hours,
      totalDays: newDaily.length,
      sessionsCompleted: stats.sessionsCompleted + 1,
      averageSessionLength: (stats.totalHours + hours) / (stats.sessionsCompleted + 1),
      lastSessionDate: todayTime,
      currentStreak: calculateStreak(newDaily),
    };

    setStats(newStats);

    try {
      await AsyncStorage.setItem('studentStats', JSON.stringify(newStats));
      await AsyncStorage.setItem('dailyProgress', JSON.stringify(newDaily));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const calculateStreak = (daily: DailyProgress[]): number => {
    if (daily.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      if (daily.some((d) => d.date === dateStr)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const getStats = () => stats;

  const getDailyProgress = () => dailyProgress;

  return (
    <StudentProgressContext.Provider
      value={{
        studentName,
        stats,
        dailyProgress,
        setStudentName,
        addStudySession,
        getStats,
        getDailyProgress,
        loadProgress,
      }}
    >
      {children}
    </StudentProgressContext.Provider>
  );
}

export function useStudentProgress() {
  const context = useContext(StudentProgressContext);
  if (!context) {
    throw new Error('useStudentProgress must be used within a StudentProgressProvider');
  }
  return context;
}
