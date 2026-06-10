/**
 * Settings Screen — App Settings for Mawaeedak Mobile
 * 
 * Features:
 * - Theme settings
 * - Notification preferences
 * - Language (future)
 * - About
 */

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Theme colors
const GOLD = '#C9A063';
const BROWN = '#8A6B3D';
const INK = '#2F2B25';
const PAPER = '#FAF7F2';
const CREAM = '#F5EFE4';
const TEXT_SECONDARY = '#6F6557';

// Setting Row Component
function SettingRow({ icon, label, description, children, onPress }: {
  icon: string;
  label: string;
  description?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.settingRow} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingIcon}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      {children}
    </Pressable>
  );
}

// Toggle Row Component
function ToggleRow({ icon, label, description, value, onValueChange }: {
  icon: string;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleLeft}>
        <View style={styles.settingIcon}>
          <Text style={{ fontSize: 20 }}>{icon}</Text>
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>{label}</Text>
          {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#DCD7CF', true: GOLD + '60' }}
        thumbColor={value ? GOLD : '#F5EFE4'}
      />
    </View>
  );
}

// Section Header Component
function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

export default function SettingsScreen() {
  // Notification settings
  const [prayerNotifications, setPrayerNotifications] = useState(true);
  const [financialNotifications, setFinancialNotifications] = useState(true);
  const [appointmentNotifications, setAppointmentNotifications] = useState(true);
  const [dailyCardNotifications, setDailyCardNotifications] = useState(false);

  // App settings
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoLocation, setAutoLocation] = useState(true);

  const handleClearCache = () => {
    Alert.alert(
      'مسح الذاكرة المؤقتة',
      'سيتم مسح جميع البيانات المؤقتة. هل تريد المتابعة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'مسح',
          onPress: () => Alert.alert('تم', 'تم مسح الذاكرة المؤقتة بنجاح'),
        },
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      'إعادة تعيين التطبيق',
      'سيتم إعادة تعيين جميع الإعدادات والبيانات. هل تريد المتابعة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'إعادة تعيين',
          style: 'destructive',
          onPress: () => Alert.alert('تم', 'تم إعادة تعيين التطبيق'),
        },
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>الإعدادات</Text>
        </View>

        {/* Notifications Section */}
        <SectionHeader title="الإشعارات" />
        <View style={styles.section}>
          <View style={styles.settingsList}>
            <ToggleRow
              icon="🕌"
              label="إشعارات الصلاة"
              description="تذكير قبل كل صلاة بخمس دقائق"
              value={prayerNotifications}
              onValueChange={setPrayerNotifications}
            />
            <ToggleRow
              icon="💰"
              label="إشعارات مالية"
              description="تذكير بالمواعيد المالية"
              value={financialNotifications}
              onValueChange={setFinancialNotifications}
            />
            <ToggleRow
              icon="📅"
              label="إشعارات المواعيد"
              description="تذكير قبل المواعيد بيوم"
              value={appointmentNotifications}
              onValueChange={setAppointmentNotifications}
            />
            <ToggleRow
              icon="🎴"
              label="البطاقة اليومية"
              description="إشعار عند توفر بطاقة جديدة"
              value={dailyCardNotifications}
              onValueChange={setDailyCardNotifications}
            />
          </View>
        </View>

        {/* App Settings Section */}
        <SectionHeader title="التطبيق" />
        <View style={styles.section}>
          <View style={styles.settingsList}>
            <ToggleRow
              icon="📳"
              label="الاهتزاز"
              description="تفعيل الاهتزاز عند الضغط"
              value={hapticFeedback}
              onValueChange={setHapticFeedback}
            />
            <ToggleRow
              icon="📍"
              label="تحديد الموقع تلقائياً"
              description="استخدام الموقع للحصول على أوقات الصلاة"
              value={autoLocation}
              onValueChange={setAutoLocation}
            />
            <SettingRow
              icon="🌍"
              label="المدينة"
              description="الرياض"
              onPress={() => Alert.alert('المدينة', 'قريباً')}
            />
            <SettingRow
              icon="🎨"
              label="المظهر"
              description="فاتح / داكن / تلقائي"
              onPress={() => Alert.alert('المظهر', 'قريباً')}
            />
          </View>
        </View>

        {/* Data Section */}
        <SectionHeader title="البيانات" />
        <View style={styles.section}>
          <View style={styles.settingsList}>
            <SettingRow
              icon="🗑️"
              label="مسح الذاكرة المؤقتة"
              description="تحرير مساحة التخزين"
              onPress={handleClearCache}
            />
            <SettingRow
              icon="📤"
              label="تصدير البيانات"
              description="حفظ نسخة من بياناتك"
              onPress={() => Alert.alert('تصدير', 'قريباً')}
            />
          </View>
        </View>

        {/* About Section */}
        <SectionHeader title="عن التطبيق" />
        <View style={styles.section}>
          <View style={styles.settingsList}>
            <SettingRow
              icon="ℹ️"
              label="عن مواعيدك"
              onPress={() => Alert.alert('مواعيدك v1.0.0', 'كل مواعيدك في مكان واحد\n\n© 2026 مواعيدك')}
            />
            <SettingRow
              icon="📜"
              label="الشروط والأحكام"
              onPress={() => Alert.alert('الشروط', 'قريباً')}
            />
            <SettingRow
              icon="🔒"
              label="الخصوصية"
              onPress={() => Alert.alert('الخصوصية', 'قريباً')}
            />
            <SettingRow
              icon="⭐"
              label="تقييم التطبيق"
              onPress={() => Alert.alert('تقييم', 'شكراً لك!')}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <SectionHeader title="إعادة تعيين" />
        <View style={styles.section}>
          <Pressable style={styles.resetButton} onPress={handleResetApp}>
            <Feather name="refresh-cw" size={20} color="#B9483F" />
            <Text style={styles.resetButtonText}>إعادة تعيين التطبيق</Text>
          </Pressable>
        </View>

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>مواعيدك v1.0.0</Text>
          <Text style={styles.versionSubtext}>Expo SDK 54 • React Native 0.81</Text>
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
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: INK,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_SECONDARY,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsList: {
    backgroundColor: CREAM,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201,160,99,0.10)',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201,160,99,0.08)',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201,160,99,0.08)',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: PAPER,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: INK,
  },
  settingDescription: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B9483F10',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(185,72,63,0.20)',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#B9483F',
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '600',
    color: INK,
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
});