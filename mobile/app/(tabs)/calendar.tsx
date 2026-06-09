/**
 * Calendar Screen — Appointment and Event Calendar
 * 
 * Features:
 * - Monthly calendar view
 * - Day selection
 * - Add appointment modal
 * - Event indicators
 */

import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
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

// Mock data types
type AppointmentEvent = { type: 'appointment'; title: string; time: string };
type FinancialEvent = { type: 'financial'; title: string; amount: string };
type PrayerEvent = { type: 'prayer'; title: string };
type MockEvent = AppointmentEvent | FinancialEvent | PrayerEvent;

const MOCK_EVENTS: Record<string, MockEvent> = {
  '2026-06-10': { type: 'appointment', title: 'زيارة طبيب الأسنان', time: '10:00 ص' },
  '2026-06-15': { type: 'financial', title: 'صرف الراتب', amount: '12,000' },
  '2026-06-18': { type: 'appointment', title: 'تجديد الإقامة', time: '02:00 م' },
  '2026-06-22': { type: 'financial', title: 'حساب المواطن', amount: '2,000' },
  '2026-06-25': { type: 'prayer', title: 'أول رمضان' },
};

const DAYS = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const HOURS = Array.from({ length: 12 }, (_, i) => `${i + 1}:00`);

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  // Get first day of month and total days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Adjust for RTL (Sunday = 0 in RTL, but we want Saturday = 0)
  const adjustedFirstDay = (firstDay + 1) % 7;

  const formatDate = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const isToday = (day: number) => {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const getEventForDate = (day: number) => {
    const dateStr = formatDate(day);
    return MOCK_EVENTS[dateStr as keyof typeof MOCK_EVENTS];
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayPress = (day: number) => {
    const dateStr = formatDate(day);
    setSelectedDate(dateStr);
  };

  const handleHourPress = (hour: number) => {
    setSelectedHour(hour);
    setShowAddModal(true);
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before first day
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null);
  }
  
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={goToPrevMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>›</Text>
        </Pressable>
        <View>
          <Text style={styles.monthYear}>{MONTHS[month]} {year}</Text>
          <Text style={styles.hijriDate}>التاريخ الهجري</Text>
        </View>
        <Pressable onPress={goToNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>‹</Text>
        </Pressable>
      </View>

      {/* Days header */}
      <View style={styles.daysHeader}>
        {DAYS.map((day) => (
          <Text key={day} style={styles.dayHeaderText}>{day}</Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }
          
          const event = getEventForDate(day);
          const isSelected = selectedDate === formatDate(day);
          const isTodayDate = isToday(day);

          return (
            <Pressable
              key={day}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellSelected,
                isTodayDate && styles.dayCellToday,
              ]}
              onPress={() => handleDayPress(day)}
            >
              <Text style={[
                styles.dayText,
                isSelected && styles.dayTextSelected,
                isTodayDate && styles.dayTextToday,
              ]}>
                {day}
              </Text>
              {event && (
                <View style={[
                  styles.eventDot,
                  event.type === 'financial' && styles.eventDotFinancial,
                  event.type === 'prayer' && styles.eventDotPrayer,
                ]} />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Selected Date Details */}
      {selectedDate && (
        <View style={styles.selectedDateCard}>
          <Text style={styles.selectedDateTitle}>
            {new Date(selectedDate).toLocaleDateString('ar-SA', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          
          {MOCK_EVENTS[selectedDate] ? (
            <View style={styles.eventDetails}>
              <View style={styles.eventItem}>
                <Text style={styles.eventIcon}>
                  {MOCK_EVENTS[selectedDate].type === 'financial' ? '💰' : '📅'}
                </Text>
                <View>
                  <Text style={styles.eventTitle}>
                    {MOCK_EVENTS[selectedDate].title}
                  </Text>
                  {'time' in MOCK_EVENTS[selectedDate] && (
                    <Text style={styles.eventTime}>
                      {(MOCK_EVENTS[selectedDate] as AppointmentEvent).time}
                    </Text>
                  )}
                  {'amount' in MOCK_EVENTS[selectedDate] && (
                    <Text style={styles.eventAmount}>
                      {(MOCK_EVENTS[selectedDate] as FinancialEvent).amount} ر.س
                    </Text>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <Pressable style={styles.addButton} onPress={() => setShowAddModal(true)}>
              <Text style={styles.addButtonText}>+ إضافة موعد</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Time Slots */}
      <ScrollView style={styles.timeSlots} showsVerticalScrollIndicator={false}>
        <Text style={styles.timeSlotsTitle}>اختر الوقت</Text>
        <View style={styles.timeGrid}>
          {HOURS.map((hour, index) => (
            <Pressable
              key={index}
              style={styles.timeSlot}
              onPress={() => handleHourPress(index + 1)}
            >
              <Text style={styles.timeSlotText}>{hour}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>إضافة موعد جديد</Text>
            <Text style={styles.modalSubtitle}>
              {selectedDate && new Date(selectedDate).toLocaleDateString('ar-SA')}
              {selectedHour && ` - ${selectedHour}:00`}
            </Text>
            
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalButtonText}>إلغاء</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.modalButtonPrimary]}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>إضافة</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 120,
    backgroundColor: THEME.background,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  navButtonText: {
    fontSize: 24,
    color: THEME.primary,
    fontWeight: 'bold',
  },
  monthYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.text,
    textAlign: 'center',
  },
  hijriDate: {
    fontSize: 12,
    color: THEME.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  daysHeader: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  dayHeaderText: {
    flex: 1,
    paddingBottom: 120,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  dayCellSelected: {
    backgroundColor: THEME.primary,
    borderRadius: 20,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: THEME.primary,
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: THEME.text,
    fontWeight: '500',
  },
  dayTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  dayTextToday: {
    color: THEME.primary,
    fontWeight: 'bold',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.secondary,
    marginTop: 2,
  },
  eventDotFinancial: {
    backgroundColor: THEME.success,
  },
  eventDotPrayer: {
    backgroundColor: THEME.primary,
  },
  selectedDateCard: {
    backgroundColor: THEME.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  selectedDateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: 12,
  },
  eventDetails: {
    marginTop: 8,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIcon: {
    fontSize: 24,
    marginLeft: 12,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.text,
  },
  eventTime: {
    fontSize: 13,
    color: THEME.textSecondary,
    marginTop: 2,
  },
  eventAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.success,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: THEME.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  timeSlots: {
    flex: 1,
    paddingBottom: 120,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  timeSlotsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: 12,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    backgroundColor: THEME.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  timeSlotText: {
    fontSize: 14,
    color: THEME.text,
    fontWeight: '500',
  },
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
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: THEME.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingBottom: 120,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  modalButtonPrimary: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  modalButtonTextPrimary: {
    color: '#FFF',
  },
});