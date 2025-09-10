import { MealState } from '@/constants/types';

const meals: MealState[] = require('@/assets/dieta-gem.json');

export const useFilteredMeals = (keyword: string, activeType: string) => {
  return meals.filter(meal => {
    const isMatchingType = activeType === 'all' || meal.type === activeType;
    const isMatchingName = meal.name
      .toLowerCase()
      .includes(keyword.toLowerCase());
    const isMatchingProducts = meal.products.some(product =>
      product.name.toLowerCase().includes(keyword.toLowerCase()),
    );

    return isMatchingType && (isMatchingName || isMatchingProducts);
  });
  // .sort((a, b) => {
  //   if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  //   if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  //   return 0;
  // });
};
