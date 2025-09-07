import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AIConfig, ResponsiveDimensions } from '../../types/chat';
import { AI_CONFIGS } from '../../utils/constants';

interface AISelectorProps {
  selectedAI: string;
  onSelectAI: (ai: string) => void;
  dimensions: ResponsiveDimensions;
  colors: any;
}

export const AISelector: React.FC<AISelectorProps> = ({ 
  selectedAI, 
  onSelectAI, 
  dimensions, 
  colors 
}) => {
  return (
    <View style={[styles.container, {
      backgroundColor: colors.background,
      borderRadius: dimensions.borderRadius.small,
      padding: dimensions.spacing.small / 2,
      marginBottom: dimensions.spacing.medium,
      height: dimensions.isDesktop ? 48 : dimensions.buttonHeight + 16,
      maxWidth: dimensions.isDesktop ? 400 : undefined,
      alignSelf: 'center',
    }]}>
      {Object.entries(AI_CONFIGS).map(([key, config]) => (
        <TouchableOpacity
          key={key}
          style={[styles.button, {
            flex: 1,
            backgroundColor: selectedAI === key ? config.color : 'transparent',
            paddingVertical: dimensions.isDesktop ? 8 : dimensions.spacing.medium,
            paddingHorizontal: dimensions.spacing.small,
            borderRadius: dimensions.borderRadius.small,
            marginHorizontal: 2,
            height: dimensions.isDesktop ? 40 : dimensions.buttonHeight,
            justifyContent: 'center',
          }]}
          onPress={() => onSelectAI(key)}
        >
          <View style={styles.content}>
            <Text style={{ 
              fontSize: dimensions.isDesktop ? 14 : dimensions.fontSize.medium, 
              marginBottom: 2 
            }}>
              {config.avatar}
            </Text>
            <Text style={[styles.text, { 
              color: selectedAI === key ? '#ffffff' : colors.text,
              fontWeight: selectedAI === key ? 'bold' : 'normal',
              fontSize: dimensions.fontSize.tiny,
            }]}>
              {config.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
});