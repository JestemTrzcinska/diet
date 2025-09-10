import { FlatList, Platform, StyleSheet, TextInput } from 'react-native';

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

export default function RootLayout() {
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

      <FlatList data={filteredMeals} renderItem={Meal} />
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
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    width: Platform.OS === 'web' ? '50%' : '100%',
    borderColor: 'blue',
    borderWidth: 1,
  },

  chipContainer: {
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});
