import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface Props {
  type: string;
  activeType: string;
  setActiveType: (type: string) => void;
}
export const Chip = ({ type, activeType, setActiveType }: Props) => (
  <TouchableOpacity
    style={[styles.chip, activeType === type && styles.activeChip]}
    onPress={() => setActiveType(type)}>
    <ThemedText style={styles.chipText}>{type}</ThemedText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    minHeight: 36,
    minWidth: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeChip: {
    backgroundColor: '#1e88e5',
  },
  chipText: {
    color: '#333333',
    textTransform: 'capitalize',
    fontSize: 14,
    fontWeight: '500',
  },
});
