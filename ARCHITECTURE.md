# Deep Work Aura V3 - Enterprise App Architecture

## Overview
A complete professional productivity and learning app with AI tutoring, live camera tracking, and competitive leaderboard system.

## Core Features

### 1. WhatsApp-Style AI Chat (General)
- **Purpose**: Answer any general question
- **UI**: Chat bubble interface like WhatsApp
- **Features**:
  - Real-time message streaming
  - Typing indicators
  - Message timestamps
  - Conversation history
  - Search functionality
  - Message reactions/ratings

### 2. Subject-Wise AI (Specialized)
- **Subjects**: Math, Science, History, English, General
- **Features**:
  - Subject-specific prompts
  - Step-by-step explanations
  - Formula/concept references
  - Practice problems generation
  - Subject-specific UI themes

### 3. Live Camera Eye Tracking
- **Purpose**: Monitor focus during Pomodoro sessions
- **Features**:
  - Real-time eye detection
  - Blink detection
  - 1-minute inactivity threshold
  - Auto-reset Pomodoro if eyes not detected
  - Visual feedback on camera status
  - Privacy-first (no recording, local processing)

### 4. Luxury UI/UX Design
- **Design System**:
  - Premium color palette (dark theme with neon accents)
  - Smooth animations and transitions
  - Glass-morphism effects
  - Gradient backgrounds
  - Custom typography
  - Micro-interactions

### 5. Leaderboard System
- **Ranking Criteria**:
  - Total focus hours
  - Current streak
  - Sessions completed
  - Average session duration
  - Subject mastery scores
- **Features**:
  - Global rankings
  - Friend rankings
  - Weekly/Monthly/All-time views
  - Achievement badges
  - Rank progression

### 6. Status Checking & Analytics
- **Student Progress**:
  - Daily/weekly/monthly statistics
  - Focus time trends
  - Subject performance
  - Learning velocity
  - Goal progress
- **Teacher Dashboard** (Optional):
  - Student progress monitoring
  - Class analytics
  - Performance insights

### 7. Pomodoro Timer with Eye Tracking
- **Features**:
  - Customizable work/break durations
  - Eye detection integration
  - Auto-reset on inactivity
  - Session history
  - Break reminders
  - Focus streak tracking

## Technical Architecture

### Frontend Stack
- **Framework**: React Native with Expo
- **State Management**: React Context + TanStack Query
- **Styling**: NativeWind (Tailwind CSS)
- **Camera**: expo-camera with ML Kit
- **Real-time**: WebSocket for chat streaming
- **Database**: AsyncStorage (local) + PostgreSQL (cloud)

### Backend Stack
- **Server**: Express.js with tRPC
- **AI**: Google Generative AI (Gemini 2.0 Flash)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: OAuth via Manus platform
- **File Storage**: S3-compatible storage

### Key Integrations
- **Google Gemini API**: AI responses
- **ML Kit**: Eye detection
- **Firebase**: Push notifications
- **Expo**: Build and deployment

## Database Schema

### Users
- id, email, name, avatar, createdAt
- focusHours, sessionsCompleted, currentStreak
- leaderboardRank, totalPoints

### Sessions
- id, userId, startTime, endTime, duration
- subject, focusQuality, eyeTrackingData
- completed, interrupted

### Messages
- id, userId, content, role (user/assistant)
- subject, language, timestamp
- rating, helpful

### Leaderboard
- userId, rank, focusHours, streak, points
- weeklyRank, monthlyRank, allTimeRank

### Goals
- id, userId, subject, targetHours, frequency
- startDate, endDate, completed

## Screen Flow

1. **Splash/Onboarding** → Authentication
2. **Home Dashboard** → Today's stats, quick start
3. **Main Tabs**:
   - **Chat** (WhatsApp-style AI)
   - **Subject AI** (Specialized tutoring)
   - **Timer** (Pomodoro with eye tracking)
   - **Leaderboard** (Rankings)
   - **Analytics** (Status/Progress)
   - **Profile** (Settings)

## Security & Privacy

- **Eye Tracking**: Local processing, no recording
- **Data Encryption**: TLS for all communications
- **Authentication**: OAuth tokens
- **Data Storage**: Encrypted local storage
- **GDPR Compliance**: Data deletion, export options

## Performance Targets

- **App Load**: < 2 seconds
- **Chat Response**: < 3 seconds (AI)
- **Camera Tracking**: 30 FPS
- **Leaderboard Update**: Real-time with <500ms latency
- **Offline Support**: Core features work offline

## Deployment

- **iOS**: App Store
- **Android**: Google Play Store
- **Web**: Progressive Web App (PWA)
- **Backend**: Cloud deployment (AWS/GCP)

## Timeline & Phases

1. **Phase 1**: Core infrastructure (auth, database, basic UI)
2. **Phase 2**: AI chat systems (general + subject-wise)
3. **Phase 3**: Camera tracking integration
4. **Phase 4**: Leaderboard and analytics
5. **Phase 5**: UI/UX polish and animations
6. **Phase 6**: Testing and deployment

## Success Metrics

- User retention rate > 70%
- Daily active users growth
- Average session duration > 25 min
- AI response satisfaction > 4.5/5
- App store rating > 4.8/5
