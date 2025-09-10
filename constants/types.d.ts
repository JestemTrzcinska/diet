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
