export interface ProductState {
  name: string;
  grams: number;
  quantity: string;
}

export interface MealState {
  name: string;
  description: string;
  type: string;
  products: ProductState[];
}

export interface Nutrition {
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface DayPackTotals {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}

export interface DayPack {
  id: string;
  name: string;
  createdAt: string;
  meals: MealState[];
  totals: DayPackTotals;
}
