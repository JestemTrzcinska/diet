import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MealState, Nutrition, ProductState } from '@/constants/types';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelectedMeals } from '@/context/Context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const nutritionDB = require('@/assets/calories.json');

interface Props {
  item: MealState;
  deleteMeal?: boolean;
}

export const Meal = ({ item, deleteMeal }: Props) => {
  const { addToList, deleteFromList } = useSelectedMeals();

  const handlePress = () => {
    if (deleteMeal) {
      deleteFromList(item);
    } else {
      addToList(item);
    }
  };

  function calculateMealCalories() {
    return item.products.reduce((totalCalories, product) => {
      const nutritionDBElement = nutritionDB.find(
        (element: Nutrition) => element.name === product.name,
      );
      if (nutritionDBElement) {
        return (
          totalCalories + (nutritionDBElement.calories / 100) * product.grams
        );
      } else {
        return totalCalories;
      }
    }, 0);
  }

  return (
    <TouchableOpacity style={styles.mealContainer} onPress={handlePress}>
      <ThemedView style={styles.add}>
        <ThemedText style={styles.type} type="subtitle">
          - {item.type} {calculateMealCalories()} kcal
        </ThemedText>
        <MaterialIcons
          color={deleteMeal ? 'red' : 'green'}
          size={Platform.OS === 'web' ? 48 : 22}
          name={deleteMeal ? 'delete' : 'add'}
        />
      </ThemedView>
      <ThemedText type="title">{item.name}</ThemedText>
      {item.description && (
        <ThemedText>
          {String(item.description)
            .replaceAll('(?<!\d)\.\s', '\n')
            .replaceAll(': ', '\n')}
        </ThemedText>
      )}
      {item.products.map((product: ProductState, index: number) => (
        <ThemedView key={index} style={styles.productContainer}>
          <ThemedText style={styles.productText}>{product.name}</ThemedText>
          <ThemedText style={styles.productText}>
            {product.grams} gramów
          </ThemedText>
          <ThemedText style={styles.productText}>{product.quantity}</ThemedText>
        </ThemedView>
      ))}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mealContainer: {
    gap: 8,
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
  },
  add: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  type: {
    fontSize: 14,
    color: '#666',
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  productText: {
    flex: 1,
    fontSize: 14,
  },
});
