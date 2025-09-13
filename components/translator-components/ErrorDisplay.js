import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const ErrorDisplay = ({ error, colors }) => {
  const errorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(errorAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(errorAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [error]);

  const styles = StyleSheet.create({
    errorContainer: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    errorText: {
      color: '#ef4444',
      textAlign: 'center',
      fontSize: 12,
      fontWeight: '600',
    },
  });

  if (!error) return null;

  return (
    <Animated.View 
      style={[
        styles.errorContainer,
        {
          opacity: errorAnim,
          transform: [
            {
              translateY: errorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-10, 0],
              }),
            },
          ],
        }
      ]}
    >
      <Text style={styles.errorText}>❌ {error}</Text>
    </Animated.View>
  );
};

export default ErrorDisplay;