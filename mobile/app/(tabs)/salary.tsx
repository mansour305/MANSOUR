/**
 * Salary Screen — Financial Events & Salary Countdown
 * 
 * Features:
 * - Salary countdown cards
 * - Support program countdown
 * - Financial events list
 * - Add new financial event
 */

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, ActivityIndicator } from 'react-native';
import { I18nManager } from 'react-native';

// Theme colors
const THEME = {
  primary: '#C9A063',
  secondary: '#8A6B3D',
  background: '#FAF7F2',
  surface: '#FFFFFF',
  text: '#2F2B25',
  textSecondary: '#6F6557',
  border: '#DCD7CF',
  error: '#B45A4D',
  success: '#7A9A74',
};

// Mock financial data
const MOCK_SALARY = {
  name: 'راتب شهر ذو الحجة 1447',
  amount: 12000,
  daysRemaining: 15,
  nextDate: '2026-06-25',
  status: 'confirmed',
};

const MOCK_SUPPORT = [
  { id: 1, name: 'حساب المواطن', amount: 2000, daysRemaining: 8, status: 'pending' },
  { id: 2, name: 'ضمان اجتماعي', amount: 1500, daysRemaining: 22, status: 'confirmed' },
];

const MOCK_BILLS = [
  { id: 1, name: 'فواتير الكهرباء', amount: 350, daysRemaining: 5 },
  { id: 2, name: 'فاتورة الجوال', amount: 200, daysRemaining: 12 },
];

export default function SalaryScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', amount: '', date: '' });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingLogo}>💰</Text>
        <Text style={styles.loadingText}>جاري تحميل المواعيد المالية...</Text>
        <ActivityIndicator size="large" color={THEME.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💰 المواعيد المالية</Text>
        <Pressable style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButtonText}>+ إضافة</Text>
        </Pressable>
      </View>

      {/* Main Salary Card */}
      <View style={styles.mainSalaryCard}>
        <View style={styles.salaryHeader}>
          <View style={styles.salaryIconContainer}>
            <Text style={styles.salaryIcon}>💵</Text>
          </View>
          <View style={styles.salaryInfo}>
            <Text style={styles.salaryTitle}>{MOCK_SALARY.name}</Text>
            <Text style={styles.salaryAmount}>{MOCK_SALARY.amount.toLocaleString()} ر.س</Text>
          </View>
        </View>
        <View style={styles.salaryCountdown}>
          <View style={styles.countdownItem}>
            <Text style={styles.countdownNumber}>{MOCK_SALARY.daysRemaining}</Text>
            <Text style={styles.countdownLabel}>يوم متبقي</Text>
          </View>
          <View style={styles.countdownDivider} />
          <View style={styles.countdownItem}>
            <Text style={styles.countdownDate}>{MOCK_SALARY.nextDate}</Text>
            <Text style={styles.countdownLabel}>تاريخ الصرف</Text>
          </View>
        </View>
        {MOCK_SALARY.status === 'confirmed' && (
          <View style={styles.confirmedBadge}>
            <Text style={styles.confirmedText}>✓ موثق رسمياً</Text>
          </View>
        )}
      </View>

      {/* Support Programs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏛️ برامج الدعم</Text>
        {MOCK_SUPPORT.map((item) => (
          <View key={item.id} style={styles.supportCard}>
            <View style={styles.supportIconContainer}>
              <Text style={styles.supportIcon}>🏛️</Text>
            </View>
            <View style={styles.supportInfo}>
              <Text style={styles.supportName}>{item.name}</Text>
              <Text style={styles.supportAmount}>{item.amount.toLocaleString()} ر.س</Text>
            </View>
            <View style={styles.supportCountdown}>
              <Text style={styles.supportDays}>{item.daysRemaining}</Text>
              <Text style={styles.supportDaysLabel}>يوم</Text>
            </View>
            {item.status === 'pending' && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>قيد المراجعة</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Bills Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📄 الفواتير والالتزامات</Text>
        {MOCK_BILLS.map((item) => (
          <View key={item.id} style={styles.billCard}>
            <View style={styles.billInfo}>
              <Text style={styles.billName}>{item.name}</Text>
              <Text style={styles.billAmount}>{item.amount} ر.س</Text>
            </View>
            <View style={styles.billCountdown}>
              <Text style={styles.billDays}>متبقي {item.daysRemaining} يوم</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer spacing */}
      <View style={styles.footer} />

      {/* Add Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>إضافة موعد مالي جديد</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>اسم الموعد</Text>
              <TextInput
                style={styles.input}
                placeholder="مثال: راتب شهر محرم"
                value={newEvent.name}
                onChangeText={(text) => setNewEvent({ ...newEvent, name: text })}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>المبلغ (اختياري)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={newEvent.amount}
                onChangeText={(text) => setNewEvent({ ...newEvent, amount: text })}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>تاريخ الاستحقاق</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={newEvent.date}
                onChangeText={(text) => setNewEvent({ ...newEvent, date: text })}
              />
            </View>

            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </Pressable>
              <Pressable style={styles.submitButton}>
                <Text style={styles.submitButtonText}>إضافة</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 120,
    backgroundColor: THEME.background,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  loadingContainer: {
    flex: 1,
    paddingBottom: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.background,
  },
  loadingLogo: {
    fontSize: 64,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: THEME.textSecondary,
    marginBottom: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.text,
  },
  addButton: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Main Salary Card
  mainSalaryCard: {
    backgroundColor: THEME.surface,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: THEME.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  salaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  salaryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  salaryIcon: {
    fontSize: 28,
  },
  salaryInfo: {
    flex: 1,
    paddingBottom: 120,
  },
  salaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 4,
  },
  salaryAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME.primary,
  },
  salaryCountdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: THEME.background,
    borderRadius: 12,
    padding: 16,
  },
  countdownItem: {
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME.primary,
  },
  countdownDate: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  countdownLabel: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginTop: 4,
  },
  countdownDivider: {
    width: 1,
    height: 40,
    backgroundColor: THEME.border,
  },
  confirmedBadge: {
    backgroundColor: THEME.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  confirmedText: {
    color: THEME.success,
    fontWeight: '600',
    fontSize: 12,
  },

  // Sections
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: 12,
  },

  // Support Cards
  supportCard: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  supportIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: THEME.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  supportIcon: {
    fontSize: 22,
  },
  supportInfo: {
    flex: 1,
    paddingBottom: 120,
  },
  supportName: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 2,
  },
  supportAmount: {
    fontSize: 14,
    color: THEME.success,
    fontWeight: '600',
  },
  supportCountdown: {
    alignItems: 'center',
    marginLeft: 12,
  },
  supportDays: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.primary,
  },
  supportDaysLabel: {
    fontSize: 10,
    color: THEME.textSecondary,
  },
  pendingBadge: {
    backgroundColor: THEME.error + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  pendingText: {
    color: THEME.error,
    fontSize: 10,
    fontWeight: '600',
  },

  // Bills
  billCard: {
    backgroundColor: THEME.surface,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  billInfo: {},
  billName: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME.text,
    marginBottom: 2,
  },
  billAmount: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  billCountdown: {
    backgroundColor: THEME.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  billDays: {
    fontSize: 12,
    color: THEME.textSecondary,
    fontWeight: '500',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    paddingBottom: 120,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: THEME.surface,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: THEME.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: THEME.text,
    borderWidth: 1,
    borderColor: THEME.border,
    direction: 'rtl',
    textAlign: 'right',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingBottom: 120,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  submitButton: {
    flex: 1,
    paddingBottom: 120,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: THEME.primary,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },

  footer: {
    height: 100,
  },
});