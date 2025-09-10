import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MealState } from '@/constants/types';

type SelectedMealsContextType = {
  selectedMeals: MealState[];
  addToList: (meal: MealState) => void;
  deleteFromList: (meal: MealState) => void;
};

const Context = createContext<SelectedMealsContextType | undefined>(undefined);

export const SelectedMealsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedMeals, setSelectedMeals] = useState<MealState[]>([]);

  const addToList = (meal: MealState) => {
    setSelectedMeals(prev => [...prev, meal]);
  };

  const deleteFromList = (meal: MealState) => {
    setSelectedMeals(prev => prev.filter(item => item !== meal));
  };

  const value = { selectedMeals, addToList, deleteFromList };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useSelectedMeals = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSelectedMeals must be used within a SelectedMealsProvider');
  }
  return context;
};
