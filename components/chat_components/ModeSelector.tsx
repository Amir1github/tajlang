import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ResponsiveDimensions } from '@/types/chat';
import { AI_CONFIGS, AMEENA_MODES } from '@/utils/constants';

interface ModeSelectorProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  dimensions: ResponsiveDimensions;
  colors: any;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ 
  selectedMode, 
  onSelectMode, 
  dimensions, 
  colors 
}) => {
  const modesPerRow = dimensions.isDesktop ? 5 : dimensions.isTablet ? 3 : 2;
  const modeEntries = Object.entries(AMEENA_MODES);
  const rows = [];
  
  for (let i = 0; i < modeEntries.length; i += modesPerRow) {
    rows.push(modeEntries.slice(i, i + modesPerRow));
  }

  return (
    <View style={[styles.container, {
      backgroundColor: colors.background,
      borderRadius: dimensions.borderRadius.small,
      padding: dimensions.spacing.small,
      marginBottom: dimensions.spacing.small,
      maxWidth: dimensions.isDesktop ? 600 : undefined,
      alignSelf: 'center',
    }]}>
      <Text style={[styles.title, { 
        fontSize: dimensions.fontSize.small, 
        color: colors.text, 
        marginBottom: dimensions.spacing.small,
        textAlign: 'center',
      }]}>
        Режим работы
      </Text>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.row, { 
          marginBottom: rowIndex < rows.length - 1 ? dimensions.spacing.small : 0 
        }]}>
          {row.map(([key, mode]) => (
            <TouchableOpacity
              key={key}
              style={[styles.button, {
                flex: 1,
                backgroundColor: selectedMode === key ? AI_CONFIGS.ameena.color : colors.card,
                paddingHorizontal: dimensions.spacing.small,
                paddingVertical: dimensions.isDesktop ? 4 : dimensions.spacing.small,
                borderRadius: dimensions.borderRadius.small,
                borderWidth: 1,
                borderColor: selectedMode === key ? AI_CONFIGS.ameena.color : colors.border,
                marginHorizontal: dimensions.spacing.small / 2,
                height: dimensions.isDesktop ? 28 : 32,
                justifyContent: 'center',
              }]}
              onPress={() => onSelectMode(key)}
            >
              <Text style={[styles.buttonText, { 
                color: selectedMode === key ? '#ffffff' : colors.text,
                fontSize: dimensions.fontSize.tiny,
                fontWeight: selectedMode === key ? 'bold' : 'normal'
              }]}>
                {mode.title}
              </Text>
            </TouchableOpacity>
          ))}
          {row.length < modesPerRow && (
            <View style={{ flex: modesPerRow - row.length }} />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Mode selector container styles
  },
  title: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
});