import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Animated,
  StyleSheet 
} from 'react-native';

const LanguagePicker = ({ value, onValueChange, languages, colors }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerAnim = useRef(new Animated.Value(0)).current;
  
  const selectedLanguage = languages.find(lang => lang.code === value);
  
  useEffect(() => {
    Animated.timing(pickerAnim, {
      toValue: showPicker ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showPicker]);

  const styles = StyleSheet.create({
    select: {
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.background,
      minWidth: 100,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    selectText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '600',
    },
    pickerModal: {
      position: 'absolute',
      top: 36,
      right: 0,
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 1000,
      minWidth: 140,
      maxHeight: 200,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    pickerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    pickerItemText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 6,
    },
  });
  
  return (
    <View>
      <TouchableOpacity 
        style={styles.select} 
        onPress={() => setShowPicker(!showPicker)}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, marginRight: 6 }}>
            {selectedLanguage?.flag}
          </Text>
          <Text style={styles.selectText}>
            {selectedLanguage?.name || 'Выберите язык'}
          </Text>
        </View>
      </TouchableOpacity>
      
      {showPicker && (
        <Animated.View 
          style={[
            styles.pickerModal,
            {
              opacity: pickerAnim,
              transform: [
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
          <ScrollView showsVerticalScrollIndicator={false}>
            {languages.map((lang, index) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.pickerItem,
                  index === languages.length - 1 && { borderBottomWidth: 0 }
                ]}
                onPress={() => {
                  onValueChange(lang.code);
                  setShowPicker(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 12 }}>{lang.flag}</Text>
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