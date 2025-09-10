import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface Props {
  type: string;
  activeType: string;
  setActiveType: (type: string) => void;
}
export const Chip = ({ type, activeType, setActiveType }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.chip, activeType === type && styles.activeChip]}
      onPress={() => setActiveType(type)}>
      <ThemedText style={styles.chipText}>{type}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
    marginBottom: 10,
  },
  activeChip: {
    backgroundColor: 'dodgerblue',
  },
  chipText: {
    color: '#333',
    textTransform: 'capitalize',
  },
});
