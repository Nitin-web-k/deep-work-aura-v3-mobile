import { describe, it, expect } from 'vitest';

// Test utility functions for timer logic

describe('Timer Utilities', () => {
  describe('formatTime', () => {
    const formatTime = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    it('should format seconds correctly', () => {
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(5)).toBe('0:05');
      expect(formatTime(60)).toBe('1:00');
      expect(formatTime(65)).toBe('1:05');
      expect(formatTime(1500)).toBe('25:00');
      expect(formatTime(3600)).toBe('1:00:00');
      expect(formatTime(3661)).toBe('1:01:01');
    });
  });

  describe('calculateStats', () => {
    it('should calculate total focus time correctly', () => {
      const sessions = [
        { type: 'work' as const, duration: 1500, completed: true },
        { type: 'break' as const, duration: 300, completed: true },
        { type: 'work' as const, duration: 1500, completed: true },
      ];

      const totalFocusTime = sessions
        .filter((s) => s.type === 'work' && s.completed)
        .reduce((sum, s) => sum + s.duration, 0);

      expect(totalFocusTime).toBe(3000); // 50 minutes
    });

    it('should count sessions correctly', () => {
      const sessions = [
        { type: 'work' as const, duration: 1500, completed: true },
        { type: 'break' as const, duration: 300, completed: true },
        { type: 'work' as const, duration: 1500, completed: true },
        { type: 'work' as const, duration: 1500, completed: false },
      ];

      const completedSessions = sessions.filter((s) => s.type === 'work' && s.completed).length;

      expect(completedSessions).toBe(2);
    });
  });

  describe('calculateStreak', () => {
    it('should calculate consecutive days with sessions', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sessions = [];
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        sessions.push({
          type: 'work' as const,
          duration: 1500,
          startTime: date.getTime(),
          completed: true,
        });
      }

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

      expect(currentStreak).toBe(5);
    });

    it('should break streak on missing day', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sessions = [];
      // Add sessions for today, yesterday, and 2 days ago
      for (let i = 0; i < 2; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        sessions.push({
          type: 'work' as const,
          duration: 1500,
          startTime: date.getTime(),
          completed: true,
        });
      }
      // Skip one day (yesterday - 1)
      // Add session for 3 days ago
      const threeAgo = new Date(today);
      threeAgo.setDate(threeAgo.getDate() - 3);
      sessions.push({
        type: 'work' as const,
        duration: 1500,
        startTime: threeAgo.getTime(),
        completed: true,
      });

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

      expect(currentStreak).toBe(2); // Only today and yesterday
    });
  });
});
