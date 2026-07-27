import React, { useState, useMemo } from 'react';
import { FlatList, Platform, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import caloriesDb from '@/assets/calories.json';

type CaloriesEntry = {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
};

const db: CaloriesEntry[] = caloriesDb as CaloriesEntry[];

function ProductRow({ item }: { item: CaloriesEntry }) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.rowName}>{item.name}</ThemedText>
      <View style={styles.macroRow}>
        <View style={styles.macroItem}>
          <ThemedText style={styles.macroValue}>{item.calories}</ThemedText>
          <ThemedText style={styles.macroLabel}>kcal</ThemedText>
        </View>
        <View style={styles.macroItem}>
          <ThemedText style={styles.macroValue}>{item.protein} g</ThemedText>
          <ThemedText style={styles.macroLabel}>białko</ThemedText>
        </View>
        <View style={styles.macroItem}>
          <ThemedText style={styles.macroValue}>{item.fat} g</ThemedText>
          <ThemedText style={styles.macroLabel}>tłuszcze</ThemedText>
        </View>
        <View style={styles.macroItem}>
          <ThemedText style={styles.macroValue}>
            {item.carbohydrates} g
          </ThemedText>
          <ThemedText style={styles.macroLabel}>węgle</ThemedText>
        </View>
      </View>
    </View>
  );
}

export default function CaloriesSearch() {
  const { top } = useSafeAreaInsets();
  const theme = useColorScheme() ?? 'light';
  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    'text',
  );
  const [keyword, setKeyword] = useState('');

  const results = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) {
      return db;
    }
    return db.filter(e => e.name.toLowerCase().includes(q));
  }, [keyword]);

  return (
    <ThemedView
      style={[
        styles.container,
        Platform.OS === 'web' ? { paddingTop: 32 } : {},
      ]}>
      <ThemedView style={[styles.titleContainer, { paddingTop: top }]}>
        <ThemedText type="title">Kalorie</ThemedText>
      </ThemedView>

      <TextInput
        value={keyword}
        onChangeText={setKeyword}
        placeholder="Szukaj produktu..."
        placeholderTextColor={theme === 'light' ? '#aaa' : '#666'}
        style={[styles.input, { color }]}
      />
      <ThemedText style={styles.count}>
        {results.length === db.length
          ? `${db.length} produktów`
          : `${results.length} z ${db.length} produktów`}
      </ThemedText>

      <FlatList
        data={results}
        keyExtractor={item => item.name}
        renderItem={({ item }) => <ProductRow item={item} />}
        contentContainerStyle={{ paddingBottom: 150 }}
        keyboardShouldPersistTaps="handled"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === 'web' ? 32 : 10,
    gap: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  input: {
    padding: 14,
    borderRadius: 8,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    fontSize: 16,
  },
  count: {
    fontSize: 12,
    opacity: 0.5,
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 6,
  },
  rowName: {
    fontSize: 14,
    fontWeight: '500',
  },
  macroRow: {
    flexDirection: 'row',
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  macroLabel: {
    fontSize: 10,
    opacity: 0.5,
  },
});
