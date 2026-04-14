import { useEffect, useRef, useState } from 'react';

export type TimerPhase = 'idle' | 'work' | 'break' | 'paused';

export interface TimerState {
  phase: TimerPhase;
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
  cycleCount: number;
  isRunning: boolean;
}

export function useTimerCountdown(workDuration: number, breakDuration: number) {
  const [state, setState] = useState<TimerState>({
    phase: 'idle',
    timeRemaining: workDuration * 60,
    totalTime: workDuration * 60,
    cycleCount: 0,
    isRunning: false,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);

  const startTimer = (onComplete?: () => void) => {
    if (onComplete) {
      onCompleteRef.current = onComplete;
    }

    setState((prev) => ({
      ...prev,
      isRunning: true,
      phase: prev.phase === 'idle' ? 'work' : prev.phase,
    }));
  };

  const pauseTimer = () => {
    setState((prev) => ({
      ...prev,
      isRunning: false,
      phase: 'paused',
    }));
  };

  const resumeTimer = () => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
      phase: prev.phase === 'paused' ? (prev.cycleCount % 2 === 0 ? 'work' : 'break') : prev.phase,
    }));
  };

  const stopTimer = () => {
    setState({
      phase: 'idle',
      timeRemaining: workDuration * 60,
      totalTime: workDuration * 60,
      cycleCount: 0,
      isRunning: false,
    });
  };

  const switchPhase = (newPhase: 'work' | 'break') => {
    const newDuration = newPhase === 'work' ? workDuration * 60 : breakDuration * 60;
    setState((prev) => ({
      ...prev,
      phase: newPhase,
      timeRemaining: newDuration,
      totalTime: newDuration,
      cycleCount: newPhase === 'work' ? prev.cycleCount + 1 : prev.cycleCount,
    }));
  };

  // Main timer effect
  useEffect(() => {
    if (!state.isRunning || state.phase === 'idle' || state.phase === 'paused') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeRemaining <= 1) {
          // Timer completed
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }

          // Auto-switch phase
          const nextPhase = prev.phase === 'work' ? 'break' : 'work';
          const newDuration = nextPhase === 'work' ? workDuration * 60 : breakDuration * 60;

          return {
            ...prev,
            phase: nextPhase,
            timeRemaining: newDuration,
            totalTime: newDuration,
            cycleCount: nextPhase === 'work' ? prev.cycleCount + 1 : prev.cycleCount,
          };
        }

        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.phase, workDuration, breakDuration]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    return (state.totalTime - state.timeRemaining) / state.totalTime;
  };

  return {
    state,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    switchPhase,
    formatTime,
    getProgress,
  };
}
