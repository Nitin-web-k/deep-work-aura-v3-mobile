import { ScrollView, Text, View, Pressable, Switch } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useTimer } from '@/lib/timer-context';
import { useState } from 'react';
import Slider from '@react-native-community/slider';

export default function SettingsScreen() {
  const { settings, updateSettings } = useTimer();

  const [workDuration, setWorkDuration] = useState(settings.workDuration);
  const [breakDuration, setBreakDuration] = useState(settings.breakDuration);
  const [longBreakDuration, setLongBreakDuration] = useState(settings.longBreakDuration);
  const [sessionsPerCycle, setSessionsPerCycle] = useState(settings.sessionsPerCycle);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);

  const handleSaveSettings = async () => {
    await updateSettings({
      workDuration,
      breakDuration,
      longBreakDuration,
      sessionsPerCycle,
      soundEnabled,
      notificationsEnabled,
    });
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">Settings</Text>
            <Text className="text-sm text-muted mt-2">Customize your focus sessions</Text>
          </View>

          {/* Work Duration */}
          <View className="bg-surface rounded-xl p-4 gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-semibold text-foreground">Work Duration</Text>
              <View className="bg-primary px-3 py-1 rounded-full">
                <Text className="text-white font-bold">{workDuration} min</Text>
              </View>
            </View>
            <Slider
              style={{ height: 40 }}
              minimumValue={15}
              maximumValue={120}
              step={5}
              value={workDuration}
              onValueChange={setWorkDuration}
              minimumTrackTintColor="#0a7ea4"
              maximumTrackTintColor="#e5e7eb"
              thumbTintColor="#0a7ea4"
            />
            <Text className="text-xs text-muted">Adjust focus session length (15-120 minutes)</Text>
          </View>

          {/* Break Duration */}
          <View className="bg-surface rounded-xl p-4 gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-semibold text-foreground">Break Duration</Text>
              <View className="bg-success px-3 py-1 rounded-full">
                <Text className="text-white font-bold">{breakDuration} min</Text>
              </View>
            </View>
            <Slider
              style={{ height: 40 }}
              minimumValue={5}
              maximumValue={30}
              step={1}
              value={breakDuration}
              onValueChange={setBreakDuration}
              minimumTrackTintColor="#22C55E"
              maximumTrackTintColor="#e5e7eb"
              thumbTintColor="#22C55E"
            />
            <Text className="text-xs text-muted">Adjust break length (5-30 minutes)</Text>
          </View>

          {/* Sessions Per Cycle */}
          <View className="bg-surface rounded-xl p-4 gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-semibold text-foreground">Sessions Per Cycle</Text>
              <View className="bg-warning px-3 py-1 rounded-full">
                <Text className="text-white font-bold">{sessionsPerCycle}</Text>
              </View>
            </View>
            <View className="flex-row gap-2 justify-between">
              {[2, 3, 4, 5, 6].map((num) => (
                <Pressable
                  key={num}
                  onPress={() => setSessionsPerCycle(num)}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 8,
                      backgroundColor: sessionsPerCycle === num ? '#0a7ea4' : '#e5e7eb',
                      alignItems: 'center',
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    className={`font-semibold ${sessionsPerCycle === num ? 'text-white' : 'text-foreground'}`}
                  >
                    {num}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text className="text-xs text-muted">Sessions before long break</Text>
          </View>

          {/* Long Break Duration */}
          <View className="bg-surface rounded-xl p-4 gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-semibold text-foreground">Long Break Duration</Text>
              <View className="bg-success px-3 py-1 rounded-full">
                <Text className="text-white font-bold">{longBreakDuration} min</Text>
              </View>
            </View>
            <Slider
              style={{ height: 40 }}
              minimumValue={10}
              maximumValue={60}
              step={5}
              value={longBreakDuration}
              onValueChange={setLongBreakDuration}
              minimumTrackTintColor="#22C55E"
              maximumTrackTintColor="#e5e7eb"
              thumbTintColor="#22C55E"
            />
            <Text className="text-xs text-muted">Extended break after completing cycles</Text>
          </View>

          {/* Sound Settings */}
          <View className="bg-surface rounded-xl p-4 flex-row justify-between items-center">
            <View>
              <Text className="text-base font-semibold text-foreground">Sound Notifications</Text>
              <Text className="text-xs text-muted mt-1">Play sound on timer events</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#e5e7eb', true: '#0a7ea4' }}
              thumbColor={soundEnabled ? '#0a7ea4' : '#f0f0f0'}
            />
          </View>

          {/* Notification Settings */}
          <View className="bg-surface rounded-xl p-4 flex-row justify-between items-center">
            <View>
              <Text className="text-base font-semibold text-foreground">Break Reminders</Text>
              <Text className="text-xs text-muted mt-1">Get notified for breaks</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e5e7eb', true: '#0a7ea4' }}
              thumbColor={notificationsEnabled ? '#0a7ea4' : '#f0f0f0'}
            />
          </View>

          {/* Save Button */}
          <Pressable
            onPress={handleSaveSettings}
            style={({ pressed }) => [
              {
                backgroundColor: '#0a7ea4',
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
                opacity: pressed ? 0.8 : 1,
                marginTop: 8,
              },
            ]}
          >
            <Text className="text-lg font-semibold text-white">Save Settings</Text>
          </Pressable>

          {/* Info Section */}
          <View className="bg-blue-50 dark:bg-blue-900 rounded-xl p-4 mt-4 mb-8">
            <Text className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Tips</Text>
            <Text className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
              Start with the standard 25-minute work sessions. Adjust based on your focus capacity and task complexity.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
