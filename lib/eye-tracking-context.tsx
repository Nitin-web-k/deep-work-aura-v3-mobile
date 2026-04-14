import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface EyeTrackingContextType {
  isEyeDetected: boolean;
  isCameraActive: boolean;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  lastDetectionTime: number;
  eyeClosedDuration: number;
}

const EyeTrackingContext = createContext<EyeTrackingContextType | undefined>(undefined);

const INACTIVITY_THRESHOLD = 60000; // 1 minute in milliseconds

export function EyeTrackingProvider({ children }: { children: React.ReactNode }) {
  const [isEyeDetected, setIsEyeDetected] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [lastDetectionTime, setLastDetectionTime] = useState(() => Date.now());
  const [eyeClosedDuration, setEyeClosedDuration] = useState(0);
  const trackingIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    // Monitor eye closed duration
    const interval = setInterval(() => {
      const timeSinceLastDetection = Date.now() - lastDetectionTime;
      setEyeClosedDuration(timeSinceLastDetection);

      if (timeSinceLastDetection > INACTIVITY_THRESHOLD) {
        setIsEyeDetected(false);
      } else {
        setIsEyeDetected(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastDetectionTime]);

  const startTracking = async () => {
    try {
      setIsCameraActive(true);
      setLastDetectionTime(Date.now());

      // Simulate eye detection - in production, integrate with expo-camera and expo-face-detector
      trackingIntervalRef.current = setInterval(() => {
        // Simulate random eye detection
        if (Math.random() > 0.1) {
          setLastDetectionTime(Date.now());
          setIsEyeDetected(true);
          setEyeClosedDuration(0);
        }
      }, 500);
    } catch (error) {
      console.error('Error starting eye tracking:', error);
    }
  };

  const stopTracking = () => {
    setIsCameraActive(false);
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
    }
  };

  return (
    <EyeTrackingContext.Provider
      value={{
        isEyeDetected,
        isCameraActive,
        startTracking,
        stopTracking,
        lastDetectionTime,
        eyeClosedDuration,
      }}
    >
      {children}
    </EyeTrackingContext.Provider>
  );
}

export function useEyeTracking() {
  const context = useContext(EyeTrackingContext);
  if (!context) {
    throw new Error('useEyeTracking must be used within an EyeTrackingProvider');
  }
  return context;
}
