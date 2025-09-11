import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFilteredMeals } from '@/hooks/useFilterMeals';
import { Chip } from '@/components/Chip';
import { Meal } from '@/components/Meal';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

const mealTypes = [
  'all',
  'Śniadanie',
  'Drugie śniadanie',
  'Obiad',
  'Podwieczorek',
  'Kolacja',
];

export default function HomeScreen() {
  const theme = useColorScheme() ?? 'light';
  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    'text',
  );
  const { top } = useSafeAreaInsets();

  const [keyword, setKeyword] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [activeType, setActiveType] = useState('all');

  const filteredMeals = useFilteredMeals(keyword, activeType);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.titleContainer, { paddingTop: top }]}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
        <MaterialIcons
          name={showFilters ? 'filter-alt-off' : 'filter-alt'}
          size={24}
          color={theme === 'light' ? 'black' : 'white'}
        />
      </TouchableOpacity>

      {showFilters && (
        <>
          <ThemedView>
            <ThemedText type="defaultSemiBold">Szukaj</ThemedText>
            <TextInput
              value={keyword}
              onChangeText={setKeyword}
              style={[styles.input, { color }]}
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
        </>
      )}

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
