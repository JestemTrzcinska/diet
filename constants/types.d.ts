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
