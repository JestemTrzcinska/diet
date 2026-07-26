import caloriesDb from '@/assets/calories.json';
import { MealState, DayPackTotals } from '@/constants/types';

type CaloriesEntry = {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
};

const db: CaloriesEntry[] = caloriesDb as CaloriesEntry[];

export function calcNutrition(meals: MealState[]): DayPackTotals {
  let calories = 0;
  let protein = 0;
  let fat = 0;
  let carbohydrates = 0;

  for (const meal of meals) {
    for (const product of meal.products) {
      const entry = db.find(e => e.name === product.name);
      if (!entry) {
        continue;
      }
      const ratio = product.grams / 100;
      calories += entry.calories * ratio;
      protein += entry.protein * ratio;
      fat += entry.fat * ratio;
      carbohydrates += entry.carbohydrates * ratio;
    }
  }

  return {
    calories: Math.round(calories * 10) / 10,
    protein: Math.round(protein * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    carbohydrates: Math.round(carbohydrates * 10) / 10,
  };
}
