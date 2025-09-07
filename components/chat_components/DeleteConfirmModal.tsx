import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { ResponsiveDimensions } from '@/types/chat';

interface DeleteConfirmModalProps {
  visible: boolean;
  dimensions: ResponsiveDimensions;
  colors: any;
  t: (key: string) => string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  dimensions,
  colors,
  t,
  onCancel,
  onConfirm
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={[{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }]}>
        <View style={[{
          backgroundColor: colors.card,
          borderRadius: dimensions.borderRadius.large,
          padding: dimensions.spacing.large,
          margin: dimensions.spacing.large,
          maxWidth: dimensions.isTablet ? 400 : dimensions.width - (dimensions.spacing.large * 2),
          width: '100%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          alignItems: 'center',
        }]}>
          <Text style={[{
            fontSize: dimensions.fontSize.large, 
            color: colors.text,
            textAlign: 'center',
            marginBottom: dimensions.spacing.medium,
            fontWeight: 'bold',
          }]}>
            {t('deleteChat')}
          </Text>
          <Text style={[{
            fontSize: dimensions.fontSize.medium, 
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: dimensions.spacing.large,
            lineHeight: dimensions.fontSize.medium * 1.4,
          }]}>
            Вы уверены, что хотите удалить этот чат? Это действие нельзя отменить.
          </Text>
          <View style={[{
            flexDirection: dimensions.isTablet ? 'row' : 'column',
            gap: dimensions.spacing.medium,
            width: '100%',
          }]}>
            <TouchableOpacity
              style={[{
                flex: dimensions.isTablet ? 1 : undefined,
                backgroundColor: colors.border,
                paddingVertical: dimensions.spacing.medium,
                borderRadius: dimensions.borderRadius.small,
                minHeight: 44,
                justifyContent: 'center',
              }]}
              onPress={onCancel}
            >
              <Text style={[{
                color: colors.text, 
                fontSize: dimensions.fontSize.medium,
                textAlign: 'center',
                fontWeight: 'bold',
              }]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[{
                flex: dimensions.isTablet ? 1 : undefined,
                backgroundColor: '#DC3545',
                paddingVertical: dimensions.spacing.medium,
                borderRadius: dimensions.borderRadius.small,
                minHeight: 44,
                justifyContent: 'center',
              }]}
              onPress={onConfirm}
            >
              <Text style={[{
                color: '#ffffff', 
                fontSize: dimensions.fontSize.medium,
                textAlign: 'center',
                fontWeight: 'bold',
              }]}>
                {t('delete')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};