import { ScrollView, Text, View, Pressable, TextInput, Modal, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useGoals } from '@/lib/goals-context';
import { useState, useEffect } from 'react';

type GoalFrequency = 'daily' | 'weekly' | 'monthly';

export default function GoalsScreen() {
  const { goals, createGoal, deleteGoal, completeGoal, getActiveGoals, loadGoals } = useGoals();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [targetHours, setTargetHours] = useState('');
  const [frequency, setFrequency] = useState<GoalFrequency>('daily');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const handleCreateGoal = async () => {
    if (!title.trim() || !targetHours.trim()) return;

    setIsLoading(true);
    try {
      await createGoal(title, parseFloat(targetHours), frequency);
      setTitle('');
      setTargetHours('');
      setFrequency('daily');
      setShowModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const activeGoals = getActiveGoals();

  return (
    <ScreenContainer className="p-4 gap-4">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View className="gap-1">
          <Text className="text-3xl font-bold text-foreground">Study Goals</Text>
          <Text className="text-sm text-muted">Set and track your learning targets</Text>
        </View>
        <Pressable
          onPress={() => setShowModal(true)}
          style={({ pressed }) => [
            {
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: '#ADBB32',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text className="text-background text-2xl font-bold">+</Text>
        </Pressable>
      </View>

      {/* Goals List */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {activeGoals.length === 0 ? (
          <View className="items-center justify-center py-8">
            <Text className="text-center text-muted text-sm">
              No active goals yet. Create one to get started!
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {activeGoals.map((goal) => (
              <View key={goal.id} className="bg-surface rounded-xl p-4 gap-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 gap-1">
                    <Text className="text-base font-semibold text-foreground">{goal.title}</Text>
                    <Text className="text-xs text-muted capitalize">
                      {goal.frequency} • {goal.targetHours} hours
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => deleteGoal(goal.id)}
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <Text className="text-error text-lg">✕</Text>
                  </Pressable>
                </View>

                {/* Progress Bar */}
                <View className="gap-2">
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-muted">Progress</Text>
                    <Text className="text-xs font-semibold text-primary">
                      {goal.currentProgress.toFixed(1)}h / {goal.targetHours}h
                    </Text>
                  </View>

                  <View className="h-2 bg-background rounded-full overflow-hidden">
                    <View
                      className="h-full bg-primary"
                      style={{
                        width: `${Math.min(100, (goal.currentProgress / goal.targetHours) * 100)}%`,
                      }}
                    />
                  </View>

                  <Text className="text-xs text-muted">
                    {Math.min(100, (goal.currentProgress / goal.targetHours) * 100).toFixed(0)}% Complete
                  </Text>
                </View>

                {/* Action Button */}
                {goal.currentProgress >= goal.targetHours && (
                  <Pressable
                    onPress={() => completeGoal(goal.id)}
                    style={({ pressed }) => [
                      {
                        backgroundColor: '#22C55E',
                        borderRadius: 8,
                        paddingVertical: 10,
                        alignItems: 'center',
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <Text className="text-background font-semibold text-sm">Mark as Completed 🎉</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create Goal Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black bg-opacity-50 justify-end">
          <View className="bg-surface rounded-t-3xl p-6 gap-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-2xl font-bold text-foreground">Create New Goal</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Text className="text-2xl text-muted">✕</Text>
              </Pressable>
            </View>

            {/* Goal Title */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Goal Title</Text>
              <TextInput
                placeholder="e.g., Complete Math Chapter"
                placeholderTextColor="#A0A0A0"
                value={title}
                onChangeText={setTitle}
                className="bg-background text-foreground rounded-lg p-3 text-sm"
              />
            </View>

            {/* Target Hours */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Target Hours</Text>
              <TextInput
                placeholder="e.g., 5"
                placeholderTextColor="#A0A0A0"
                value={targetHours}
                onChangeText={setTargetHours}
                keyboardType="decimal-pad"
                className="bg-background text-foreground rounded-lg p-3 text-sm"
              />
            </View>

            {/* Frequency */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Frequency</Text>
              <View className="flex-row gap-2">
                {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                  <Pressable
                    key={freq}
                    onPress={() => setFrequency(freq)}
                    style={({ pressed }) => [
                      {
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: frequency === freq ? '#ADBB32' : '#1a1a1a',
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <Text
                      className={`font-semibold text-sm capitalize ${
                        frequency === freq ? 'text-background' : 'text-foreground'
                      }`}
                    >
                      {freq}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Create Button */}
            <Pressable
              onPress={handleCreateGoal}
              disabled={isLoading || !title.trim() || !targetHours.trim()}
              style={({ pressed }) => [
                {
                  backgroundColor: '#ADBB32',
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: 'center',
                  opacity: isLoading || !title.trim() || !targetHours.trim() ? 0.5 : pressed ? 0.8 : 1,
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#0f0f0f" size="small" />
              ) : (
                <Text className="text-background font-bold">Create Goal</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
