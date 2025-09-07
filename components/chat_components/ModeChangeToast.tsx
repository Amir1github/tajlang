import React from 'react';
import { View, Text, Animated } from 'react-native';
import { ResponsiveDimensions } from '@/types/chat';
import { AI_CONFIGS, AMEENA_MODES } from '@/utils/constants';

interface ModeChangeToastProps {
  visible: boolean;
  selectedMode: string;
  dimensions: ResponsiveDimensions;
  t: (key: string) => string;
  toastAnim: Animated.Value;
}

export const ModeChangeToast: React.FC<ModeChangeToastProps> = ({
  visible,
  selectedMode,
  dimensions,
  t,
  toastAnim
}) => {
  if (!visible) return null;

  return (
    <Animated.View
      style={[{
        position: 'absolute',
        bottom: dimensions.isTablet ? 120 : 100,
        right: dimensions.spacing.large,
        backgroundColor: AI_CONFIGS.ameena.color,
        paddingHorizontal: dimensions.spacing.medium,
        paddingVertical: dimensions.spacing.medium,
        borderRadius: dimensions.borderRadius.medium,
        maxWidth: dimensions.width * 0.8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        transform: [
          {
            scale: toastAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          },
        ],
        opacity: toastAnim,
      }]}
    >
      <View style={[{
        flexDirection: 'row',
        alignItems: 'center',
      }]}>
        <Text style={[{
          fontSize: dimensions.fontSize.medium,
          marginRight: 8
        }]}>
          ✅
        </Text>
        <View style={{ flex: 1 }}>
          <Text style={[{
            color: '#ffffff', 
            fontSize: dimensions.fontSize.small,
            fontWeight: 'bold',
          }]}>
            {t('modeChanged')}
          </Text>
          <Text style={[{
            color: '#ffffff', 
            fontSize: dimensions.fontSize.tiny, 
            opacity: 0.9 
          }]}>
            {AMEENA_MODES[selectedMode]?.title}: {AMEENA_MODES[selectedMode]?.description}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};