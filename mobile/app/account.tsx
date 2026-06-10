/**
 * Account Screen — User Profile for Mawaeedak Mobile
 * 
 * Features:
 * - Profile information display
 * - Edit name, city
 * - Theme toggle (future)
 * - Logout
 */

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Theme colors
const GOLD = '#C9A063';
const BROWN = '#8A6B3D';
const INK = '#2F2B25';
const PAPER = '#FAF7F2';
const CREAM = '#F5EFE4';
const TEXT_SECONDARY = '#6F6557';

// Mock User Data
const MOCK_USER = {
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  city: 'الرياض',
  role: 'user',
};

// Input Field Component
function InputField({ label, value, onChangeText, editable = true, icon }: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  icon?: string;
}) {
  return (
    <View style={styles.inputField}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        {icon && <Text style={styles.inputIcon}>{icon}</Text>}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          placeholderTextColor={TEXT_SECONDARY}
        />
        {editable && <Feather name="edit-2" size={16} color={TEXT_SECONDARY} />}
      </View>
    </View>
  );
}

// Info Row Component
function InfoRow({ label, value, icon }: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function AccountScreen() {
  const [name, setName] = useState(MOCK_USER.name);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [city, setCity] = useState(MOCK_USER.city);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('تم', 'تم حفظ التغييرات بنجاح');
  };

  const handleCancel = () => {
    setName(MOCK_USER.name);
    setCity(MOCK_USER.city);
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    Alert.alert('تغيير كلمة المرور', 'سيتم إرسال رابط تغيير كلمة المرور إلى بريدك الإلكتروني');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'حذف الحساب',
      'هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حذف', style: 'destructive', onPress: () => Alert.alert('تم', 'تم حذف الحساب') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        {/* Profile Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>المعلومات الشخصية</Text>
          
          <InputField
            label="الاسم"
            value={name}
            onChangeText={setName}
            editable={isEditing}
            icon="👤"
          />
          
          <InputField
            label="البريد الإلكتروني"
            value={email}
            onChangeText={setEmail}
            editable={false}
            icon="✉️"
          />
          
          <InputField
            label="المدينة"
            value={city}
            onChangeText={setCity}
            editable={isEditing}
            icon="📍"
          />
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات الحساب</Text>
          <View style={styles.infoList}>
            <InfoRow label="نوع الحساب" value="مستخدم" icon="🎫" />
            <InfoRow label="تاريخ التسجيل" value="يناير 2026" icon="📅" />
            <InfoRow label="الحالة" value="نشط" icon="✅" />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Pressable style={styles.actionButton} onPress={handleChangePassword}>
            <View style={styles.actionIcon}>
              <Feather name="lock" size={20} color={BROWN} />
            </View>
            <Text style={styles.actionText}>تغيير كلمة المرور</Text>
            <Feather name="chevron-left" size={20} color={TEXT_SECONDARY} />
          </Pressable>
          
          <Pressable style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Feather name="bell" size={20} color={BROWN} />
            </View>
            <Text style={styles.actionText}>إعدادات الإشعارات</Text>
            <Feather name="chevron-left" size={20} color={TEXT_SECONDARY} />
          </Pressable>
        </View>

        {/* Edit/Save Buttons */}
        <View style={styles.editActions}>
          {isEditing ? (
            <>
              <Pressable style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>حفظ التغييرات</Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Feather name="edit-2" size={18} color="#FFFFFF" />
              <Text style={styles.editButtonText}>تعديل الملف الشخصي</Text>
            </Pressable>
          )}
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>منطقة الخطر</Text>
          <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Feather name="trash-2" size={18} color="#B9483F" />
            <Text style={styles.deleteButtonText}>حذف الحساب</Text>
          </Pressable>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAPER,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: INK,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    color: TEXT_SECONDARY,
  },
  form: {
    backgroundColor: CREAM,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: INK,
    marginBottom: 20,
  },
  inputField: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_SECONDARY,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PAPER,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(201,160,99,0.15)',
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: INK,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_SECONDARY,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoList: {
    backgroundColor: CREAM,
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201,160,99,0.08)',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: PAPER,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: INK,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CREAM,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: PAPER,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: INK,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GOLD,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: CREAM,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },
  saveButton: {
    flex: 1,
    backgroundColor: GOLD,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dangerZone: {
    backgroundColor: '#B9483F10',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(185,72,63,0.20)',
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B9483F',
    marginBottom: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B9483F15',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#B9483F',
  },
});