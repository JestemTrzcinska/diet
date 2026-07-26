import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { usePacks } from '@/context/PacksContext';
import { DayPack } from '@/constants/types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

function MacroRow({ totals }: { totals: DayPack['totals'] }) {
  return (
    <View style={styles.macroRow}>
      <View style={styles.macroItem}>
        <ThemedText style={styles.macroValue}>{totals.calories}</ThemedText>
        <ThemedText style={styles.macroLabel}>kcal</ThemedText>
      </View>
      <View style={styles.macroItem}>
        <ThemedText style={styles.macroValue}>{totals.protein} g</ThemedText>
        <ThemedText style={styles.macroLabel}>białko</ThemedText>
      </View>
      <View style={styles.macroItem}>
        <ThemedText style={styles.macroValue}>{totals.fat} g</ThemedText>
        <ThemedText style={styles.macroLabel}>tłuszcze</ThemedText>
      </View>
      <View style={styles.macroItem}>
        <ThemedText style={styles.macroValue}>
          {totals.carbohydrates} g
        </ThemedText>
        <ThemedText style={styles.macroLabel}>węgle</ThemedText>
      </View>
    </View>
  );
}

function PackCard({ pack }: { pack: DayPack }) {
  const { deletePack, renamePack } = usePacks();
  const theme = useColorScheme() ?? 'light';
  const iconColor = theme === 'light' ? Colors.light.text : Colors.dark.text;
  const [expanded, setExpanded] = useState(false);

  const createdDate = new Date(pack.createdAt).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleRename = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Zmień nazwę',
        '',
        newName => {
          if (newName && newName.trim()) {
            renamePack(pack.id, newName.trim());
          }
        },
        'plain-text',
        pack.name,
      );
    } else {
      Alert.alert('Zmiana nazwy', 'Funkcja dostępna na iOS');
    }
  };

  const handleDelete = () => {
    Alert.alert('Usuń paczkę', `Czy na pewno chcesz usunąć "${pack.name}"?`, [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () => deletePack(pack.id),
      },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleGroup}>
          <ThemedText style={styles.cardTitle}>{pack.name}</ThemedText>
          <ThemedText style={styles.cardDate}>{createdDate}</ThemedText>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={handleRename} style={styles.iconButton}>
            <MaterialIcons name="edit" size={20} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
            <MaterialIcons name="delete-outline" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      <MacroRow totals={pack.totals} />

      <TouchableOpacity
        onPress={() => setExpanded(e => !e)}
        style={styles.expandButton}>
        <ThemedText style={styles.expandLabel}>
          {expanded ? 'Ukryj posiłki' : `Pokaż posiłki (${pack.meals.length})`}
        </ThemedText>
        <MaterialIcons
          name={expanded ? 'expand-less' : 'expand-more'}
          size={20}
          color={iconColor}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.mealsList}>
          {pack.meals.map((meal, idx) => (
            <View key={idx} style={styles.mealRow}>
              <ThemedText style={styles.mealType}>{meal.type}</ThemedText>
              <ThemedText style={styles.mealName}>{meal.name}</ThemedText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function Packages() {
  const { packs } = usePacks();
  const { top } = useSafeAreaInsets();

  return (
    <ThemedView
      style={[
        styles.container,
        Platform.OS === 'web' ? { paddingTop: 32 } : {},
      ]}>
      <ThemedView style={[styles.titleContainer, { paddingTop: top }]}>
        <ThemedText type="title">Paczki</ThemedText>
      </ThemedView>
      <FlatList
        data={packs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PackCard pack={item} />}
        contentContainerStyle={{ paddingBottom: 150 }}
        ListEmptyComponent={
          <ThemedText style={styles.empty}>
            Brak paczek. Zapisz plan dnia z listy wybranych posiłków.
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === 'web' ? 32 : 10,
    gap: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  empty: {
    marginTop: 32,
    textAlign: 'center',
    opacity: 0.5,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitleGroup: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardDate: {
    fontSize: 12,
    opacity: 0.5,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    padding: 4,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  macroLabel: {
    fontSize: 11,
    opacity: 0.6,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expandLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  mealsList: {
    gap: 4,
    paddingTop: 4,
  },
  mealRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  mealType: {
    fontSize: 11,
    opacity: 0.5,
    minWidth: 90,
  },
  mealName: {
    fontSize: 13,
    flex: 1,
  },
});
