/**
 * Home Screen — Main entry point for Mawaeedak Mobile
 * 
 * Features:
 * - Prayer times countdown
 * - Financial events countdown
 * - Upcoming appointments
 * - Quick actions
 */

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { I18nManager } from 'react-native';

// Theme colors (Saudi Identity)
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

// Mock data for demo
const MOCK_PRAYER_TIMES = {
  fajr: '04:30',
  sunrise: '05:45',
  dhuhr: '11:45',
  asr: '15:15',
  maghrib: '18:45',
  isha: '20:00',
  nextPrayer: 'العصر',
  nextPrayerTime: '15:15',
  countdown: '2 ساعة و 30 دقيقة',
};

const MOCK_FINANCIAL_EVENTS = [
  { id: 1, name: 'راتب شهر ذو الحجة', daysRemaining: 15, amount: '12,000 ر.س', type: 'salary' },
  { id: 2, name: 'حساب المواطن', daysRemaining: 8, amount: '2,000 ر.س', type: 'support' },
];

const MOCK_APPOINTMENTS = [
  { id: 1, title: 'زيارة الطبيب', date: '15/06/2026', time: '10:00 ص', type: 'medical' },
  { id: 2, title: 'تجديد الإقامة', date: '18/06/2026', time: '02:00 م', type: 'official' },
];

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingLogo}>🕌</Text>
        <Text style={styles.loadingText}>جاري تحميل مواعيدك...</Text>
        <ActivityIndicator size="large" color={THEME.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>أهلاً بك</Text>
          <Text style={styles.dateText}>التاريخ الهجري</Text>
        </View>
        <Text style={styles.logo}>🕌 مواعيدك</Text>
      </View>

      {/* Prayer Times Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>🕌 الصلاة القادمة</Text>
          <Text style={styles.prayerBadge}>{MOCK_PRAYER_TIMES.nextPrayer}</Text>
        </View>
        <Text style={styles.prayerTimeLarge}>{MOCK_PRAYER_TIMES.nextPrayerTime}</Text>
        <Text style={styles.countdown}>متبقي: {MOCK_PRAYER_TIMES.countdown}</Text>
        
        <View style={styles.prayerTimesRow}>
          {Object.entries(MOCK_PRAYER_TIMES).slice(0, 6).map(([key, value]) => (
            <View key={key} style={styles.prayerTimeItem}>
              <Text style={styles.prayerTimeLabel}>{key}</Text>
              <Text style={styles.prayerTimeValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Financial Countdown */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>💰 المواعيد المالية</Text>
        <Pressable>
          <Text style={styles.seeAll}>عرض الكل</Text>
        </Pressable>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {MOCK_FINANCIAL_EVENTS.map((event) => (
          <View key={event.id} style={styles.financialCard}>
            <View style={[styles.financialIcon, { backgroundColor: event.type === 'salary' ? THEME.primary : THEME.success }]}>
              <Text style={styles.financialIconText}>{event.type === 'salary' ? '💰' : '🏛️'}</Text>
            </View>
            <Text style={styles.financialName}>{event.name}</Text>
            <Text style={styles.financialAmount}>{event.amount}</Text>
            <View style={styles.daysBadge}>
              <Text style={styles.daysText}>متبقي {event.daysRemaining} يوم</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Upcoming Appointments */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📅 المواعيد القادمة</Text>
        <Pressable>
          <Text style={styles.seeAll}>عرض الكل</Text>
        </Pressable>
      </View>

      {MOCK_APPOINTMENTS.map((appointment) => (
        <Pressable key={appointment.id} style={styles.appointmentCard}>
          <View style={styles.appointmentIcon}>
            <Text>{appointment.type === 'medical' ? '🏥' : '🏛️'}</Text>
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentTitle}>{appointment.title}</Text>
            <Text style={styles.appointmentDate}>{appointment.date} - {appointment.time}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}

      {/* Quick Actions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>⚡ إجراءات سريعة</Text>
      </View>

      <View style={styles.quickActions}>
        <Pressable style={styles.quickAction}>
          <Text style={styles.quickActionIcon}>📅</Text>
          <Text style={styles.quickActionLabel}>إضافة موعد</Text>
        </Pressable>
        <Pressable style={styles.quickAction}>
          <Text style={styles.quickActionIcon}>💰</Text>
          <Text style={styles.quickActionLabel}>تاريخ مالي</Text>
        </Pressable>
        <Pressable style={styles.quickAction}>
          <Text style={styles.quickActionIcon}>🕌</Text>
          <Text style={styles.quickActionLabel}>القبلة</Text>
        </Pressable>
        <Pressable style={styles.quickAction}>
          <Text style={styles.quickActionIcon}>📍</Text>
          <Text style={styles.quickActionLabel}>اتجاه القبلة</Text>
        </Pressable>
      </View>

      {/* Footer spacing */}
      <View style={styles.footer} />
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
  greeting: {
    fontSize: 14,
    color: THEME.textSecondary,
  },
  dateText: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginTop: 4,
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.primary,
  },

  // Card
  card: {
    backgroundColor: THEME.surface,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.text,
  },
  prayerBadge: {
    backgroundColor: THEME.primary,
    color: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  prayerTimeLarge: {
    fontSize: 36,
    fontWeight: 'bold',
    color: THEME.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  countdown: {
    fontSize: 14,
    color: THEME.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  prayerTimesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    paddingTop: 12,
  },
  prayerTimeItem: {
    alignItems: 'center',
  },
  prayerTimeLabel: {
    fontSize: 10,
    color: THEME.textSecondary,
    marginBottom: 4,
  },
  prayerTimeValue: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.text,
  },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.text,
  },
  seeAll: {
    fontSize: 14,
    color: THEME.primary,
    fontWeight: '600',
  },

  // Horizontal Scroll
  horizontalScroll: {
    paddingRight: 16,
  },
  financialCard: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 160,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  financialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  financialIconText: {
    fontSize: 20,
  },
  financialName: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 4,
  },
  financialAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.primary,
    marginBottom: 8,
  },
  daysBadge: {
    backgroundColor: THEME.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  daysText: {
    fontSize: 11,
    color: THEME.textSecondary,
  },

  // Appointments
  appointmentCard: {
    backgroundColor: THEME.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  appointmentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: THEME.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  appointmentInfo: {
    flex: 1,
    paddingBottom: 120,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 4,
  },
  appointmentDate: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  chevron: {
    fontSize: 24,
    color: THEME.textSecondary,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  quickAction: {
    alignItems: 'center',
    padding: 12,
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    color: THEME.text,
    fontWeight: '500',
  },

  footer: {
    height: 100,
  },
});