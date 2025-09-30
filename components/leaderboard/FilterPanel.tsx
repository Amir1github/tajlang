import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, Switch } from 'react-native';
import { useState } from 'react';
import { FilterOptions } from '@/types/filters';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onResetFilters: () => void;
  colors: any;
  t: (key: string) => string;
}

export function FilterPanel({ filters, onFiltersChange, onResetFilters, colors, t }: FilterPanelProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const hasActiveFilters = 
    filters.minXP !== undefined ||
    filters.maxXP !== undefined ||
    filters.minStreak !== undefined ||
    filters.onlineStatus !== undefined ||
    filters.wantChats !== undefined ||
    filters.location !== undefined;

  const handleApply = () => {
    onFiltersChange(localFilters);
    setModalVisible(false);
  };

  const handleReset = () => {
    const emptyFilters: FilterOptions = {
      minXP: undefined,
      maxXP: undefined,
      minStreak: undefined,
      onlineStatus: undefined,
      wantChats: undefined,
      location: undefined,
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const handleOpen = () => {
    setLocalFilters(filters);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button, 
          { 
            backgroundColor: hasActiveFilters 
              ? (colors.primary || '#007AFF') + '20'
              : colors.cardBackground || colors.background,
            borderColor: hasActiveFilters
              ? colors.primary || '#007AFF'
              : colors.border || colors.textSecondary + '30',
          }
        ]}
        onPress={handleOpen}
      >
        <Text style={[styles.buttonText, { 
          color: hasActiveFilters ? colors.primary || '#007AFF' : colors.text 
        }]}>
          🎯 {t('filters')}
        </Text>
        {hasActiveFilters && (
          <View style={[styles.badge, { backgroundColor: colors.primary || '#007AFF' }]}>
            <Text style={styles.badgeText}>●</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground || colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('filters')}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filtersList} showsVerticalScrollIndicator={false}>
              {/* XP Range */}
              <View style={styles.filterSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  ⭐ {t('xp_points')}
                </Text>
                <View style={styles.rangeInputs}>
                  <View style={styles.inputWrapper}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                      {t('min')}
                    </Text>
                    <TextInput
                      style={[styles.input, { 
                        color: colors.text,
                        borderColor: colors.border || colors.textSecondary + '30',
                        backgroundColor: colors.background,
                      }]}
                      value={localFilters.minXP?.toString() || ''}
                      onChangeText={(text) => setLocalFilters({
                        ...localFilters,
                        minXP: text ? parseInt(text) : undefined
                      })}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                  <Text style={[styles.rangeSeparator, { color: colors.textSecondary }]}>—</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                      {t('max')}
                    </Text>
                    <TextInput
                      style={[styles.input, { 
                        color: colors.text,
                        borderColor: colors.border || colors.textSecondary + '30',
                        backgroundColor: colors.background,
                      }]}
                      value={localFilters.maxXP?.toString() || ''}
                      onChangeText={(text) => setLocalFilters({
                        ...localFilters,
                        maxXP: text ? parseInt(text) : undefined
                      })}
                      keyboardType="numeric"
                      placeholder="∞"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>
              </View>

              {/* Streak */}
              <View style={styles.filterSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  🔥 {t('min_streak')}
                </Text>
                <TextInput
                  style={[styles.input, { 
                    color: colors.text,
                    borderColor: colors.border || colors.textSecondary + '30',
                    backgroundColor: colors.background,
                  }]}
                  value={localFilters.minStreak?.toString() || ''}
                  onChangeText={(text) => setLocalFilters({
                    ...localFilters,
                    minStreak: text ? parseInt(text) : undefined
                  })}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              {/* Online Status */}
              <View style={styles.filterSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  🟢 {t('online_status')}
                </Text>
                <View style={styles.statusButtons}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      { borderColor: colors.border || colors.textSecondary + '30' },
                      localFilters.onlineStatus === 'online' && { 
                        backgroundColor: colors.primary || '#007AFF',
                        borderColor: colors.primary || '#007AFF',
                      }
                    ]}
                    onPress={() => setLocalFilters({
                      ...localFilters,
                      onlineStatus: localFilters.onlineStatus === 'online' ? undefined : 'online'
                    })}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      { color: localFilters.onlineStatus === 'online' ? '#fff' : colors.text }
                    ]}>
                      {t('online')}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      { borderColor: colors.border || colors.textSecondary + '30' },
                      localFilters.onlineStatus === 'offline' && { 
                        backgroundColor: colors.textSecondary,
                        borderColor: colors.textSecondary,
                      }
                    ]}
                    onPress={() => setLocalFilters({
                      ...localFilters,
                      onlineStatus: localFilters.onlineStatus === 'offline' ? undefined : 'offline'
                    })}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      { color: localFilters.onlineStatus === 'offline' ? '#fff' : colors.text }
                    ]}>
                      {t('offline')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Want Chats */}
              <View style={styles.filterSection}>
                <View style={styles.switchRow}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    💬 {t('want_to_chat')}
                  </Text>
                  <Switch
                    value={localFilters.wantChats === true}
                    onValueChange={(value) => setLocalFilters({
                      ...localFilters,
                      wantChats: value ? true : undefined
                    })}
                    trackColor={{ 
                      false: colors.textSecondary + '40', 
                      true: colors.primary || '#007AFF' 
                    }}
                    thumbColor="#fff"
                  />
                </View>
              </View>

              {/* Location (готово к использованию) */}
              <View style={styles.filterSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  📍 {t('location')}
                </Text>
                <TextInput
                  style={[styles.input, { 
                    color: colors.text,
                    borderColor: colors.border || colors.textSecondary + '30',
                    backgroundColor: colors.background,
                  }]}
                  value={localFilters.location || ''}
                  onChangeText={(text) => setLocalFilters({
                    ...localFilters,
                    location: text || undefined
                  })}
                  placeholder={t('enter_location')}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.resetButton, { borderColor: colors.border || colors.textSecondary + '30' }]}
                onPress={handleReset}
              >
                <Text style={[styles.resetButtonText, { color: colors.text }]}>
                  {t('reset')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: colors.primary || '#007AFF' }]}
                onPress={handleApply}
              >
                <Text style={styles.applyButtonText}>
                  {t('apply')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 120,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 8,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  closeButton: {
    fontSize: 28,
    fontWeight: '300',
  },
  filtersList: {
    paddingHorizontal: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  rangeSeparator: {
    fontSize: 18,
    paddingTop: 18,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});