# Deep Work Aura V3 - Mobile App Design

## Overview

Deep Work Aura V3 is a productivity and focus application designed to help users maintain deep concentration through intelligent session management, customizable timers, and AI-powered distraction detection.

---

## Screen List

1. **Home Screen** - Main dashboard showing current session status and quick actions
2. **Timer Screen** - Pomodoro timer with work/break intervals and session controls
3. **Settings Screen** - Customize timer durations, notifications, and preferences
4. **History Screen** - View past sessions and focus statistics
5. **Leaderboard Screen** - Competitive focus tracking (optional for future)
6. **Profile Screen** - User information and account settings

---

## Primary Content and Functionality

### Home Screen
- **Current Session Card**: Displays active or upcoming session
- **Quick Start Button**: Begin a focus session immediately
- **Today's Stats**: Total focus time, sessions completed, current streak
- **Recent Sessions**: List of today's completed sessions
- **Navigation**: Tab bar to access Timer, Settings, History, and Profile

### Timer Screen
- **Large Circular Timer Display**: Shows remaining time in work/break phase
- **Phase Indicator**: Displays "Focus Time" or "Break Time"
- **Control Buttons**: Start, Pause, Resume, Stop
- **Session Progress**: Visual indicator showing completed cycles
- **Background**: Calming gradient or nature-inspired background
- **Optional Audio**: Ambient sounds or focus music integration

### Settings Screen
- **Work Duration Slider**: Customize focus session length (15-120 minutes)
- **Break Duration Slider**: Customize break length (5-30 minutes)
- **Sessions Per Cycle**: Number of sessions before long break
- **Long Break Duration**: Extended break after completing cycles
- **Notifications Toggle**: Enable/disable break reminders
- **Sound Settings**: Toggle notification sounds
- **Theme Selection**: Light/Dark mode toggle
- **About Section**: App version and information

### History Screen
- **Session List**: All past sessions with date, duration, and completion status
- **Statistics Cards**: Total focus hours, average session length, best streak
- **Calendar View**: Visual representation of focus days
- **Filter Options**: Filter by date range or session type

### Profile Screen
- **User Avatar**: Profile picture placeholder
- **Username**: Display name
- **Statistics Summary**: Total sessions, total focus hours, current streak
- **Account Settings**: Logout, delete account
- **Preferences**: Notification settings, theme

---

## Key User Flows

### Flow 1: Start a Focus Session
1. User taps "Start Session" on Home Screen
2. App navigates to Timer Screen
3. Timer begins countdown from configured work duration
4. User sees real-time timer with phase indicator
5. When work phase ends, app shows break phase
6. User can pause/resume at any time
7. Session completes and is saved to history

### Flow 2: Customize Timer Settings
1. User taps Settings tab
2. User adjusts work duration (slider)
3. User adjusts break duration (slider)
4. User toggles notifications
5. Changes are saved automatically
6. User returns to Home Screen

### Flow 3: View Focus Statistics
1. User taps History tab
2. App displays list of past sessions
3. User can see total focus time and streaks
4. User can tap individual sessions for details
5. User can view calendar heatmap of focus days

---

## Color Choices

| Element | Light Mode | Dark Mode | Purpose |
|---------|-----------|-----------|---------|
| **Primary** | `#0a7ea4` | `#0a7ea4` | Action buttons, focus indicators |
| **Background** | `#ffffff` | `#151718` | Screen background |
| **Surface** | `#f5f5f5` | `#1e2022` | Cards, elevated surfaces |
| **Foreground** | `#11181C` | `#ECEDEE` | Primary text |
| **Muted** | `#687076` | `#9BA1A6` | Secondary text |
| **Success** | `#22C55E` | `#4ADE80` | Session completed, positive feedback |
| **Warning** | `#F59E0B` | `#FBBF24` | Break reminders, alerts |
| **Error** | `#EF4444` | `#F87171` | Session cancelled, errors |

### Brand Accent
- **Primary Focus Color**: Deep teal (`#0a7ea4`) for focus-related actions
- **Accent Gradient**: Teal to indigo for timer backgrounds
- **Calming Secondary**: Soft gray for secondary UI elements

---

## Typography

- **Headings**: Bold, 24-28px for screen titles
- **Subheadings**: Semi-bold, 18-20px for section titles
- **Body**: Regular, 14-16px for content
- **Labels**: Medium, 12-14px for form labels
- **Numbers**: Mono font for timer display (large, bold)

---

## Interaction Patterns

### Timer Display
- Large, easy-to-read countdown in center of screen
- Subtle animations when phase changes
- Haptic feedback on session start/end

### Buttons
- Primary buttons: Teal background with white text
- Secondary buttons: Outlined style with teal border
- Destructive actions: Red background with confirmation

### Cards
- Rounded corners (12-16px radius)
- Subtle shadow for elevation
- Tap feedback with opacity change

---

## Mobile-First Considerations

- **Portrait Orientation**: App optimized for 9:16 aspect ratio
- **One-Handed Usage**: All interactive elements within thumb reach
- **Safe Area**: Content respects notch and home indicator
- **Touch Targets**: Minimum 44px tap area for all buttons
- **Performance**: Smooth animations at 60fps, minimal battery drain
