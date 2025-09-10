import { FlatList, StyleSheet, TextInput } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFilteredMeals } from '@/hooks/useFilterMeals';
import { Chip } from '@/components/Chip';
import { Meal } from '@/components/Meal';

const mealTypes = [
  'all',
  'Śniadanie',
  'Drugie śniadanie',
  'Obiad',
  'Kolacja',
  'Podwieczorek',
];

export default function HomeScreen() {
  const [keyword, setKeyword] = useState('');
  const [activeType, setActiveType] = useState('all');

  const { top } = useSafeAreaInsets();

  const filteredMeals = useFilteredMeals(keyword, activeType);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.titleContainer, { paddingTop: top }]}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView>
        <ThemedText type="defaultSemiBold">Szukaj</ThemedText>
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          style={styles.input}
        />
        <ThemedText>znaleziono {filteredMeals.length} posiłków</ThemedText>
      </ThemedView>

      <ThemedView style={styles.chipContainer}>
        {mealTypes.map(type => (
          <Chip
            key={type}
            type={type}
            activeType={activeType}
            setActiveType={setActiveType}
          />
        ))}
      </ThemedView>

      <FlatList
        data={filteredMeals}
        renderItem={({ item }) => <Meal item={item} />}
        contentContainerStyle={{ paddingBottom: 150 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    padding: 14,
    borderRadius: 8,
    width: '100%',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
});
