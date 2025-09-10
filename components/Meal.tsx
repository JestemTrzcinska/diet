import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MealState, ProductState } from '@/app/types';
import { Platform, StyleSheet } from 'react-native';

export const Meal = ({ item }: { item: MealState }) => {
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
      {item.products.map((product: ProductState, index: number) => (
        <ThemedView key={index} style={styles.productContainer}>
          <ThemedText style={styles.productText}>{product.name}</ThemedText>
          <ThemedText style={styles.productText}>
            {product.grams} gramów
          </ThemedText>
          <ThemedText style={styles.productText}>{product.quantity}</ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  mealContainer: {
    gap: 8,
    padding: Platform.OS === 'web' ? 15 : 5,
    paddingVertical: 20,
    width: Platform.OS === 'web' ? '50%' : '100%',
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
