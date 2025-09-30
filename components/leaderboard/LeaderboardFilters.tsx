import { View, StyleSheet, Platform } from 'react-native';
import { FilterOptions, SortOption } from '@/types/filters';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import { SortSelector } from './SortSelector';

interface LeaderboardFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onResetFilters: () => void;
  colors: any;
  t: (key: string) => string;
}

export function LeaderboardFilters({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  sortOption,
  onSortChange,
  onResetFilters,
  colors,
  t,
}: LeaderboardFiltersProps) {
  return (
    <View style={styles.filtersContainer}>
      <SearchBar
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder={t('search_by_username')}
        colors={colors}
      />
      
      <View style={styles.controlsRow}>
        <SortSelector
          value={sortOption}
          onChange={onSortChange}
          colors={colors}
          t={t}
        />
        
        <FilterPanel
          filters={filters}
          onFiltersChange={onFiltersChange}
          onResetFilters={onResetFilters}
          colors={colors}
          t={t}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    marginBottom: 16,
    gap: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
});