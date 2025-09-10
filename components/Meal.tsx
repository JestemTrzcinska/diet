import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MealState, ProductState } from '@/constants/types';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelectedMeals } from '@/context/Context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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

  return (
    <TouchableOpacity style={styles.mealContainer} onPress={handlePress}>
      <ThemedView style={styles.add}>
        <ThemedText style={styles.type} type="subtitle">
          - {item.type}
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
    padding: Platform.OS === 'web' ? 15 : 5,
    paddingVertical: 20,
    width: Platform.OS === 'web' ? '50%' : '100%',
  },
  add: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
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
