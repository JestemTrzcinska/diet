import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DayPack, MealState } from '@/constants/types';
import { calcNutrition } from '@/utils/calcNutrition';

const STORAGE_KEY = 'day_packs';

type PacksContextType = {
  packs: DayPack[];
  savePack: (meals: MealState[], name?: string) => Promise<void>;
  deletePack: (id: string) => Promise<void>;
  renamePack: (id: string, newName: string) => Promise<void>;
};

const PacksContext = createContext<PacksContextType | undefined>(undefined);

function generateDefaultName(): string {
  const now = new Date();
  return (
    now.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }) +
    ', ' +
    now.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    })
  );
}

export const PacksProvider = ({ children }: { children: ReactNode }) => {
  const [packs, setPacks] = useState<DayPack[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try {
          setPacks(JSON.parse(raw));
        } catch {
          // corrupted data — start fresh
        }
      }
    });
  }, []);

  async function persist(updated: DayPack[]) {
    setPacks(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  async function savePack(meals: MealState[], name?: string) {
    const pack: DayPack = {
      id: Date.now().toString(),
      name: name ?? generateDefaultName(),
      createdAt: new Date().toISOString(),
      meals,
      totals: calcNutrition(meals),
    };
    await persist([pack, ...packs]);
  }

  async function deletePack(id: string) {
    await persist(packs.filter(p => p.id !== id));
  }

  async function renamePack(id: string, newName: string) {
    await persist(packs.map(p => (p.id === id ? { ...p, name: newName } : p)));
  }

  return (
    <PacksContext.Provider value={{ packs, savePack, deletePack, renamePack }}>
      {children}
    </PacksContext.Provider>
  );
};

export const usePacks = () => {
  const ctx = useContext(PacksContext);
  if (!ctx) {
    throw new Error('usePacks must be used within a PacksProvider');
  }
  return ctx;
};
