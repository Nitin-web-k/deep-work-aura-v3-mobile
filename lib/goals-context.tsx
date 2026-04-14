import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type GoalFrequency = 'daily' | 'weekly' | 'monthly';
export type GoalStatus = 'active' | 'completed' | 'abandoned';

export interface StudyGoal {
  id: string;
  title: string;
  targetHours: number;
  frequency: GoalFrequency;
  status: GoalStatus;
  createdAt: number;
  completedAt?: number;
  currentProgress: number;
  lastUpdated: number;
}

export interface GoalProgress {
  goalId: string;
  date: string;
  hoursAchieved: number;
  percentage: number;
}

export interface GoalsContextType {
  goals: StudyGoal[];
  goalProgress: GoalProgress[];
  createGoal: (title: string, targetHours: number, frequency: GoalFrequency) => Promise<void>;
  updateGoalProgress: (goalId: string, hoursAchieved: number) => Promise<void>;
  completeGoal: (goalId: string) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  getGoalProgress: (goalId: string) => GoalProgress[];
  getActiveGoals: () => StudyGoal[];
  getCompletedGoals: () => StudyGoal[];
  calculateGoalCompletion: (goalId: string) => number;
  loadGoals: () => Promise<void>;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [goalProgress, setGoalProgress] = useState<GoalProgress[]>([]);

  const loadGoals = async () => {
    try {
      const savedGoals = await AsyncStorage.getItem('studyGoals');
      const savedProgress = await AsyncStorage.getItem('goalProgress');

      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedProgress) setGoalProgress(JSON.parse(savedProgress));
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const saveGoals = async (newGoals: StudyGoal[]) => {
    try {
      await AsyncStorage.setItem('studyGoals', JSON.stringify(newGoals));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  const saveProgress = async (newProgress: GoalProgress[]) => {
    try {
      await AsyncStorage.setItem('goalProgress', JSON.stringify(newProgress));
    } catch (error) {
      console.error('Error saving goal progress:', error);
    }
  };

  const createGoal = async (title: string, targetHours: number, frequency: GoalFrequency) => {
    const newGoal: StudyGoal = {
      id: `goal-${Date.now()}`,
      title,
      targetHours,
      frequency,
      status: 'active',
      createdAt: Date.now(),
      currentProgress: 0,
      lastUpdated: Date.now(),
    };

    const updated = [...goals, newGoal];
    setGoals(updated);
    await saveGoals(updated);
  };

  const updateGoalProgress = async (goalId: string, hoursAchieved: number) => {
    const today = new Date().toISOString().split('T')[0];

    // Update goal progress
    const existingProgress = goalProgress.find((p) => p.goalId === goalId && p.date === today);
    let newProgress: GoalProgress[];

    if (existingProgress) {
      newProgress = goalProgress.map((p) =>
        p.goalId === goalId && p.date === today
          ? {
              ...p,
              hoursAchieved: p.hoursAchieved + hoursAchieved,
              percentage: Math.min(
                100,
                ((p.hoursAchieved + hoursAchieved) /
                  goals.find((g) => g.id === goalId)?.targetHours!) *
                  100
              ),
            }
          : p
      );
    } else {
      const goal = goals.find((g) => g.id === goalId);
      if (!goal) return;

      newProgress = [
        ...goalProgress,
        {
          goalId,
          date: today,
          hoursAchieved,
          percentage: (hoursAchieved / goal.targetHours) * 100,
        },
      ];
    }

    setGoalProgress(newProgress);
    await saveProgress(newProgress);

    // Update goal current progress
    const updatedGoals = goals.map((g) =>
      g.id === goalId
        ? {
            ...g,
            currentProgress: newProgress
              .filter((p) => p.goalId === goalId)
              .reduce((sum, p) => sum + p.hoursAchieved, 0),
            lastUpdated: Date.now(),
          }
        : g
    );

    setGoals(updatedGoals);
    await saveGoals(updatedGoals);
  };

  const completeGoal = async (goalId: string) => {
    const updated = goals.map((g) =>
      g.id === goalId
        ? {
            ...g,
            status: 'completed' as GoalStatus,
            completedAt: Date.now(),
          }
        : g
    );

    setGoals(updated);
    await saveGoals(updated);
  };

  const deleteGoal = async (goalId: string) => {
    const updated = goals.filter((g) => g.id !== goalId);
    const filteredProgress = goalProgress.filter((p) => p.goalId !== goalId);

    setGoals(updated);
    setGoalProgress(filteredProgress);

    await saveGoals(updated);
    await saveProgress(filteredProgress);
  };

  const getGoalProgress = (goalId: string) => goalProgress.filter((p) => p.goalId === goalId);

  const getActiveGoals = () => goals.filter((g) => g.status === 'active');

  const getCompletedGoals = () => goals.filter((g) => g.status === 'completed');

  const calculateGoalCompletion = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return 0;

    const today = new Date().toISOString().split('T')[0];
    const todayProgress = goalProgress.find((p) => p.goalId === goalId && p.date === today);

    if (!todayProgress) return 0;
    return Math.min(100, (todayProgress.hoursAchieved / goal.targetHours) * 100);
  };

  return (
    <GoalsContext.Provider
      value={{
        goals,
        goalProgress,
        createGoal,
        updateGoalProgress,
        completeGoal,
        deleteGoal,
        getGoalProgress,
        getActiveGoals,
        getCompletedGoals,
        calculateGoalCompletion,
        loadGoals,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
}
