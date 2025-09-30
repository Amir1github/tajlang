import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import { SortOption } from '@/types/filters';

interface SortSelectorProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
  colors: any;
  t: (key: string) => string;
}

const sortOptions: { value: SortOption; label: string; icon: string }[] = [
  { value: 'xp_desc', label: 'XP (high to low)', icon: '⬇️' },
  { value: 'xp_asc', label: 'XP (low to high)', icon: '⬆️' },
  { value: 'streak_desc', label: 'Streak (high to low)', icon: '🔥' },
  { value: 'streak_asc', label: 'Streak (low to high)', icon: '🔥' },
  { value: 'last_seen', label: 'Recently online', icon: '🟢' },
  { value: 'username', label: 'Username (A-Z)', icon: '🔤' },
];

export function SortSelector({ value, onChange, colors, t }: SortSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  
  const selectedOption = sortOptions.find(opt => opt.value === value);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { 
          backgroundColor: colors.cardBackground || colors.background,
          borderColor: colors.border || colors.textSecondary + '30',
        }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>
          {selectedOption?.icon} {t('sort')}
        </Text>
        <Text style={[styles.arrow, { color: colors.textSecondary }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View 
            style={[styles.modalContent, { backgroundColor: colors.cardBackground || colors.background }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('sort_by')}
            </Text>
            <ScrollView style={styles.optionsList}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    value === option.value && styles.selectedOption,
                    { borderBottomColor: colors.border || colors.textSecondary + '20' }
                  ]}
                  onPress={() => {
                    onChange(option.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionIcon, { color: colors.text }]}>
                    {option.icon}
                  </Text>
                  <Text style={[
                    styles.optionText, 
                    { color: colors.text },
                    value === option.value && styles.selectedText
                  ]}>
                    {option.label}
                  </Text>
                  {value === option.value && (
                    <Text style={[styles.checkmark, { color: colors.primary || '#007AFF' }]}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 140,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 10,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    maxHeight: '70%',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  selectedOption: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  selectedText: {
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});