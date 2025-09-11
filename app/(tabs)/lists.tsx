import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useSelectedMeals } from '@/context/Context';
import { Meal } from '@/components/Meal';
import { FlatList, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/HelloWave';
import * as Clipboard from 'expo-clipboard';
import { MealState } from '@/constants/types';
import { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Lists() {
  const { selectedMeals } = useSelectedMeals();
  const { top } = useSafeAreaInsets();
  const [showFilters, setShowFilters] = useState(true);

  const generateShoppingList = async (meals: MealState[]) => {
    const allProducts = meals.flatMap(meal => meal.products);

    // Create a map to sum quantities of products with the same name and unit
    const productMap = new Map<
      string,
      { quantity: number; unit: string; grams: number }
    >();

    allProducts.forEach(product => {
      // Parse the quantity string (e.g., "1 x szklanka" -> quantity = 1, unit = "szklanka")
      const [quantityStr, , ...unitParts] = product.quantity.split(' ');
      const quantity = parseFloat(quantityStr);
      const unit = unitParts.join(' '); // In case unit has spaces

      const key = `${product.name} ${unit}`;

      if (productMap.has(key)) {
        const existing = productMap.get(key)!;
        productMap.set(key, {
          quantity: existing.quantity + quantity,
          unit: unit,
          grams: existing.grams + product.grams,
        });
      } else {
        productMap.set(key, {
          quantity,
          unit,
          grams: product.grams,
        });
      }
    });

    // Convert the map back to an array of strings
    const textToCopy = Array.from(productMap.entries())
      .map(([key, { quantity, unit, grams }]) => {
        const name = key.split(' ').slice(0, -1).join(' '); // Remove the unit from the key
        return `${name} (${quantity} x ${unit}) ${grams} g`;
      })
      .join('\n');

    if (textToCopy) {
      await Clipboard.setStringAsync(textToCopy);
      alert('Lista zakupów została skopiowana do schowka!');
    } else {
      alert('Brak produktów do skopiowania!');
    }
  };
  return (
    <ThemedView
      style={[
        styles.container,
        { paddingTop: top },
        Platform.OS === 'web' ? { paddingTop: 32 } : {},
      ]}>
      <ThemedView style={[styles.titleContainer, { paddingTop: top }]}>
        <HelloWave />
        <ThemedText type="title">Lista wybranych posiłków</ThemedText>
      </ThemedView>

      <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
        <MaterialIcons
          name={showFilters ? 'filter-alt-off' : 'filter-alt'}
          size={24}
          color="black"
        />
      </TouchableOpacity>

      {showFilters && selectedMeals.length > 0 && (
        <>
          <TouchableOpacity
            onPress={() => generateShoppingList(selectedMeals)}
            style={styles.button}>
            <ThemedText>Wygeneruj listę zakupów</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              generateShoppingList([...selectedMeals, ...selectedMeals])
            }
            style={styles.button}>
            <ThemedText>Wygeneruj listę zakupów dla dwóch osób</ThemedText>
          </TouchableOpacity>
        </>
      )}
      <FlatList
        data={selectedMeals}
        renderItem={({ item }) => <Meal deleteMeal item={item} />}
        contentContainerStyle={{ paddingBottom: 150 }}
        ListEmptyComponent={
          <ThemedText>Lista jest pusta. Nie bądz taki, dodaj coś</ThemedText>
        }
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
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: 'blue',
    borderWidth: 1,
    width: Platform.OS === 'web' ? '50%' : '100%',
    alignItems: 'center',
  },
});
