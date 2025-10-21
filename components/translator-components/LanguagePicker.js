import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Animated,
  StyleSheet,
  Platform 
} from 'react-native';

const LanguagePicker = ({ value, onValueChange, languages, colors }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerAnim = useRef(new Animated.Value(0)).current;
  
  const selectedLanguage = languages.find(lang => lang.code === value);
  
  useEffect(() => {
    Animated.spring(pickerAnim, {
      toValue: showPicker ? 1 : 0,
      tension: 120,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [showPicker]);

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      zIndex: 9999,
    },
    select: {
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.background,
      minWidth: 100,
      flexDirection: 'row',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
        web: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        },
      }),
    },
    selectText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '600',
    },
    pickerModal: {
      position: 'absolute',
      top: 42,
      right: 0,
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      minWidth: 140,
      maxHeight: 200,
      zIndex: 99999,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        android: {
          elevation: 10,
        },
        web: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        },
      }),
    },
    pickerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    pickerItemSelected: {
      backgroundColor: colors.primary + '15',
    },
    pickerItemText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 6,
    },
  });
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.select} 
        onPress={() => setShowPicker(!showPicker)}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 12, marginRight: 6 }}>
          {selectedLanguage?.flag}
        </Text>
        <Text style={styles.selectText}>
          {selectedLanguage?.name || 'Выберите язык'}
        </Text>
      </TouchableOpacity>
      
      {showPicker && (
        <Animated.View 
          style={[
            styles.pickerModal,
            {
              opacity: pickerAnim,
              transform: [
                {
                  translateY: pickerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
                {
                  scale: pickerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            }
          ]}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {languages.map((lang, index) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.pickerItem,
                  index === languages.length - 1 && { borderBottomWidth: 0 },
                  lang.code === value && styles.pickerItemSelected,
                ]}
                onPress={() => {
                  onValueChange(lang.code);
                  setShowPicker(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 14 }}>{lang.flag}</Text>
                <Text style={styles.pickerItemText}>
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

export default LanguagePicker;