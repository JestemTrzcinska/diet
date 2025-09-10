import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useSelectedMeals } from '@/context/Context';
import { Meal } from '@/components/Meal';
import { FlatList, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/HelloWave';

export default function Lists() {
  const { selectedMeals } = useSelectedMeals();
  const { top } = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingTop: top }]}>
      <ThemedView style={[styles.titleContainer, { paddingTop: top }]}>
        <ThemedText type="title">Lists</ThemedText>
        <HelloWave />
      </ThemedView>
      <FlatList
        data={selectedMeals}
        renderItem={({ item }) => <Meal deleteMeal item={item} />}
        contentContainerStyle={{ paddingBottom: 150 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === 'web' ? 32 : 10,
    gap: 16,
    overflow: 'hidden',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
