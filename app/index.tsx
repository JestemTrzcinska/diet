import {
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Product {
  name: string;
  grams: number;
  quantity: string;
}

interface Meal {
  name: string;
  description: string;
  type: string;
  products: Product[];
}

const meals: Meal[] = require('@/assets/dieta-gem.json');
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

  const filteredMeals = meals.filter(meal => {
    const isMatchingType = activeType === 'all' || meal.type === activeType;
    const isMatchingName = meal.name
      .toLowerCase()
      .includes(keyword.toLowerCase());
    const isMatchingProducts = meal.products.some(product =>
      product.name.toLowerCase().includes(keyword.toLowerCase()),
    );

    return isMatchingType && (isMatchingName || isMatchingProducts);
  });

  const renderFilterChips = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.chip, activeType === item && styles.activeChip]}
      onPress={() => setActiveType(item)}>
      <ThemedText style={styles.chipText}>{item}</ThemedText>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Meal }) => {
    return (
      <ThemedView style={styles.mealContainer}>
        <ThemedText style={styles.type} type="subtitle">
          - {item.type}
        </ThemedText>
        <ThemedText type="title">{item.name}</ThemedText>
        {item.description && (
          <ThemedText>
            {String(item.description)
              .replaceAll('(?<!\d)\.\s', '\n')
              .replaceAll(': ', '\n')}
          </ThemedText>
        )}
        {item.products.map((product: Product, index: number) => (
          <ThemedView key={index} style={styles.productContainer}>
            <ThemedText style={styles.productText}>{product.name}</ThemedText>
            <ThemedText style={styles.productText}>
              {product.grams} gramów
            </ThemedText>
            <ThemedText style={styles.productText}>
              {product.quantity}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    );
  };

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
        {mealTypes.map(item => renderFilterChips({ item }))}
      </ThemedView>

      <FlatList data={filteredMeals} renderItem={renderItem} />
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
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
    marginBottom: 10,
  },
  activeChip: {
    backgroundColor: 'dodgerblue',
  },
  chipText: {
    color: '#333',
    textTransform: 'capitalize',
  },

  mealContainer: {
    gap: 8,
    padding: Platform.OS === 'web' ? 15 : 5,
    paddingVertical: 20,
    // @ts-ignore
    width: Platform.OS === 'web' ? '50%' : '100%' - 15,
  },
  type: {
    right: Platform.OS === 'web' ? 15 : 8,
  },
  productContainer: {
    marginLeft: Platform.OS === 'web' ? 20 : 10,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  productText: {
    flex: 1,
  },
});
